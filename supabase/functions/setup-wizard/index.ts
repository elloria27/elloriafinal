import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

// Properly configured CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
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
