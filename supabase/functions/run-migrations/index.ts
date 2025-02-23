
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { supabaseUrl, supabaseKey } = await req.json();
    
    // Initialize Supabase client with provided credentials
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Execute migrations in order
    const migrations = [
      // Create custom types
      `DO $$ BEGIN
        CREATE TYPE user_role AS ENUM ('admin', 'client');
        CREATE TYPE post_status AS ENUM ('draft', 'published');
        CREATE TYPE page_view_type AS ENUM ('page_view', 'action');
        CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed');
        CREATE TYPE invoice_status AS ENUM ('pending', 'paid', 'overdue', 'cancelled');
        CREATE TYPE supported_currency AS ENUM ('USD', 'EUR', 'GBP', 'CAD');
        CREATE TYPE supported_language AS ENUM ('en', 'es', 'fr');
        CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'done');
        CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');
        CREATE TYPE task_category AS ENUM ('development', 'design', 'marketing', 'other');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;`,

      // Create core tables (profiles, pages, etc)
      `CREATE TABLE IF NOT EXISTS profiles (
        id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
        email text,
        full_name text,
        created_at timestamptz DEFAULT timezone('utc'::text, now())
      );`,

      `CREATE TABLE IF NOT EXISTS user_roles (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
        role user_role NOT NULL DEFAULT 'client',
        created_at timestamptz DEFAULT timezone('utc'::text, now())
      );`,

      // Additional table creation statements would go here...
    ];

    console.log('Starting migrations...');

    for (const migration of migrations) {
      const { error } = await supabase.rpc('create_table', { sql: migration });
      if (error) {
        console.error('Migration error:', error);
        throw error;
      }
    }

    console.log('Migrations completed successfully');

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error running migrations:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
