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
    const { items, paymentMethodId, shippingCost, taxes, promoCode, subtotal } = await req.json();
    
    console.log('Creating checkout session with:', {
      items,
      paymentMethodId,
      shippingCost,
      taxes,
      promoCode,
      subtotal
    });
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Get payment method details from database
    const { data: paymentMethod, error: paymentMethodError } = await supabaseClient
      .from('payment_methods')
      .select('*')
      .eq('id', paymentMethodId)
      .single();

    if (paymentMethodError || !paymentMethod?.stripe_config) {
      console.error('Error fetching payment method:', paymentMethodError);
      throw new Error('Payment method not found or invalid configuration');
    }

    const stripeConfig = paymentMethod.stripe_config;
    console.log('Retrieved stripe config');

    if (!stripeConfig.secret_key) {
      throw new Error('Stripe secret key not configured');
    }

    const stripe = new Stripe(stripeConfig.secret_key, {
      apiVersion: '2023-10-16',
    });

    // Get auth user if available
    let userEmail = null;
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data } = await supabaseClient.auth.getUser(token);
      userEmail = data.user?.email;
    }

    // Calculate discount amount if promo code exists
    let discountAmount = 0;
    if (promoCode) {
      discountAmount = promoCode.type === 'percentage' 
        ? (subtotal * promoCode.value) / 100
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
        unit_amount: Math.round(item.price * 100), // Convert to cents
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

    // Add GST as a separate line item if exists
    if (taxes && taxes.gst > 0) {
      const gstAmount = subtotal * (taxes.gst / 100);
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
      currency: 'cad'
    });

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/order-success`,
      cancel_url: `${req.headers.get('origin')}/checkout`,
      customer_email: userEmail,
      discounts: discounts,
      currency: 'cad',
    });

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