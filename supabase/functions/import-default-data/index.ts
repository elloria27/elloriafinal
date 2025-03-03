
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.48.0";

interface RequestBody {
  siteTitle: string;
  siteDescription: string;
  defaultLanguage: "en" | "uk" | "fr";
}

serve(async (req) => {
  try {
    // Get the request body
    const requestData: RequestBody = await req.json();
    
    // Get the Supabase URL and key from environment variables
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ error: "Supabase credentials not found" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Create a Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Create types and enums
    await createRequiredTypes(supabase);
    
    // Create necessary tables
    await createRequiredTables(supabase);
    
    // Set up RLS policies
    await setupRLSPolicies(supabase);
    
    // Create user handler function (for auto-creating profiles)
    await createUserHandler(supabase);
    
    // Populate site settings
    await populateSiteSettings(supabase, requestData);
    
    // Create sample homepage
    await createSampleHomepage(supabase, requestData);
    
    return new Response(
      JSON.stringify({ success: true, message: "Database setup completed successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in import-default-data:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

async function createRequiredTypes(supabase) {
  try {
    // Create user role enum
    await supabase.rpc('create_types', {
      sql: `
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
            CREATE TYPE public.user_role AS ENUM ('admin', 'editor', 'client');
          END IF;
          
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'supported_language') THEN
            CREATE TYPE public.supported_language AS ENUM ('en', 'uk', 'fr');
          END IF;
          
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'block_type') THEN
            CREATE TYPE public.block_type AS ENUM (
              'heading', 'text', 'image', 'video', 'button', 'spacer',
              'hero', 'features', 'testimonials', 'not_found'
            );
          END IF;
        END
        $$;
      `
    });
    
    console.log("Required types created successfully");
  } catch (error) {
    console.error("Error creating types:", error);
    throw error;
  }
}

async function createRequiredTables(supabase) {
  try {
    // Create profiles table
    await supabase.rpc('create_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.profiles (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          email TEXT,
          full_name TEXT,
          address TEXT,
          phone_number TEXT,
          currency TEXT DEFAULT 'USD',
          language TEXT DEFAULT 'en',
          email_notifications BOOLEAN DEFAULT false,
          marketing_emails BOOLEAN DEFAULT false,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
        );
      `
    });
    
    // Create user_roles table
    await supabase.rpc('create_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.user_roles (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
          role user_role NOT NULL DEFAULT 'client',
          created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
        );
      `
    });
    
    // Create site_settings table
    await supabase.rpc('create_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.site_settings (
          id TEXT PRIMARY KEY DEFAULT 'default',
          site_title TEXT,
          meta_description TEXT,
          logo_url TEXT,
          favicon_url TEXT,
          contact_email TEXT,
          enable_registration BOOLEAN,
          maintenance_mode BOOLEAN,
          enable_cookie_consent BOOLEAN,
          enable_https_redirect BOOLEAN,
          enable_search_indexing BOOLEAN,
          enable_user_avatars BOOLEAN,
          google_analytics_id TEXT,
          meta_keywords TEXT,
          custom_scripts JSONB,
          max_upload_size BIGINT,
          default_language supported_language DEFAULT 'en',
          homepage_slug TEXT,
          created_at TIMESTAMP WITH TIME ZONE,
          updated_at TIMESTAMP WITH TIME ZONE
        );
      `
    });
    
    // Create pages table
    await supabase.rpc('create_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.pages (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          title TEXT NOT NULL,
          slug TEXT NOT NULL,
          content JSONB NOT NULL DEFAULT '[]'::jsonb,
          is_published BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
          show_in_header BOOLEAN DEFAULT false,
          show_in_footer BOOLEAN DEFAULT false,
          parent_id UUID REFERENCES public.pages(id),
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
          meta_robots TEXT
        );
        CREATE UNIQUE INDEX IF NOT EXISTS pages_slug_idx ON public.pages (slug);
      `
    });
    
    // Create content_blocks table
    await supabase.rpc('create_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.content_blocks (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          page_id UUID REFERENCES public.pages(id) ON DELETE CASCADE,
          type block_type NOT NULL,
          content JSONB NOT NULL DEFAULT '{}'::jsonb,
          order_index INTEGER NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
        );
      `
    });
    
    console.log("Required tables created successfully");
  } catch (error) {
    console.error("Error creating tables:", error);
    throw error;
  }
}

async function setupRLSPolicies(supabase) {
  try {
    // Enable RLS on tables
    await supabase.rpc('create_table', {
      sql: `
        -- Enable RLS on tables
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;
        
        -- Profiles policies
        CREATE POLICY IF NOT EXISTS "Users can view their own profile" 
          ON public.profiles FOR SELECT 
          USING (auth.uid() = id);
          
        CREATE POLICY IF NOT EXISTS "Users can update their own profile" 
          ON public.profiles FOR UPDATE 
          USING (auth.uid() = id);
          
        CREATE POLICY IF NOT EXISTS "Admins can view all profiles" 
          ON public.profiles FOR SELECT 
          USING (
            EXISTS (
              SELECT 1 FROM public.user_roles 
              WHERE user_id = auth.uid() 
              AND role = 'admin'
            )
          );
          
        -- Pages policies
        CREATE POLICY IF NOT EXISTS "Published pages are viewable by everyone" 
          ON public.pages FOR SELECT 
          USING (is_published = true);
          
        CREATE POLICY IF NOT EXISTS "Admins can manage all pages" 
          ON public.pages FOR ALL 
          USING (
            EXISTS (
              SELECT 1 FROM public.user_roles 
              WHERE user_id = auth.uid() 
              AND role = 'admin'
            )
          );
          
        -- Content blocks policies
        CREATE POLICY IF NOT EXISTS "Content blocks are viewable with their pages" 
          ON public.content_blocks FOR SELECT 
          USING (
            EXISTS (
              SELECT 1 FROM public.pages 
              WHERE id = page_id 
              AND is_published = true
            )
          );
          
        CREATE POLICY IF NOT EXISTS "Admins can manage all content blocks" 
          ON public.content_blocks FOR ALL 
          USING (
            EXISTS (
              SELECT 1 FROM public.user_roles 
              WHERE user_id = auth.uid() 
              AND role = 'admin'
            )
          );
          
        -- Site settings policies
        CREATE POLICY IF NOT EXISTS "Site settings are viewable by everyone" 
          ON public.site_settings FOR SELECT 
          USING (true);
          
        CREATE POLICY IF NOT EXISTS "Admins can manage site settings" 
          ON public.site_settings FOR ALL 
          USING (
            EXISTS (
              SELECT 1 FROM public.user_roles 
              WHERE user_id = auth.uid() 
              AND role = 'admin'
            )
          );
      `
    });
    
    console.log("RLS policies created successfully");
  } catch (error) {
    console.error("Error setting up RLS policies:", error);
    throw error;
  }
}

async function createUserHandler(supabase) {
  try {
    // Create user handler function
    await supabase.rpc('create_function', {
      sql: `
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS TRIGGER
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          INSERT INTO public.profiles (id, email, full_name)
          VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'full_name', ''));
          
          INSERT INTO public.user_roles (user_id, role)
          VALUES (new.id, 'client');
          
          RETURN new;
        END;
        $$;
      `
    });
    
    // Create trigger for new users
    await supabase.rpc('create_trigger', {
      sql: `
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
      `
    });
    
    console.log("User handler created successfully");
  } catch (error) {
    console.error("Error creating user handler:", error);
    throw error;
  }
}

async function populateSiteSettings(supabase, data: RequestBody) {
  try {
    const { siteTitle, siteDescription, defaultLanguage } = data;
    
    // Insert default site settings
    const { error } = await supabase
      .from('site_settings')
      .upsert({
        id: 'default',
        site_title: siteTitle,
        meta_description: siteDescription,
        default_language: defaultLanguage,
        enable_registration: true,
        enable_search_indexing: true,
        maintenance_mode: false,
        enable_cookie_consent: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
      
    if (error) throw error;
    
    console.log("Site settings populated successfully");
  } catch (error) {
    console.error("Error populating site settings:", error);
    throw error;
  }
}

async function createSampleHomepage(supabase, data: RequestBody) {
  try {
    const { siteTitle, siteDescription } = data;
    
    // Create a sample homepage
    const { data: page, error: pageError } = await supabase
      .from('pages')
      .insert({
        title: "Home",
        slug: "home",
        is_published: true,
        show_in_header: true,
        show_in_footer: false,
        menu_order: 1,
        page_template: "default",
        meta_title: siteTitle,
        meta_description: siteDescription
      })
      .select()
      .single();
      
    if (pageError) throw pageError;
    
    // Add content blocks to the homepage
    if (page) {
      const blocks = [
        {
          page_id: page.id,
          type: "hero",
          content: {
            title: siteTitle,
            subtitle: siteDescription,
            buttonText: "Learn More"
          },
          order_index: 0
        },
        {
          page_id: page.id,
          type: "text",
          content: {
            text: "Welcome to your new site! This is a sample page created during the setup process. You can edit or delete this content in the admin panel."
          },
          order_index: 1
        }
      ];
      
      const { error: blocksError } = await supabase
        .from('content_blocks')
        .insert(blocks);
        
      if (blocksError) throw blocksError;
    }
    
    // Update site settings to point to the new homepage
    const { error: settingsError } = await supabase
      .from('site_settings')
      .update({ homepage_slug: "home" })
      .eq('id', 'default');
      
    if (settingsError) throw settingsError;
    
    console.log("Sample homepage created successfully");
  } catch (error) {
    console.error("Error creating sample homepage:", error);
    throw error;
  }
}
