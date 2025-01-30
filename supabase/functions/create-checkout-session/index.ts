import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@13.6.0?target=deno'

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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting checkout session creation...');
    const { items, customerDetails, total, taxes, shippingOption, activePromoCode } = await req.json();
    
    console.log('Request data:', { customerDetails, total, taxes, shippingOption });

    // Generate unique order number
    const orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase();
    console.log('Generated order number:', orderNumber);

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    let discounts = [];
    if (activePromoCode) {
      console.log('Processing promo code:', activePromoCode);
      const { data: promoData } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', activePromoCode.code)
        .single();

      if (promoData) {
        const coupon = await stripe.coupons.create({
          [promoData.type === 'percentage' ? 'percent_off' : 'amount_off']: 
            promoData.type === 'percentage' ? promoData.value : Math.round(promoData.value * 100),
          duration: 'once',
        });
        discounts.push({ coupon: coupon.id });
      }
    }

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/order-success`,
      cancel_url: `${req.headers.get('origin')}/checkout`,
      shipping_options: [{
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: Math.round(shippingOption.price * 100),
            currency: 'usd',
          },
          display_name: shippingOption.name,
        },
      }],
      discounts,
      metadata: {
        orderNumber,
        customerEmail: customerDetails.email,
        customerName: `${customerDetails.firstName} ${customerDetails.lastName}`,
      },
    });

    // Create order in database
    const orderData = {
      order_number: orderNumber,
      user_id: req.headers.get('Authorization')?.split('Bearer ')[1] || null,
      total_amount: total,
      status: 'pending',
      items: items,
      shipping_address: {
        first_name: customerDetails.firstName,
        last_name: customerDetails.lastName,
        email: customerDetails.email,
        phone: customerDetails.phone,
        address: customerDetails.address,
        country: customerDetails.country,
        region: customerDetails.region
      },
      billing_address: {
        first_name: customerDetails.firstName,
        last_name: customerDetails.lastName,
        email: customerDetails.email,
        phone: customerDetails.phone,
        address: customerDetails.address,
        country: customerDetails.country,
        region: customerDetails.region
      },
      payment_method: 'stripe',
      stripe_session_id: session.id
    };

    console.log('Creating order in database:', orderData);

    const { error: orderError } = await supabase
      .from('orders')
      .insert(orderData);

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw new Error('Failed to create order');
    }

    console.log('Order created successfully');
    console.log('Checkout session created:', session.id);

    return new Response(
      JSON.stringify({ url: session.url }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error in create-checkout-session:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});