import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@13.6.0?target=deno';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const signature = req.headers.get('stripe-signature');
    if (!signature || !endpointSecret) {
      console.error('Missing stripe signature or webhook secret');
      throw new Error('Missing stripe signature or webhook secret');
    }

    const body = await req.text();
    console.log('Received webhook event');

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed:`, err);
      return new Response(JSON.stringify({ error: 'Invalid signature' }), { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log('Webhook event type:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log('Processing successful checkout session:', session.id);

      const { data: { session: supabaseSession } } = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items'],
      });

      // Update order status to paid in database
      const { error: updateError } = await fetch(
        `${Deno.env.get('SUPABASE_URL')}/rest/v1/orders`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({ 
            status: 'paid',
            payment_method: 'stripe'
          })
        }
      ).then(res => res.json());

      if (updateError) {
        console.error('Error updating order status:', updateError);
        throw updateError;
      }

      console.log('Order status updated to paid successfully');

      // Send order confirmation email
      try {
        await fetch(
          `${Deno.env.get('SUPABASE_URL')}/functions/v1/send-order-status-email`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`
            },
            body: JSON.stringify({
              customerEmail: session.metadata?.customerEmail,
              customerName: session.metadata?.customerName,
              orderId: session.metadata?.orderNumber,
              orderNumber: session.metadata?.orderNumber,
              newStatus: 'paid'
            })
          }
        );
        console.log('Order confirmation email sent');
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
      }
    }

    return new Response(JSON.stringify({ received: true }), { 
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error in stripe-webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});