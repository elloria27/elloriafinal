import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

serve(async (req) => {
  console.log('Request received:', req.method, req.url)

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const url = new URL(req.url)
    const path = url.pathname.split('/mobile-api/')[1]

    console.log('Request path:', path)
    console.log('Request method:', req.method)

    // Handle login endpoint without requiring authentication
    if (path === 'login') {
      if (req.method === 'POST') {
        try {
          const { email, password } = await req.json()
          console.log('Login attempt for email:', email)

          if (!email || !password) {
            return new Response(
              JSON.stringify({ error: 'Email and password are required' }),
              { 
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
              }
            )
          }

          const { data: authData, error: authError } = await supabaseClient.auth.signInWithPassword({
            email: email.trim(),
            password: password.trim(),
          })

          if (authError) {
            console.error('Login error:', authError)
            return new Response(
              JSON.stringify({ error: authError.message }),
              { 
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
              }
            )
          }

          if (!authData.user) {
            console.error('No user data after successful login')
            return new Response(
              JSON.stringify({ error: 'Authentication failed' }),
              { 
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
              }
            )
          }

          // Get user role after successful login
          const { data: roleData, error: roleError } = await supabaseClient
            .from('user_roles')
            .select('role')
            .eq('user_id', authData.user.id)
            .single()

          if (roleError) {
            console.error('Error fetching role:', roleError)
            return new Response(
              JSON.stringify({ error: 'Error fetching user role' }),
              { 
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
              }
            )
          }

          // Return both auth data and role
          const responseData = {
            ...authData,
            role: roleData?.role || 'client'
          }

          console.log('Login successful for user:', authData.user.id)
          return new Response(
            JSON.stringify(responseData),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } catch (error) {
          console.error('Error processing login:', error)
          return new Response(
            JSON.stringify({ error: 'Invalid login request' }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }
      }
    }

    // For all other endpoints, require authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('No authorization header')
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    console.log('Authenticating with token:', token.substring(0, 10) + '...')
    
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    
    if (authError || !user) {
      console.error('Auth error:', authError)
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log('Authenticated user:', user.id)

    // Handle profile endpoints
    if (path === 'profile') {
      if (req.method === 'GET') {
        console.log('Fetching profile for user:', user.id)
        const { data, error } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error fetching profile:', error)
          return new Response(
            JSON.stringify({ error: error.message }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        return new Response(
          JSON.stringify(data),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      if (req.method === 'PUT') {
        console.log('Updating profile for user:', user.id)
        const updates = await req.json()
        const { data, error } = await supabaseClient
          .from('profiles')
          .update(updates)
          .eq('id', user.id)
          .select()
          .single()

        if (error) {
          console.error('Error updating profile:', error)
          return new Response(
            JSON.stringify({ error: error.message }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }

        return new Response(
          JSON.stringify(data),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    // Handle Stripe payment endpoints
    if (path === 'stripe/config') {
      if (req.method === 'GET') {
        console.log('Fetching Stripe configuration')
        
        const { data: paymentMethod, error: paymentError } = await supabaseClient
          .from('payment_methods')
          .select('stripe_config')
          .eq('name', 'stripe')
          .single()

        if (paymentError) {
          console.error('Error fetching Stripe config:', paymentError)
          throw paymentError
        }

        return new Response(
          JSON.stringify({
            publishableKey: paymentMethod.stripe_config.publishable_key
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }
    }

    if (path === 'stripe/create-payment') {
      if (req.method === 'POST') {
        console.log('Creating Stripe payment')
        
        const { amount, currency = 'usd' } = await req.json()

        const { data: paymentMethod, error: paymentError } = await supabaseClient
          .from('payment_methods')
          .select('stripe_config')
          .eq('name', 'stripe')
          .single()

        if (paymentError) {
          console.error('Error fetching Stripe config:', paymentError)
          throw paymentError
        }

        const stripe = new Stripe(paymentMethod.stripe_config.secret_key, {
          apiVersion: '2023-10-16',
        })

        try {
          const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency,
            automatic_payment_methods: {
              enabled: true,
            },
          })

          return new Response(
            JSON.stringify({
              clientSecret: paymentIntent.client_secret,
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } catch (stripeError) {
          console.error('Stripe error:', stripeError)
          return new Response(
            JSON.stringify({ error: stripeError.message }),
            { 
              status: 400,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
          )
        }
      }
    }

    // If no matching route is found
    console.error('No matching route found for path:', path)
    return new Response(
      JSON.stringify({ error: 'Endpoint not found: /' + path }),
      { 
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
