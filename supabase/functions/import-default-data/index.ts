
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { corsHeaders } from "../_shared/cors.ts";

const PROJECT_ID = Deno.env.get("SUPABASE_PROJECT_ID") || "";
const SUPABASE_URL = `https://${PROJECT_ID}.supabase.co`;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

console.log("Function import-default-data starting...");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("Processing import-default-data request...");
    const { siteTitle, defaultLanguage } = await req.json();

    // Create a Supabase client with the service role key for admin privileges
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Create the necessary tables if they don't exist
    await createRequiredTables(supabase);

    // Import default site settings
    await importSiteSettings(supabase, siteTitle, defaultLanguage);

    // Import sample content blocks for pages
    await importSamplePages(supabase);

    // Import other required data
    await setupRLS(supabase);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Default data imported successfully" 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in import-default-data:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

async function createRequiredTables(supabase) {
  console.log("Creating required tables if they don't exist...");
  
  // Create user roles table and enum type if they don't exist
  const { error: userRoleTypeError } = await supabase.rpc('create_types', {
    sql: `
      DO $$ 
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
          CREATE TYPE user_role AS ENUM ('admin', 'client');
        END IF;
      END $$;
    `
  });
  
  if (userRoleTypeError) {
    console.error("Error creating user_role type:", userRoleTypeError);
  }

  // Create user_roles table if it doesn't exist
  const { error: userRolesTableError } = await supabase.rpc('create_table', {
    sql: `
      CREATE TABLE IF NOT EXISTS public.user_roles (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL,
        role user_role NOT NULL DEFAULT 'client',
        created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
      );
    `
  });
  
  if (userRolesTableError) {
    console.error("Error creating user_roles table:", userRolesTableError);
  }

  // Create site_settings table if it doesn't exist
  const { error: siteSettingsTableError } = await supabase.rpc('create_table', {
    sql: `
      CREATE TABLE IF NOT EXISTS public.site_settings (
        id TEXT PRIMARY KEY,
        site_title TEXT,
        default_language TEXT,
        logo_url TEXT,
        favicon_url TEXT,
        enable_registration BOOLEAN,
        enable_search_indexing BOOLEAN,
        meta_description TEXT,
        meta_keywords TEXT,
        google_analytics_id TEXT,
        custom_scripts JSONB,
        created_at TIMESTAMPTZ,
        updated_at TIMESTAMPTZ,
        footer_text TEXT,
        social_links JSONB,
        navbar_links JSONB,
        theme_colors JSONB,
        contact_email TEXT,
        enable_user_avatars BOOLEAN,
        homepage_slug TEXT
      );
    `
  });
  
  if (siteSettingsTableError) {
    console.error("Error creating site_settings table:", siteSettingsTableError);
  }

  // Create pages table if it doesn't exist
  const { error: pagesTableError } = await supabase.rpc('create_table', {
    sql: `
      CREATE TABLE IF NOT EXISTS public.pages (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title TEXT NOT NULL,
        slug TEXT NOT NULL,
        content JSONB DEFAULT '[]'::jsonb,
        is_published BOOLEAN DEFAULT false,
        created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
        updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
        show_in_header BOOLEAN DEFAULT false,
        show_in_footer BOOLEAN DEFAULT false,
        parent_id UUID,
        menu_order INTEGER DEFAULT 0,
        allow_indexing BOOLEAN DEFAULT true,
        page_template TEXT DEFAULT 'default',
        menu_type TEXT DEFAULT 'main',
        meta_title TEXT,
        meta_description TEXT,
        meta_keywords TEXT,
        canonical_url TEXT,
        og_title TEXT,
        og_description TEXT,
        og_image TEXT,
        custom_canonical_url TEXT,
        redirect_url TEXT,
        meta_robots TEXT,
        content_blocks JSONB[] DEFAULT '{}'::jsonb[]
      );
    `
  });
  
  if (pagesTableError) {
    console.error("Error creating pages table:", pagesTableError);
  }

  // Create profiles table if it doesn't exist
  const { error: profilesTableError } = await supabase.rpc('create_table', {
    sql: `
      CREATE TABLE IF NOT EXISTS public.profiles (
        id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
        full_name TEXT,
        email TEXT,
        address TEXT,
        phone_number TEXT,
        language TEXT DEFAULT 'en',
        currency TEXT DEFAULT 'USD',
        updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
        email_notifications BOOLEAN DEFAULT false,
        marketing_emails BOOLEAN DEFAULT false,
        completed_initial_setup BOOLEAN DEFAULT false,
        selected_delivery_method UUID,
        region TEXT,
        country TEXT
      );
    `
  });
  
  if (profilesTableError) {
    console.error("Error creating profiles table:", profilesTableError);
  }

  // Create handle_new_user function and trigger
  const { error: newUserFunctionError } = await supabase.rpc('create_function', {
    sql: `
      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS TRIGGER AS $$
      BEGIN
        INSERT INTO public.profiles (id, email, full_name)
        VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'full_name', ''));
        
        INSERT INTO public.user_roles (user_id, role)
        VALUES (new.id, 'client');
        
        RETURN new;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `
  });
  
  if (newUserFunctionError) {
    console.error("Error creating handle_new_user function:", newUserFunctionError);
  }

  // Create the trigger for new users
  const { error: triggerError } = await supabase.rpc('create_trigger', {
    sql: `
      DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
      CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    `
  });
  
  if (triggerError) {
    console.error("Error creating on_auth_user_created trigger:", triggerError);
  }
}

async function importSiteSettings(supabase, siteTitle, defaultLanguage) {
  console.log("Importing site settings...");
  
  // First check if site settings already exist
  const { data: existingSettings, error: checkError } = await supabase
    .from('site_settings')
    .select('id')
    .eq('id', 'default')
    .single();
  
  if (checkError && checkError.code !== 'PGRST116') {
    console.error("Error checking existing site settings:", checkError);
    throw checkError;
  }
  
  // If settings don't exist, create them
  if (!existingSettings) {
    // Prepare default settings
    const defaultSettings = {
      id: 'default',
      site_title: siteTitle || 'My Website',
      default_language: defaultLanguage || 'en',
      enable_registration: true,
      enable_search_indexing: true,
      custom_scripts: '[]',
      logo_url: null,
      favicon_url: null,
      footer_text: `Copyright © ${new Date().getFullYear()} ${siteTitle || 'My Website'}`,
      social_links: JSON.stringify({
        facebook: 'https://facebook.com',
        twitter: 'https://twitter.com',
        instagram: 'https://instagram.com'
      }),
      navbar_links: JSON.stringify([
        { text: 'Home', url: '/' },
        { text: 'About', url: '/about' },
        { text: 'Contact', url: '/contact' }
      ]),
      theme_colors: JSON.stringify({
        primary: '#3b82f6',
        secondary: '#10b981'
      }),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Insert the default settings
    const { error: insertError } = await supabase
      .from('site_settings')
      .insert(defaultSettings);
    
    if (insertError) {
      console.error("Error inserting site settings:", insertError);
      throw insertError;
    }
    
    console.log("Site settings imported successfully");
  } else {
    console.log("Site settings already exist, skipping import");
  }
}

async function importSamplePages(supabase) {
  console.log("Importing sample pages...");
  
  // Check if home page already exists
  const { data: existingHomePage, error: checkError } = await supabase
    .from('pages')
    .select('id')
    .eq('slug', 'home')
    .single();
  
  if (checkError && checkError.code !== 'PGRST116') {
    console.error("Error checking existing home page:", checkError);
    throw checkError;
  }
  
  // If home page doesn't exist, create it
  if (!existingHomePage) {
    const homePage = {
      title: 'Home',
      slug: 'home',
      is_published: true,
      show_in_header: true,
      menu_order: 1,
      page_template: 'home',
      content: JSON.stringify([]),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { error: insertError } = await supabase
      .from('pages')
      .insert(homePage);
    
    if (insertError) {
      console.error("Error inserting home page:", insertError);
      throw insertError;
    }
    
    console.log("Sample pages imported successfully");
  } else {
    console.log("Sample pages already exist, skipping import");
  }
}

async function setupRLS(supabase) {
  console.log("Setting up Row Level Security policies...");
  
  // Enable RLS on tables
  const tables = ['site_settings', 'pages', 'profiles', 'user_roles'];
  
  for (const table of tables) {
    const { error } = await supabase.rpc('create_table', {
      sql: `
        ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;
      `
    });
    
    if (error) {
      console.warn(`Error enabling RLS on ${table}:`, error);
    }
  }
  
  // Add RLS policies for site_settings
  const siteSettingsPolicies = [
    {
      name: "Anyone can read site settings",
      table: "site_settings",
      action: "SELECT",
      definition: "TRUE"
    },
    {
      name: "Only admins can insert site settings",
      table: "site_settings",
      action: "INSERT",
      definition: "EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')"
    },
    {
      name: "Only admins can update site settings",
      table: "site_settings",
      action: "UPDATE",
      definition: "EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')"
    },
    {
      name: "Only admins can delete site settings",
      table: "site_settings",
      action: "DELETE",
      definition: "EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')"
    }
  ];
  
  for (const policy of siteSettingsPolicies) {
    const { error } = await supabase.rpc('create_table', {
      sql: `
        DROP POLICY IF EXISTS "${policy.name}" ON public.${policy.table};
        CREATE POLICY "${policy.name}" 
        ON public.${policy.table} 
        FOR ${policy.action} 
        TO authenticated, anon
        USING (${policy.definition});
      `
    });
    
    if (error) {
      console.warn(`Error creating policy "${policy.name}":`, error);
    }
  }
  
  // Add RLS policies for profiles
  const profilesPolicies = [
    {
      name: "Users can view their own profile",
      table: "profiles",
      action: "SELECT",
      definition: "auth.uid() = id"
    },
    {
      name: "Admins can view all profiles",
      table: "profiles",
      action: "SELECT",
      definition: "EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')"
    },
    {
      name: "Users can update their own profile",
      table: "profiles",
      action: "UPDATE",
      definition: "auth.uid() = id"
    },
    {
      name: "Admins can update all profiles",
      table: "profiles",
      action: "UPDATE",
      definition: "EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin')"
    }
  ];
  
  for (const policy of profilesPolicies) {
    const { error } = await supabase.rpc('create_table', {
      sql: `
        DROP POLICY IF EXISTS "${policy.name}" ON public.${policy.table};
        CREATE POLICY "${policy.name}" 
        ON public.${policy.table} 
        FOR ${policy.action} 
        TO authenticated
        USING (${policy.definition});
      `
    });
    
    if (error) {
      console.warn(`Error creating policy "${policy.name}":`, error);
    }
  }
  
  console.log("RLS policies setup completed");
}
