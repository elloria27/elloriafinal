
import { serve } from 'https://deno.fresh.dev/std@v1.0/http/server.ts'
import { writeFileStr } from 'https://deno.fresh.dev/std@v1.0/fs/write_file_string.ts'

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
    if (req.method !== 'POST') {
      throw new Error('Method not allowed')
    }

    const { projectId, supabaseUrl, supabaseKey } = await req.json()

    // Update config.toml
    const configContent = `project_id = "${projectId}"\n`
    await writeFileStr('../config.toml', configContent)

    // Update client.ts
    const clientContent = `import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

let SUPABASE_URL = "${supabaseUrl}"
let SUPABASE_PUBLISHABLE_KEY = "${supabaseKey}"

export let supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)

export function initializeSupabase(url: string, key: string) {
  SUPABASE_URL = url
  SUPABASE_PUBLISHABLE_KEY = key
  supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
  return supabase
}
`
    await writeFileStr('../../src/integrations/supabase/client.ts', clientContent)

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error:', error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
