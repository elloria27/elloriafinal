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
    
    console.log('Request data:', { customerDetails, total, taxes, shippingOption, activePromoCode });

    // Get user ID from auth header if it exists
    let userId = null;
    const authHeader = req.headers.get('Authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error: userError } = await supabase.auth.getUser(token);
      if (userError) {
        console.error('Error getting user:', userError);
      } else if (user) {
        userId = user.id;
        console.log('User ID retrieved:', userId);
      }
    }

    // Generate unique order number
    const orderNumber = Math.random().toString(36).substr(2, 9).toUpperCase();
    console.log('Generated order number:', orderNumber);

    // Calculate tax amounts
    const gstAmount = (total * (taxes.gst || 0)) / 100;
    const pstAmount = (total * (taxes.pst || 0)) / 100;
    const hstAmount = (total * (taxes.hst || 0)) / 100;
    const totalTaxAmount = gstAmount + pstAmount + hstAmount;
    
    console.log('Tax calculations:', {
      gstAmount,
      pstAmount,
      hstAmount,
      totalTaxAmount
    });

    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'cad', // Changed to CAD
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Add tax line item if there are taxes
    if (totalTaxAmount > 0) {
      lineItems.push({
        price_data: {
          currency: 'cad', // Changed to CAD
          product_data: {
            name: 'Taxes',
            description: `GST: ${taxes.gst}%, PST: ${taxes.pst}%, HST: ${taxes.hst}%`,
          },
          unit_amount: Math.round(totalTaxAmount * 100),
        },
        quantity: 1,
      });
    }

    let discounts = [];
    let appliedPromoCode = null;
    if (activePromoCode) {
      console.log('Processing promo code:', activePromoCode);
      const { data: promoData } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', activePromoCode.code)
        .single();

      if (promoData) {
        appliedPromoCode = promoData;
        const coupon = await stripe.coupons.create({
          [promoData.type === 'percentage' ? 'percent_off' : 'amount_off']: 
            promoData.type === 'percentage' ? promoData.value : Math.round(promoData.value * 100),
          duration: 'once',
          currency: promoData.type === 'fixed' ? 'cad' : undefined, // Only set currency for fixed amounts
        });
        discounts.push({ coupon: coupon.id });
      }
    }

    const finalAmount = total + totalTaxAmount + shippingOption.price;
    console.log('Final amount with taxes and shipping:', finalAmount);

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/order-success`,
      cancel_url: `${req.headers.get('origin')}/checkout`,
      currency: 'cad', // Set currency to CAD
      shipping_options: [{
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: Math.round(shippingOption.price * 100),
            currency: 'cad', // Changed to CAD
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
      user_id: userId,
      profile_id: userId,
      total_amount: finalAmount,
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
      stripe_session_id: session.id,
      applied_promo_code: appliedPromoCode ? {
        code: appliedPromoCode.code,
        type: appliedPromoCode.type,
        value: appliedPromoCode.value,
        original_amount: finalAmount,
        discounted_amount: appliedPromoCode.type === 'percentage' 
          ? finalAmount * (1 - appliedPromoCode.value / 100)
          : finalAmount - appliedPromoCode.value
      } : null
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