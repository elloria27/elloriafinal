import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature');
    
    if (!signature) {
      return new Response('No signature provided', { status: 400 });
    }

    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      console.error('Stripe webhook secret not configured');
      return new Response('Webhook secret not configured', { status: 500 });
    }

    const body = await req.text();
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 });
    }

    console.log('Processing webhook event:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log('Checkout session completed:', session.id);

      // Update order in database
      const { error: updateError } = await supabaseClient
        .from('orders')
        .update({
          status: 'paid',
          stripe_session_id: session.id,
          payment_method: 'stripe'
        })
        .eq('stripe_session_id', session.id);

      if (updateError) {
        console.error('Error updating order:', updateError);
        return new Response('Error updating order', { status: 500 });
      }

      // Broadcast message to clear cart
      const { error: broadcastError } = await supabaseClient
        .from('broadcast')
        .insert({
          type: 'CLEAR_CART',
          user_id: session.client_reference_id,
          created_at: new Date().toISOString()
        });

      if (broadcastError) {
        console.error('Error broadcasting clear cart message:', broadcastError);
      }

      console.log('Order updated and cart clear message broadcasted successfully');
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      status: 200,
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }
});