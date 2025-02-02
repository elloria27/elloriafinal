import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const url = new URL(req.url)
    const path = url.pathname.split('/mobile-api/')[1]

    // Add logging for debugging
    console.log('Request path:', path)
    console.log('Request method:', req.method)

    // Add new Stripe payment endpoints
    if (path === 'stripe/config') {
      if (req.method === 'GET') {
        console.log('Fetching Stripe configuration');
        
        const { data: paymentMethod, error: paymentError } = await supabaseClient
          .from('payment_methods')
          .select('stripe_config')
          .eq('name', 'stripe')
          .single();

        if (paymentError) {
          console.error('Error fetching Stripe config:', paymentError);
          throw paymentError;
        }

        // Only return the publishable key, never the secret key
        return new Response(
          JSON.stringify({
            publishableKey: paymentMethod.stripe_config.publishable_key
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    if (path === 'stripe/create-payment') {
      if (req.method === 'POST') {
        console.log('Creating Stripe payment');
        
        const { amount, currency = 'usd' } = await req.json();

        // Get Stripe secret key from payment_methods
        const { data: paymentMethod, error: paymentError } = await supabaseClient
          .from('payment_methods')
          .select('stripe_config')
          .eq('name', 'stripe')
          .single();

        if (paymentError) {
          console.error('Error fetching Stripe config:', paymentError);
          throw paymentError;
        }

        const stripe = new Stripe(paymentMethod.stripe_config.secret_key, {
          apiVersion: '2023-10-16',
        });

        try {
          const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Convert to cents
            currency,
            automatic_payment_methods: {
              enabled: true,
            },
          });

          return new Response(
            JSON.stringify({
              clientSecret: paymentIntent.client_secret,
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } catch (stripeError) {
          console.error('Stripe error:', stripeError);
          return new Response(
            JSON.stringify({ error: stripeError.message }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          );
        }
      }
    }

    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
