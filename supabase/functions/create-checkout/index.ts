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
    });

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get user data from the request
    const { data } = await req.json();
    const { items, total, subtotal, taxes, activePromoCode, shippingAddress, shippingCost } = data;

    console.log('Creating checkout session with data:', {
      items,
      total,
      taxes,
      activePromoCode,
      shippingAddress,
      shippingCost
    });

    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    let userId = null;
    let userProfile = null;

    if (authHeader) {
      // Extract the token
      const token = authHeader.replace('Bearer ', '');
      
      // Get user data
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);
      
      if (userError) {
        console.error('Error getting user:', userError);
      }

      if (user) {
        userId = user.id;
        
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        } else {
          userProfile = profileData;
        }
      }
    }

    // Generate a unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Calculate tax rates based on location
    const totalTaxRate = taxes.gst / 100;
    
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
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
      tax_rates: [taxRate.id],
    }));

    // Add shipping as a separate line item if applicable
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
      });
    }

    // Handle promo code discount
    let discounts = [];
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

    // First create the order in pending status
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: userId,
        profile_id: userId,
        order_number: orderNumber,
        total_amount: total,
        status: 'pending',
        items: items,
        shipping_address: shippingAddress,
        billing_address: shippingAddress, // Using shipping address as billing address
        payment_method: 'stripe',
        applied_promo_code: activePromoCode || null
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw new Error('Failed to create order');
    }

    console.log('Order created:', order);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      discounts: discounts,
      success_url: `${req.headers.get('origin')}/order-success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `${req.headers.get('origin')}/checkout`,
      currency: 'cad',
      customer_email: userProfile?.email || shippingAddress.email,
      metadata: {
        order_id: order.id,
        order_number: orderNumber,
        user_id: userId,
        tax_rate: totalTaxRate,
        promo_code: activePromoCode?.code || '',
      },
    });

    // Update order with Stripe session ID
    const { error: updateError } = await supabase
      .from('orders')
      .update({ stripe_session_id: session.id })
      .eq('id', order.id);

    if (updateError) {
      console.error('Error updating order with Stripe session:', updateError);
    }

    console.log('Checkout session created:', session.id);

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});