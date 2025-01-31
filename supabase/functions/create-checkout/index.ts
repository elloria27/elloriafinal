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

  // Handle CORS preflight requests
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

    console.log('Processing checkout with:', {
      itemCount: items?.length,
      paymentMethodId,
      shippingCost,
      taxes,
      promoCode,
      subtotal,
      shippingAddress: shippingAddress ? { ...shippingAddress, email: shippingAddress.email } : null
    });

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    // Get auth user if available, but don't require it
    let userEmail = null;
    let userId = null;
    const authHeader = req.headers.get('Authorization');

    console.log('Auth status:', authHeader ? 'Has auth header' : 'No auth header');

    if (authHeader && authHeader !== 'null' && authHeader !== 'undefined') {
      try {
        const token = authHeader.replace('Bearer ', '');
        console.log('Attempting to get user from token');
        
        const { data: { user }, error } = await supabaseClient.auth.getUser(token);
        if (error) {
          console.error('Auth error:', error);
        } else if (user) {
          userEmail = user.email;
          userId = user.id;
          console.log('Authenticated user:', { userId, userEmail });
        }
      } catch (error) {
        console.error('Error getting user:', error);
      }
    } else {
      console.log('Processing as guest checkout with email:', shippingAddress?.email);
    }

    // Get payment method details from database
    console.log('Fetching payment method:', paymentMethodId);
    const { data: paymentMethod, error: paymentMethodError } = await supabaseClient
      .from('payment_methods')
      .select('*')
      .eq('id', paymentMethodId)
      .maybeSingle();

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

    if (!paymentMethod?.stripe_config) {
      console.error('Invalid payment method configuration:', paymentMethod);
      return new Response(
        JSON.stringify({ error: 'Invalid payment method configuration' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    const stripeConfig = paymentMethod.stripe_config;
    console.log('Retrieved stripe config');

    if (!stripeConfig.secret_key) {
      console.error('Stripe secret key not configured');
      return new Response(
        JSON.stringify({ error: 'Stripe secret key not configured' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400 
        }
      );
    }

    const stripe = new Stripe(stripeConfig.secret_key, {
      apiVersion: '2023-10-16',
    });

    // Calculate total amount including shipping
    const totalAmount = subtotal + (shippingCost || 0) + 
      (subtotal * ((taxes?.gst || 0) + (taxes?.pst || 0) + (taxes?.hst || 0)) / 100);

    console.log('Calculated total amount:', totalAmount);

    // Calculate discount amount if promo code exists
    let discountAmount = 0;
    if (promoCode) {
      discountAmount = promoCode.type === 'percentage' 
        ? (totalAmount * promoCode.value) / 100
        : promoCode.value;
      console.log('Applied discount:', { type: promoCode.type, amount: discountAmount });
    }

    // Create line items for products
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

    // Add shipping as a separate line item if exists
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

    // Add taxes as separate line items
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

    // Create discount coupon if promo code exists
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

    console.log('Creating Stripe checkout session with:', {
      lineItems,
      discounts,
      currency: 'cad',
      totalAmount,
      customerEmail: userEmail || shippingAddress.email
    });

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/order-success`,
      cancel_url: `${req.headers.get('origin')}/checkout`,
      customer_email: userEmail || shippingAddress.email,
      discounts: discounts,
      currency: 'cad',
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
    });

    console.log('Checkout session created:', session.id);

    // Generate order number
    const orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase();

    // Create initial order record
    const orderData = {
      user_id: userId,
      profile_id: userId,
      order_number: orderNumber,
      total_amount: totalAmount - discountAmount,
      status: 'pending',
      items: items,
      shipping_address: shippingAddress,
      billing_address: billingAddress || shippingAddress,
      stripe_session_id: session.id,
      payment_method: 'stripe',
      applied_promo_code: promoCode
    };

    console.log('Creating order record:', { orderNumber, totalAmount: orderData.total_amount });

    const { error: orderError } = await supabaseClient
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