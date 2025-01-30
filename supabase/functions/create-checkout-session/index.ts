import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@14.21.0'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { items, customerDetails, total, taxes, shippingOption, activePromoCode } = await req.json()
    
    console.log('Creating checkout session with:', { 
      items, 
      customerDetails, 
      total,
      taxes,
      shippingOption,
      activePromoCode
    })

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey)

    // Get shop settings to get Stripe keys
    console.log('Fetching shop settings...')
    const { data: shopSettings, error: settingsError } = await supabaseClient
      .from('shop_settings')
      .select('stripe_settings')
      .single()

    if (settingsError) {
      console.error('Error fetching shop settings:', settingsError)
      throw new Error('Could not fetch shop settings')
    }

    if (!shopSettings?.stripe_settings) {
      throw new Error('Stripe settings not configured')
    }

    const stripeSettings = shopSettings.stripe_settings as {
      secret_key: string;
      publishable_key: string;
    }

    if (!stripeSettings.secret_key) {
      throw new Error('Stripe secret key not configured')
    }

    console.log('Initializing Stripe with secret key...')
    const stripe = new Stripe(stripeSettings.secret_key, {
      apiVersion: '2023-10-16',
    })

    // Calculate any discount from promo code
    let discountAmount = 0;
    if (activePromoCode) {
      console.log('Calculating discount for promo code:', activePromoCode)
      discountAmount = activePromoCode.type === 'percentage'
        ? (total * activePromoCode.value) / 100
        : activePromoCode.value;
      console.log('Calculated discount amount:', discountAmount)
    }

    // Create line items for Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: [item.image],
        },
        unit_amount: Math.round(item.price * 100), // Convert to cents
      },
      quantity: item.quantity,
    }))

    // Add shipping as a line item if provided
    if (shippingOption) {
      console.log('Adding shipping cost:', shippingOption.price)
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Shipping (${shippingOption.name})`,
          },
          unit_amount: Math.round(shippingOption.price * 100),
        },
        quantity: 1,
      })
    }

    // Add taxes as a line item if provided
    if (taxes) {
      const totalTaxAmount = (
        (taxes.gst || 0) + 
        (taxes.pst || 0) + 
        (taxes.hst || 0)
      ) * total / 100

      if (totalTaxAmount > 0) {
        console.log('Adding tax amount:', totalTaxAmount)
        lineItems.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Taxes',
            },
            unit_amount: Math.round(totalTaxAmount * 100),
          },
          quantity: 1,
        })
      }
    }

    // Add discount as a negative line item if there's an active promo code
    if (discountAmount > 0) {
      console.log('Adding discount line item:', discountAmount)
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `Discount (${activePromoCode.code})`,
          },
          unit_amount: -Math.round(discountAmount * 100), // Negative amount for discount
        },
        quantity: 1,
      })
    }

    console.log('Creating Stripe session with line items:', lineItems)

    // Store minimal metadata that won't exceed the 500 character limit
    const minimalMetadata = {
      customer_email: customerDetails.email,
      customer_name: `${customerDetails.firstName} ${customerDetails.lastName}`,
      shipping_country: customerDetails.country,
      shipping_region: customerDetails.region,
      total_amount: total.toString(),
      promo_code: activePromoCode?.code || ''
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/checkout`,
      customer_email: customerDetails.email,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA'],
      },
      metadata: minimalMetadata,
    })

    console.log('Checkout session created:', session.id)

    return new Response(
      JSON.stringify({ url: session.url }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400, // Changed from 500 to 400 for client errors
      }
    )
  }
})