import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

serve(async (req) => {
  console.log('Received checkout request');
  console.log('Request method:', req.method);
  console.log('Request headers:', Object.fromEntries(req.headers.entries()));

  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    });
  }

  try {
    const requestBody = await req.json();
    console.log('Request body:', JSON.stringify(requestBody, null, 2));
    
    const { 
      items, 
      paymentMethodId, 
      shippingCost, 
      taxes, 
      promoCode, 
      subtotal,
      shippingAddress,
      billingAddress
    } = requestBody;

    if (!items?.length || !paymentMethodId || !shippingAddress) {
      console.error('Missing required fields:', { 
        hasItems: !!items?.length,
        hasPaymentMethod: !!paymentMethodId,
        hasShippingAddress: !!shippingAddress 
      });
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Initialize Supabase admin client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Get session to check if user is authenticated
    const authHeader = req.headers.get('Authorization');
    let userId = null;
    let profileId = null;

    if (authHeader) {
      // For authenticated users, get their user ID from the session
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
      if (user) {
        userId = user.id;
        profileId = user.id; // Since profile ID is same as user ID
      }
    }

    if (!userId) {
      // For guest users, create a temporary profile using their shipping information
      console.log('Creating temporary profile for guest user');
      const tempProfileData = {
        id: crypto.randomUUID(), // Generate a unique ID
        full_name: `${shippingAddress.first_name} ${shippingAddress.last_name}`,
        email: shippingAddress.email,
        phone_number: shippingAddress.phone,
        address: shippingAddress.address,
        country: shippingAddress.country,
        region: shippingAddress.region
      };

      const { data: tempProfile, error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert(tempProfileData)
        .select()
        .single();

      if (profileError) {
        console.error('Error creating temporary profile:', profileError);
        return new Response(
          JSON.stringify({ error: 'Failed to create temporary profile' }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500 
          }
        );
      }

      userId = tempProfile.id;
      profileId = tempProfile.id;
      console.log('Created temporary profile:', { userId, profileId });
    }

    // Get payment method details from database
    console.log('Fetching payment method:', paymentMethodId);
    const { data: paymentMethod, error: paymentMethodError } = await supabaseAdmin
      .from('payment_methods')
      .select('*')
      .eq('id', paymentMethodId)
      .single();

    if (paymentMethodError) {
      console.error('Error fetching payment method:', paymentMethodError);
      return new Response(
        JSON.stringify({ error: 'Payment method not found' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    if (!paymentMethod?.stripe_config?.secret_key) {
      console.error('Invalid payment method configuration:', paymentMethod);
      return new Response(
        JSON.stringify({ error: 'Invalid payment method configuration' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    const stripe = new Stripe(paymentMethod.stripe_config.secret_key, {
      apiVersion: '2023-10-16',
    });

    // Calculate total amount including shipping and taxes
    const totalAmount = subtotal + (shippingCost || 0) + 
      (subtotal * ((taxes?.gst || 0) + (taxes?.pst || 0) + (taxes?.hst || 0)) / 100);

    console.log('Calculated total amount:', totalAmount);

    // Calculate discount if promo code exists
    let discountAmount = 0;
    if (promoCode) {
      discountAmount = promoCode.type === 'percentage' 
        ? (totalAmount * promoCode.value) / 100
        : promoCode.value;
      console.log('Applied discount:', { type: promoCode.type, amount: discountAmount });
    }

    // Create line items for Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'cad',
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Add shipping as a line item if applicable
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'cad',
          product_data: {
            name: 'Shipping',
          },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      });
    }

    // Add tax line items
    if (taxes) {
      if (taxes.gst > 0) {
        const gstAmount = subtotal * (taxes.gst / 100);
        lineItems.push({
          price_data: {
            currency: 'cad',
            product_data: {
              name: 'GST (5%)',
            },
            unit_amount: Math.round(gstAmount * 100),
          },
          quantity: 1,
        });
      }
      
      if (taxes.pst > 0 && taxes.region !== 'Manitoba') {
        const pstAmount = subtotal * (taxes.pst / 100);
        lineItems.push({
          price_data: {
            currency: 'cad',
            product_data: {
              name: 'PST',
            },
            unit_amount: Math.round(pstAmount * 100),
          },
          quantity: 1,
        });
      }
      
      if (taxes.hst > 0) {
        const hstAmount = subtotal * (taxes.hst / 100);
        lineItems.push({
          price_data: {
            currency: 'cad',
            product_data: {
              name: 'HST',
            },
            unit_amount: Math.round(hstAmount * 100),
          },
          quantity: 1,
        });
      }
    }

    // Create Stripe coupon for promo code if applicable
    let discounts = [];
    if (promoCode && discountAmount > 0) {
      console.log('Creating Stripe coupon for promo code:', promoCode.code);
      const coupon = await stripe.coupons.create({
        amount_off: Math.round(discountAmount * 100),
        currency: 'cad',
        name: `Discount (${promoCode.code})`,
      });
      
      discounts.push({ coupon: coupon.id });
    }

    // Generate order number
    const orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase();

    // Create Stripe checkout session
    console.log('Creating Stripe checkout session');
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/order-success`,
      cancel_url: `${req.headers.get('origin')}/checkout`,
      customer_email: shippingAddress.email,
      discounts: discounts,
      currency: 'cad',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
    });

    console.log('Checkout session created:', session.id);

    // Create order record with the temporary or authenticated user ID
    const orderData = {
      order_number: orderNumber,
      total_amount: totalAmount - discountAmount,
      status: 'pending',
      items: items,
      shipping_address: shippingAddress,
      billing_address: billingAddress || shippingAddress,
      stripe_session_id: session.id,
      payment_method: 'stripe',
      applied_promo_code: promoCode,
      user_id: userId,
      profile_id: profileId
    };

    console.log('Creating order record:', { orderNumber, totalAmount: orderData.total_amount });

    const { error: orderError } = await supabaseAdmin
      .from('orders')
      .insert(orderData);

    if (orderError) {
      console.error('Error creating order:', orderError);
      return new Response(
        JSON.stringify({ error: 'Failed to create order record' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    console.log('Order created successfully, returning checkout URL');
    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error processing checkout:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});