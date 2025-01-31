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

  if (req.method === 'OPTIONS') {
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
      shippingAddress
    } = requestBody;

    if (!items?.length || !paymentMethodId || !shippingAddress) {
      console.error('Missing required fields');
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

    // Create temporary profile for guest users
    const tempProfileId = crypto.randomUUID();
    const tempProfileData = {
      id: tempProfileId,
      full_name: `${shippingAddress.first_name} ${shippingAddress.last_name}`,
      email: shippingAddress.email,
      phone_number: shippingAddress.phone,
      address: shippingAddress.address,
      country: shippingAddress.country,
      region: shippingAddress.region
    };

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert(tempProfileData);

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

    // Get payment method details
    const { data: paymentMethod, error: paymentMethodError } = await supabaseAdmin
      .from('payment_methods')
      .select('*')
      .eq('id', paymentMethodId)
      .single();

    if (paymentMethodError || !paymentMethod?.stripe_config?.secret_key) {
      console.error('Invalid payment method:', paymentMethodError || 'Missing Stripe config');
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

    // Calculate total amount
    const totalAmount = subtotal + (shippingCost || 0) + 
      (subtotal * ((taxes?.gst || 0) + (taxes?.pst || 0) + (taxes?.hst || 0)) / 100);

    // Calculate discount if promo code exists
    let discountAmount = 0;
    if (promoCode) {
      discountAmount = promoCode.type === 'percentage' 
        ? (totalAmount * promoCode.value) / 100
        : promoCode.value;
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
        lineItems.push({
          price_data: {
            currency: 'cad',
            product_data: {
              name: 'GST (5%)',
            },
            unit_amount: Math.round((subtotal * taxes.gst / 100) * 100),
          },
          quantity: 1,
        });
      }
      
      if (taxes.pst > 0) {
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
      
      if (taxes.hst > 0) {
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
    }

    // Create Stripe coupon for promo code if applicable
    let discounts = [];
    if (promoCode && discountAmount > 0) {
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
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
    });

    // Create order record
    const orderData = {
      order_number: orderNumber,
      total_amount: totalAmount - discountAmount,
      status: 'pending',
      items: items,
      shipping_address: shippingAddress,
      billing_address: shippingAddress,
      stripe_session_id: session.id,
      payment_method: 'stripe',
      applied_promo_code: promoCode,
      profile_id: tempProfileId
    };

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