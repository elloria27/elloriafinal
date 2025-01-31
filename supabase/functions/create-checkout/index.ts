import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { 
      items, 
      paymentMethodId, 
      shippingCost, 
      taxes, 
      promoCode, 
      subtotal,
      shippingAddress,
      billingAddress
    } = await req.json();
    
    console.log('Creating checkout session with:', {
      items,
      paymentMethodId,
      shippingCost,
      taxes,
      promoCode,
      subtotal,
      shippingAddress
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
    
    if (authHeader && authHeader !== 'null') {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user } } = await supabaseClient.auth.getUser(token);
      if (user) {
        userEmail = user.email;
        userId = user.id;
      }
    }

    // Get payment method details from database
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

    // Calculate discount amount if promo code exists
    let discountAmount = 0;
    if (promoCode) {
      discountAmount = promoCode.type === 'percentage' 
        ? (totalAmount * promoCode.value) / 100
        : promoCode.value;
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
      totalAmount
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
      user_id: userId, // Will be null for guest checkout
      profile_id: userId, // Will be null for guest checkout
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