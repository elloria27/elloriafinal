import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeKey) {
      throw new Error('STRIPE_SECRET_KEY is not set');
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    const signature = req.headers.get('stripe-signature');
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    if (!signature || !webhookSecret) {
      throw new Error('Missing stripe-signature or STRIPE_WEBHOOK_SECRET');
    }

    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    console.log('Processing Stripe webhook event:', event.type);

    if (event.type === 'checkout.session.completed') {
      const checkoutSession = event.data.object as Stripe.Checkout.Session;
      console.log('Checkout session completed:', checkoutSession);

      // Calculate the final amounts
      const totalAmount = checkoutSession.amount_total ? checkoutSession.amount_total / 100 : 0;
      const originalAmount = checkoutSession.metadata.originalAmount 
        ? parseFloat(checkoutSession.metadata.originalAmount) 
        : totalAmount;
      const discountAmount = originalAmount - totalAmount;

      // Create Supabase client
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
      
      if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase credentials');
      }

      const supabase = createClient(supabaseUrl, supabaseKey);

      // Update order status and payment details
      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
          status: 'paid',
          payment_method: 'stripe',
          total_amount: totalAmount,
          applied_promo_code: discountAmount > 0 ? {
            ...checkoutSession.metadata.promoCode ? JSON.parse(checkoutSession.metadata.promoCode) : {},
            original_amount: originalAmount,
            discount_amount: discountAmount,
            final_amount: totalAmount
          } : null,
          stripe_session_id: checkoutSession.id
        })
        .eq('id', checkoutSession.metadata.orderId);

      if (updateError) {
        console.error('Error updating order:', updateError);
        throw updateError;
      }

      console.log('Order updated successfully');

      // Clear the user's cart by removing the cart data from localStorage
      // This is handled on the frontend in the success page
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});