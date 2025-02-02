import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Create-donation-checkout - Received request');

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
    console.log('Create-donation-checkout - Request body:', JSON.stringify(requestBody, null, 2));

    // Get payment method details
    const { data: paymentMethod, error: paymentMethodError } = await supabaseAdmin
      .from('payment_methods')
      .select('*')
      .eq('id', requestBody.paymentMethodId)
      .single();

    if (paymentMethodError || !paymentMethod?.stripe_config?.secret_key) {
      console.error('Create-donation-checkout - Invalid payment method:', paymentMethodError || 'Missing Stripe config');
      throw new Error('Invalid payment method configuration');
    }

    if (!requestBody.amount || !requestBody.email) {
      console.error('Create-donation-checkout - Missing required fields');
      throw new Error('Missing required fields');
    }

    const stripe = new Stripe(paymentMethod.stripe_config.secret_key, {
      apiVersion: '2023-10-16',
    });

    console.log('Create-donation-checkout - Creating checkout session');
    
    const session = await stripe.checkout.sessions.create({
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
      console.error('Create-donation-checkout - Error creating donation record:', donationError);
    }

    console.log('Create-donation-checkout - Session created:', session.id);

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Create-donation-checkout - Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});