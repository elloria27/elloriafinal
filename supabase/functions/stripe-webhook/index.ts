import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
});

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature');
    if (!signature) {
      return new Response('No signature', { status: 400 });
    }

    const body = await req.text();
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    
    if (!webhookSecret) {
      throw new Error('Missing Stripe webhook secret');
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );

    console.log('Processing Stripe webhook event:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      // Update order status to processing
      const { error: orderError } = await supabase
        .from('orders')
        .update({ 
          status: 'processing',
          stripe_session_id: session.id
        })
        .eq('stripe_session_id', session.id);

      if (orderError) {
        console.error('Error updating order status:', orderError);
        throw orderError;
      }

      console.log('Order status updated to processing');

      // Send order confirmation email
      try {
        const { data: orderData, error: fetchError } = await supabase
          .from('orders')
          .select('*, profiles(email, full_name)')
          .eq('stripe_session_id', session.id)
          .single();

        if (fetchError) throw fetchError;

        const customerEmail = orderData.profiles?.email || orderData.shipping_address.email;
        const customerName = orderData.profiles?.full_name || 
          `${orderData.shipping_address.first_name || ''} ${orderData.shipping_address.last_name || ''}`.trim() || 
          'Valued Customer';

        if (customerEmail) {
          const { error: emailError } = await supabase.functions.invoke(
            'send-order-email',
            {
              body: {
                orderData,
                customerEmail,
                customerName
              }
            }
          );

          if (emailError) {
            console.error('Error sending order confirmation email:', emailError);
          }
        }
      } catch (emailError) {
        console.error('Error processing order confirmation:', emailError);
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    console.error('Error processing webhook:', err);
    return new Response(err.message, { status: 400 });
  }
});