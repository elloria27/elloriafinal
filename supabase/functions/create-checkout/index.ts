import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const { data: { items, total, subtotal, taxes, activePromoCode, shippingAddress, shippingCost } } = await req.json();
    
    console.log('Processing checkout for items:', items);
    console.log('Shipping address:', shippingAddress);
    console.log('Shipping cost:', shippingCost);
    console.log('Active promo code:', activePromoCode);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Generate a UUID for the user (guest or authenticated)
    const userId = crypto.randomUUID();
    let userProfile = null;

    // Get authentication status and user data
    const authHeader = req.headers.get('Authorization');
    
    if (authHeader) {
      console.log('User is authenticated, fetching profile data');
      
      try {
        const authSupabase = createClient(
          Deno.env.get('SUPABASE_URL') ?? '',
          Deno.env.get('SUPABASE_ANON_KEY') ?? '',
          {
            auth: {
              autoRefreshToken: false,
              persistSession: false,
              detectSessionInUrl: false,
            },
          }
        );

        await authSupabase.auth.setSession({
          access_token: authHeader.replace('Bearer ', ''),
          refresh_token: '',
        });

        const { data: { user }, error: userError } = await authSupabase.auth.getUser();
        
        if (userError) {
          console.error('Error getting authenticated user:', userError);
          throw userError;
        }

        if (user) {
          console.log('Found authenticated user:', user.id);

          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profileError) {
            console.error('Error getting user profile:', profileError);
            throw profileError;
          }

          userProfile = profile;
          console.log('Found authenticated user profile:', userProfile);
        }
      } catch (error) {
        console.error('Error in auth process:', error);
        // Continue as guest if auth fails
      }
    }

    // If no authenticated user or auth failed, create guest profile
    if (!userProfile) {
      console.log('Creating guest profile');
      
      const guestProfile = {
        id: userId,
        full_name: `${shippingAddress.first_name} ${shippingAddress.last_name}`.trim(),
        email: shippingAddress.email,
        phone_number: shippingAddress.phone,
        address: shippingAddress.address,
        country: shippingAddress.country,
        region: shippingAddress.region
      };

      console.log('Inserting guest profile:', guestProfile);

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .insert(guestProfile)
        .select()
        .single();

      if (profileError) {
        console.error('Error creating guest profile:', profileError);
        throw new Error('Failed to create guest profile');
      }

      userProfile = profile;
      console.log('Created guest profile:', userProfile);
    }

    // Calculate tax rates based on location
    const totalTaxRate = (taxes.gst || 0) / 100;
    
    // Create or retrieve tax rate in Stripe
    let taxRate;
    const existingTaxRates = await stripe.taxRates.list({
      active: true,
      limit: 1
    });

    if (existingTaxRates.data.length > 0 && 
        existingTaxRates.data[0].percentage === (totalTaxRate * 100)) {
      taxRate = existingTaxRates.data[0];
    } else {
      taxRate = await stripe.taxRates.create({
        display_name: `GST`,
        description: `GST for ${shippingAddress.region}`,
        percentage: totalTaxRate * 100,
        inclusive: false,
        country: shippingAddress.country,
        jurisdiction: shippingAddress.region,
      });
    }

    // Create line items with tax rates
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'cad',
        product_data: {
          name: item.name,
          description: item.description,
          images: item.image ? [item.image] : undefined,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
      tax_rates: [taxRate.id],
    }));

    // Add shipping cost as a separate line item if present
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'cad',
          product_data: {
            name: 'Shipping',
            description: 'Shipping cost',
          },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
        tax_rates: [taxRate.id],
      });
    }

    // Handle promo code discount
    const discounts = [];
    if (activePromoCode) {
      console.log('Applying promo code:', activePromoCode);
      
      let coupon;
      try {
        coupon = await stripe.coupons.retrieve(activePromoCode.code);
      } catch {
        const couponData = {
          name: activePromoCode.code,
          id: activePromoCode.code,
          duration: 'once',
        };

        if (activePromoCode.type === 'percentage') {
          Object.assign(couponData, {
            percent_off: activePromoCode.value,
          });
        } else {
          Object.assign(couponData, {
            amount_off: Math.round(activePromoCode.value * 100),
            currency: 'cad',
          });
        }

        coupon = await stripe.coupons.create(couponData);
      }

      discounts.push({ coupon: coupon.id });
    }

    // Generate order number
    const orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase();

    // Create order data with complete customer information
    const orderData = {
      user_id: userProfile.id,
      profile_id: userProfile.id,
      order_number: orderNumber,
      total_amount: total,
      status: 'pending',
      items: items,
      shipping_address: {
        first_name: shippingAddress.first_name,
        last_name: shippingAddress.last_name,
        email: userProfile.email,
        phone: shippingAddress.phone,
        address: shippingAddress.address,
        country: shippingAddress.country,
        region: shippingAddress.region
      },
      billing_address: {
        first_name: shippingAddress.first_name,
        last_name: shippingAddress.last_name,
        email: userProfile.email,
        phone: shippingAddress.phone,
        address: shippingAddress.address,
        country: shippingAddress.country,
        region: shippingAddress.region
      },
      payment_method: 'stripe',
      applied_promo_code: activePromoCode
    };

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      discounts: discounts,
      success_url: `${req.headers.get('origin')}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/checkout`,
      customer_email: userProfile.email,
      metadata: {
        order_number: orderNumber,
        user_id: userProfile.id,
        profile_id: userProfile.id,
        shipping_address: JSON.stringify(shippingAddress),
        tax_rate: totalTaxRate,
        promo_code: activePromoCode?.code || '',
      },
    });

    console.log('Created Stripe session:', session.id);

    // Save order to database with complete information
    const { error: orderError } = await supabase
      .from('orders')
      .insert({
        ...orderData,
        stripe_session_id: session.id
      });

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw new Error('Failed to create order in database');
    }

    console.log('Order created successfully:', orderNumber);

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in checkout process:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});