
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { writeAll } from "https://deno.land/std@0.168.0/streams/write_all.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { projectId, supabaseUrl, supabaseKey } = await req.json();

    // Update config.toml
    const configContent = `project_id = "${projectId}"\n`;
    const encoder = new TextEncoder();
    const data = encoder.encode(configContent);
    
    const configPath = new URL('../../config.toml', import.meta.url);
    const configFile = await Deno.open(configPath, { write: true, create: true, truncate: true });
    await writeAll(configFile, data);
    configFile.close();

    // Update client.ts
    const clientContent = `import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

let SUPABASE_URL = "${supabaseUrl}";
let SUPABASE_PUBLISHABLE_KEY = "${supabaseKey}";

export let supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

export function initializeSupabase(url: string, key: string) {
  SUPABASE_URL = url;
  SUPABASE_PUBLISHABLE_KEY = key;
  supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  return supabase;
}
`;
    const clientData = encoder.encode(clientContent);
    const clientPath = new URL('../../../src/integrations/supabase/client.ts', import.meta.url);
    const clientFile = await Deno.open(clientPath, { write: true, create: true, truncate: true });
    await writeAll(clientFile, clientData);
    clientFile.close();

    console.log('Successfully updated configuration files');
    
    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error configuring Supabase:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
