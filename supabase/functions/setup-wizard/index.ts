
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Check if the request method is valid
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
  
  try {
    const requestData = await req.json();
    console.log("Received setup request:", requestData);
    
    // Get database connection string
    const connectionString = Deno.env.get("SUPABASE_DB_URL");
    if (!connectionString) {
      console.error("ERROR: Database connection string (SUPABASE_DB_URL) is missing!");
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Database connection string not found in environment variables" 
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Create a client and connect to the database
    const client = new Client(connectionString);
    
    try {
      console.log("Connecting to database...");
      await client.connect();
      console.log("Connected to database successfully");
      
      const sql = `
        CREATE TABLE IF NOT EXISTS site_settings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          site_title VARCHAR(255),
          default_language TEXT,
          enable_registration BOOLEAN,
          enable_search_indexing BOOLEAN,
          meta_description TEXT,
          meta_keywords TEXT,
          custom_scripts JSONB,
          created_at TIMESTAMPTZ DEFAULT NOW(),
          updated_at TIMESTAMPTZ DEFAULT NOW(),
          homepage_slug VARCHAR(255),
          favicon_url TEXT,
          maintenance_mode BOOLEAN,
          contact_email VARCHAR(255),
          google_analytics_id VARCHAR(255),
          enable_cookie_consent BOOLEAN,
          enable_https_redirect BOOLEAN,
          max_upload_size BIGINT,
          enable_user_avatars BOOLEAN,
          logo_url TEXT
        );

        -- Create supported_language enum if it doesn't exist
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'supported_language') THEN
            CREATE TYPE supported_language AS ENUM ('en', 'fr', 'uk');
          END IF;
        END
        $$;

        -- Check if we need to alter the column to use the enum
        DO $$
        BEGIN
          IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'site_settings' 
            AND column_name = 'default_language' 
            AND data_type = 'text'
          ) THEN
            ALTER TABLE site_settings ALTER COLUMN default_language TYPE supported_language USING default_language::supported_language;
          END IF;
        END
        $$;

        -- Enable Row-Level Security
        ALTER TABLE IF EXISTS site_settings ENABLE ROW LEVEL SECURITY;

        -- Create RLS policies
        DROP POLICY IF EXISTS "Allow anonymous read access to site_settings" ON site_settings;
        CREATE POLICY "Allow anonymous read access to site_settings"
        ON site_settings
        FOR SELECT
        TO anon
        USING (true);

        DROP POLICY IF EXISTS "Allow authenticated read access to site_settings" ON site_settings;
        CREATE POLICY "Allow authenticated read access to site_settings"
        ON site_settings
        FOR SELECT
        TO authenticated
        USING (true);

        DROP POLICY IF EXISTS "Allow admin full access to site_settings" ON site_settings;
        CREATE POLICY "Allow admin full access to site_settings"
        ON site_settings
        FOR ALL
        TO authenticated
        USING (
            EXISTS (
                SELECT 1 FROM user_roles
                WHERE user_id = auth.uid() AND role = 'admin'
            )
        );

        -- Insert default values if not exists
        INSERT INTO site_settings (
          id, 
          site_title, 
          default_language, 
          enable_registration, 
          enable_search_indexing, 
          custom_scripts, 
          created_at, 
          updated_at,
          homepage_slug, 
          favicon_url, 
          maintenance_mode, 
          contact_email, 
          google_analytics_id, 
          enable_cookie_consent, 
          enable_https_redirect, 
          max_upload_size, 
          enable_user_avatars, 
          logo_url
        )
        SELECT 
          'c58d6cba-34dc-4ac6-b9fe-b19cad7eb3ec', 
          'Elloria', 
          'en'::supported_language, 
          true, 
          true, 
          '[]'::jsonb, 
          NOW(), 
          NOW(),
          'index', 
          NULL, 
          false, 
          'sales@elloria.ca', 
          NULL, 
          false, 
          false, 
          10, 
          false, 
          NULL
        WHERE NOT EXISTS (SELECT 1 FROM site_settings);
      `;

      console.log("Executing database setup SQL...");
      await client.queryArray(sql);
      console.log("Database setup completed successfully");

      return new Response(JSON.stringify({ 
        success: true, 
        message: "Database setup completed successfully" 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } catch (err) {
      console.error("SQL Execution Error:", err);
      return new Response(JSON.stringify({ 
        success: false, 
        error: `Database setup failed: ${err.message}` 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    } finally {
      // Ensure the client connection is closed
      try {
        await client.end();
        console.log("Database connection closed");
      } catch (err) {
        console.error("Error closing database connection:", err);
      }
    }
  } catch (err) {
    console.error("Request processing error:", err);
    return new Response(JSON.stringify({ 
      success: false, 
      error: `Failed to process request: ${err.message}` 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
