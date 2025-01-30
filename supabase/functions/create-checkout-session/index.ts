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
    const { items, customerDetails, total } = await req.json()
    
    console.log('Creating checkout session with:', { items, customerDetails, total })

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

    console.log('Creating Stripe session with line items:', lineItems)

    // Store minimal metadata that won't exceed the 500 character limit
    const minimalMetadata = {
      customer_email: customerDetails.email,
      customer_name: `${customerDetails.firstName} ${customerDetails.lastName}`,
      shipping_country: customerDetails.country,
      shipping_region: customerDetails.region,
      total_amount: total.toString()
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
        status: 500,
      }
    )
  }
})