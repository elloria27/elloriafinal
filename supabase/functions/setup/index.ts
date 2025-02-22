
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0'
import { configureSupabase } from '../../../src/utils/supabaseSetup.ts'

serve(async (req) => {
  if (req.method === 'POST') {
    try {
      const { project_id, supabase_url, supabase_key } = await req.json()
      
      await configureSupabase({
        project_id,
        supabase_url,
        supabase_key
      })

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { 'Content-Type': 'application/json' } }
      )
    } catch (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
  }

  return new Response(
    JSON.stringify({ error: 'Method not allowed' }),
    { status: 405, headers: { 'Content-Type': 'application/json' } }
  )
})
