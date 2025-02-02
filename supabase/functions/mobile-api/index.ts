import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  phone_number: string | null;
  address: string | null;
  country: string | null;
  region: string | null;
}

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  features: string[];
  specifications: {
    length: string;
    absorption: string;
    quantity: string;
    material: string;
    features: string;
  };
  slug: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Extract the token from the Authorization header
    const token = authHeader.replace('Bearer ', '')

    // Verify the token and get the user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const url = new URL(req.url)
    const endpoint = url.pathname.split('/').pop()

    switch (endpoint) {
      case 'profile':
        // Get user profile
        const { data: profile, error: profileError } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) {
          throw profileError
        }

        return new Response(
          JSON.stringify(profile),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'products':
        // Get all products
        const { data: products, error: productsError } = await supabaseClient
          .from('products')
          .select('*')

        if (productsError) {
          throw productsError
        }

        return new Response(
          JSON.stringify(products),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

      case 'chat':
        if (req.method === 'GET') {
          // Get user's chat history
          const { data: chats, error: chatsError } = await supabaseClient
            .from('chat_interactions')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

          if (chatsError) {
            throw chatsError
          }

          return new Response(
            JSON.stringify(chats),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        } else if (req.method === 'POST') {
          // Add new chat interaction
          const { message, response } = await req.json()
          
          const { data: newChat, error: chatError } = await supabaseClient
            .from('chat_interactions')
            .insert([
              {
                user_id: user.id,
                message,
                response
              }
            ])
            .select()
            .single()

          if (chatError) {
            throw chatError
          }

          return new Response(
            JSON.stringify(newChat),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          )
        }
        break

      default:
        return new Response(
          JSON.stringify({ error: 'Endpoint not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})