import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Create-checkout - Received request');

  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders,
      status: 204
    });
  }

  try {
    // Get user ID from auth token
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Get auth token from request header
    const authHeader = req.headers.get('Authorization');
    let userId = null;
    let userProfile = null;

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error } = await supabaseClient.auth.getUser(token);
      
      if (user && !error) {
        console.log('Create-checkout - Authenticated user:', user.id);
        userId = user.id;
        
        // Get user profile
        const { data: profile } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
          
        if (profile) {
          userProfile = profile;
          console.log('Create-checkout - Found user profile:', profile.id);
        }
      }
    }

    const requestBody = await req.json();
    console.log('Create-checkout - Request body:', JSON.stringify(requestBody, null, 2));
    
    const { 
      items, 
      paymentMethodId, 
      shippingCost, 
      taxes, 
      promoCode, 
      subtotal,
      shippingAddress
    } = requestBody;

    console.log('Create-checkout - Shipping address:', shippingAddress);
    console.log('Create-checkout - Shipping cost:', shippingCost);
    console.log('Create-checkout - Taxes:', taxes);

    if (!items?.length || !paymentMethodId || !shippingAddress) {
      console.error('Create-checkout - Missing required fields');
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    // Email validation
    if (!shippingAddress.email) {
      console.error('Create-checkout - Email is missing from shipping address');
      return new Response(
        JSON.stringify({ error: 'Email address is required' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    const email = shippingAddress.email.trim();
    console.log('Create-checkout - Processing checkout for email:', email);

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

    // Get payment method details
    const { data: paymentMethod, error: paymentMethodError } = await supabaseAdmin
      .from('payment_methods')
      .select('*')
      .eq('id', paymentMethodId)
      .single();

    if (paymentMethodError || !paymentMethod?.stripe_config?.secret_key) {
      console.error('Create-checkout - Invalid payment method:', paymentMethodError || 'Missing Stripe config');
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

    // Calculate discount if promo code exists (only on items, not shipping or taxes)
    let discountAmount = 0;
    if (promoCode) {
      discountAmount = promoCode.type === 'percentage' 
        ? (subtotal * promoCode.value) / 100
        : promoCode.value;
    }

    // Create line items for products with discount applied
    const lineItems = items.map((item: any) => {
      const itemTotal = item.price * item.quantity;
      const itemDiscount = promoCode 
        ? (promoCode.type === 'percentage' 
          ? (itemTotal * promoCode.value) / 100 
          : (itemTotal / subtotal) * promoCode.value)
        : 0;

      return {
        price_data: {
          currency: 'cad',
          product_data: {
            name: item.name,
            images: item.image ? [item.image] : [],
          },
          unit_amount: Math.round((item.price - (itemDiscount / item.quantity)) * 100),
        },
        quantity: item.quantity,
      };
    });

    // Add shipping as a separate line item (no discount)
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

    // Add tax line items (based on original subtotal, no discount on taxes)
    const gstAmount = taxes?.gst ? (subtotal * taxes.gst / 100) : 0;
    if (gstAmount > 0) {
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
    
    // Only add PST if not Manitoba
    if (taxes?.pst > 0 && shippingAddress.region !== "Manitoba") {
      lineItems.push({
        price_data: {
          currency: 'cad',
          product_data: {
            name: 'PST',
          },
          unit_amount: Math.round((subtotal * taxes.pst / 100) * 100),
        },
        quantity: 1,
      });
    }
    
    if (taxes?.hst > 0) {
      lineItems.push({
        price_data: {
          currency: 'cad',
          product_data: {
            name: 'HST',
          },
          unit_amount: Math.round((subtotal * taxes.hst / 100) * 100),
        },
        quantity: 1,
      });
    }

    // Generate order number
    const orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase();

    console.log('Create-checkout - Creating Stripe checkout session with email:', email);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/order-success`,
      cancel_url: `${req.headers.get('origin')}/checkout`,
      customer_email: email,
      client_reference_id: userId, // Add user ID to Stripe session
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
    });

    // Calculate total amount including taxes and shipping
    const totalAmount = subtotal - discountAmount + shippingCost + 
      (subtotal * ((taxes?.gst || 0) + (shippingAddress.region !== "Manitoba" ? (taxes?.pst || 0) : 0) + (taxes?.hst || 0)) / 100);

    // Create order record with user_id and profile_id
    const orderData = {
      order_number: orderNumber,
      total_amount: totalAmount,
      status: 'pending',
      items: items,
      shipping_address: shippingAddress,
      billing_address: shippingAddress,
      stripe_session_id: session.id,
      payment_method: 'stripe',
      applied_promo_code: promoCode,
      shipping_cost: shippingCost || 0,
      gst: gstAmount || 0,
      user_id: userId, // Add user ID to order
      profile_id: userId // Add profile ID to order
    };

    console.log('Create-checkout - Creating order with data:', JSON.stringify(orderData, null, 2));

    const { error: orderError } = await supabaseAdmin
      .from('orders')
      .insert(orderData);

    if (orderError) {
      console.error('Create-checkout - Error creating order:', orderError);
      return new Response(
        JSON.stringify({ error: 'Failed to create order record' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 500 
        }
      );
    }

    console.log('Create-checkout - Order created successfully');

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Create-checkout - Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});