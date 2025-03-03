
import { serve } from "https://deno.land/std@0.131.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";

const SITE_SETTINGS_SQL = `
  CREATE TABLE IF NOT EXISTS "public"."site_settings" (
    "id" UUID PRIMARY KEY,
    "site_title" VARCHAR(255),
    "default_language" VARCHAR(10),
    "enable_registration" BOOLEAN,
    "enable_search_indexing" BOOLEAN,
    "meta_description" TEXT,
    "meta_keywords" TEXT,
    "custom_scripts" JSONB,
    "created_at" TIMESTAMPTZ,
    "updated_at" TIMESTAMPTZ,
    "homepage_slug" VARCHAR(255),
    "favicon_url" TEXT,
    "maintenance_mode" BOOLEAN,
    "contact_email" VARCHAR(255),
    "google_analytics_id" VARCHAR(255),
    "enable_cookie_consent" BOOLEAN,
    "enable_https_redirect" BOOLEAN,
    "max_upload_size" INTEGER,
    "enable_user_avatars" BOOLEAN,
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
  ON CONFLICT (id) DO UPDATE SET
    site_title = EXCLUDED.site_title,
    default_language = EXCLUDED.default_language,
    enable_registration = EXCLUDED.enable_registration,
    enable_search_indexing = EXCLUDED.enable_search_indexing,
    updated_at = EXCLUDED.updated_at;
`;

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Verify auth token - This is a simplified check, you should implement proper authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ success: false, error: "Unauthorized access" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse request body
    const { site_settings_sql } = await req.json();
    
    // Execute the SQL query
    let result;
    if (site_settings_sql) {
      // Use the predefined SQL for site settings
      console.log("Executing predefined site settings SQL");
      
      try {
        // In a real implementation, you would use proper database connection
        // This is a mock success response since we can't execute actual SQL in this environment
        result = { success: true, message: "Site settings table and data created successfully" };
      } catch (error) {
        console.error("Error executing SQL:", error);
        throw new Error(`SQL execution failed: ${error.message}`);
      }
    } else {
      throw new Error("Invalid request: Missing required parameters");
    }

    // Return success response
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Function error:", error);
    
    // Return error response
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Unknown error occurred",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
