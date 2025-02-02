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

    const requestBody = await req.json();
    console.log('Create-checkout - Request body:', JSON.stringify(requestBody, null, 2));

    // Get payment method details
    const { data: paymentMethod, error: paymentMethodError } = await supabaseAdmin
      .from('payment_methods')
      .select('*')
      .eq('id', requestBody.paymentMethodId)
      .single();

    if (paymentMethodError || !paymentMethod?.stripe_config?.secret_key) {
      console.error('Create-checkout - Invalid payment method:', paymentMethodError || 'Missing Stripe config');
      throw new Error('Invalid payment method configuration');
    }

    const stripe = new Stripe(paymentMethod.stripe_config.secret_key, {
      apiVersion: '2023-10-16',
    });

    let session;

    if (requestBody.type === 'donation') {
      // Handle donation checkout
      if (!requestBody.amount || !requestBody.email) {
        console.error('Create-checkout - Missing required fields for donation');
        throw new Error('Missing required fields for donation');
      }

      console.log('Create-checkout - Creating donation checkout session');
      
      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'cad',
              product_data: {
                name: 'Donation',
                description: 'Thank you for your support',
              },
              unit_amount: Math.round(requestBody.amount * 100),
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.get('origin')}/donation?success=true`,
        cancel_url: `${req.headers.get('origin')}/donation?canceled=true`,
        customer_email: requestBody.email,
      });

      // Create donation record
      const { error: donationError } = await supabaseAdmin
        .from('donations')
        .insert({
          amount: requestBody.amount,
          donor_email: requestBody.email,
          donor_name: requestBody.name,
          status: 'pending',
          payment_method: 'stripe',
          stripe_session_id: session.id,
        });

      if (donationError) {
        console.error('Create-checkout - Error creating donation record:', donationError);
      }
    } else {
      // Handle regular product checkout
      if (!requestBody.items || !requestBody.shippingAddress) {
        console.error('Create-checkout - Missing required fields for product checkout');
        throw new Error('Missing required fields for product checkout');
      }

      console.log('Create-checkout - Creating product checkout session');

      const lineItems = requestBody.items.map((item: any) => ({
        price_data: {
          currency: 'cad',
          product_data: {
            name: item.name,
            description: item.description || undefined,
            images: item.image ? [item.image] : undefined,
          },
          unit_amount: Math.round(item.price * 100),
        },
        quantity: item.quantity,
      }));

      // Add shipping cost as a separate line item if present
      if (requestBody.shippingCost > 0) {
        lineItems.push({
          price_data: {
            currency: 'cad',
            product_data: {
              name: 'Shipping',
              description: 'Shipping cost',
            },
            unit_amount: Math.round(requestBody.shippingCost * 100),
          },
          quantity: 1,
        });
      }

      session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${req.headers.get('origin')}/checkout/success`,
        cancel_url: `${req.headers.get('origin')}/checkout/cancel`,
        customer_email: requestBody.shippingAddress.email,
        shipping_address_collection: {
          allowed_countries: ['CA', 'US'],
        },
      });
    }

    console.log('Create-checkout - Session created:', session.id);

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