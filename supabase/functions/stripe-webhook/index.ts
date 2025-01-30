import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@13.6.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature');
    if (!signature || !endpointSecret) {
      throw new Error('Missing stripe signature or webhook secret');
    }

    const body = await req.text();
    console.log('Received webhook event');

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed:`, err);
      return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 400 });
    }

    console.log('Webhook event type:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log('Processing successful checkout session:', session.id);

      // Update order status to paid in database
      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
          status: 'paid',
          payment_method: 'stripe' // Ensure payment method is set to stripe
        })
        .eq('stripe_session_id', session.id);

      if (updateError) {
        console.error('Error updating order status:', updateError);
        throw updateError;
      }

      console.log('Order status updated to paid successfully');

      // Send order confirmation email
      try {
        await supabase.functions.invoke('send-order-status-email', {
          body: {
            customerEmail: session.metadata.customerEmail,
            customerName: session.metadata.customerName,
            orderId: session.metadata.orderNumber,
            orderNumber: session.metadata.orderNumber,
            newStatus: 'paid'
          }
        });
        console.log('Order confirmation email sent');
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
      }
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 });
  } catch (error) {
    console.error('Error in stripe-webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
});