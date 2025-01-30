import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@13.6.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

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

      // Retrieve the session with line items
      const checkoutSession = await stripe.checkout.sessions.retrieve(session.id, {
        expand: ['line_items', 'total_details'],
      });

      console.log('Checkout session details:', checkoutSession);

      // Calculate the final amount including discounts
      const totalAmount = checkoutSession.amount_total ? checkoutSession.amount_total / 100 : 0;
      const discountAmount = checkoutSession.total_details?.amount_discount ? checkoutSession.total_details.amount_discount / 100 : 0;
      const originalAmount = totalAmount + discountAmount;

      console.log('Amount details:', {
        totalAmount,
        discountAmount,
        originalAmount
      });

      // Update order status in database
      const { error: updateError } = await supabase
        .from('orders')
        .update({ 
          status: 'paid',
          payment_method: 'stripe',
          total_amount: totalAmount, // Update with the actual paid amount
          applied_promo_code: discountAmount > 0 ? {
            ...checkoutSession.metadata.promoCode ? JSON.parse(checkoutSession.metadata.promoCode) : {},
            original_amount: originalAmount,
            discounted_amount: totalAmount
          } : null
        })
        .eq('stripe_session_id', session.id);

      if (updateError) {
        console.error('Error updating order status:', updateError);
        throw updateError;
      }

      console.log('Order status updated to paid successfully');

      // Send order confirmation email
      try {
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('stripe_session_id', session.id)
          .single();

        if (orderError) throw orderError;

        await supabase.functions.invoke('send-order-status-email', {
          body: {
            customerEmail: session.customer_details?.email || orderData.shipping_address.email,
            customerName: session.customer_details?.name || 
              `${orderData.shipping_address.first_name} ${orderData.shipping_address.last_name}`.trim() || 
              'Valued Customer',
            orderId: orderData.id,
            orderNumber: orderData.order_number,
            newStatus: 'paid'
          }
        });
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