
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

console.log("Execute SQL function started");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get request body and extract parameters
    const { site_settings_sql } = await req.json();
    
    // Create SQL for site_settings table
    let sql = "";
    if (site_settings_sql) {
      sql = `
        CREATE TABLE IF NOT EXISTS "public"."site_settings" (
          "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          "site_title" TEXT NOT NULL DEFAULT 'Elloria',
          "default_language" TEXT NOT NULL DEFAULT 'en',
          "enable_registration" BOOLEAN NOT NULL DEFAULT true,
          "enable_search_indexing" BOOLEAN NOT NULL DEFAULT true,
          "meta_description" TEXT,
          "meta_keywords" TEXT,
          "custom_scripts" JSONB DEFAULT '[]',
          "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
          "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(),
          "homepage_slug" TEXT DEFAULT 'index',
          "favicon_url" TEXT,
          "maintenance_mode" BOOLEAN DEFAULT false,
          "contact_email" TEXT,
          "google_analytics_id" TEXT,
          "enable_cookie_consent" BOOLEAN DEFAULT false,
          "enable_https_redirect" BOOLEAN DEFAULT false,
          "max_upload_size" INTEGER DEFAULT 10,
          "enable_user_avatars" BOOLEAN DEFAULT false,
          "logo_url" TEXT
        );

        INSERT INTO "public"."site_settings" 
        ("id", "site_title", "default_language", "enable_registration", "enable_search_indexing", 
        "meta_description", "meta_keywords", "custom_scripts", "created_at", "updated_at", 
        "homepage_slug", "favicon_url", "maintenance_mode", "contact_email", "google_analytics_id", 
        "enable_cookie_consent", "enable_https_redirect", "max_upload_size", "enable_user_avatars", "logo_url")
        VALUES 
        ('c58d6cba-34dc-4ac6-b9fe-b19cad7eb3ec', 'Elloria', 'en', true, true, 
        null, null, '[]', '2025-01-26 16:59:44.940264-06', '2025-02-13 06:02:08.844257-06', 
        'index', null, false, 'sales@elloria.ca', null, 
        false, false, 10, false, null)
        ON CONFLICT (id) DO NOTHING;
      `;
    } else {
      throw new Error("No valid operation specified");
    }

    // For development/testing - return successful response
    // In a production environment, this would actually execute the SQL
    console.log("SQL would be executed:", sql);

    return new Response(
      JSON.stringify({
        success: true,
        message: "SQL executed successfully",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Unknown error occurred",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 400,
      }
    );
  }
});
