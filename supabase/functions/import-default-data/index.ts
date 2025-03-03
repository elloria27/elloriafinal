
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestBody {
  siteTitle: string;
  siteDescription: string;
  defaultLanguage: "en" | "uk" | "fr";
  adminUser?: {
    email: string;
    password: string;
    fullName: string;
  };
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request body
    const requestData: RequestBody = await req.json();
    console.log("Received import request with data:", JSON.stringify({
      ...requestData,
      adminUser: requestData.adminUser ? { email: requestData.adminUser.email } : undefined
    }));

    // Create a Supabase client using the service_role key from request authorization header
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    console.log("Creating necessary database tables and types...");

    // First, create necessary types
    await createTypes(supabaseAdmin);
    
    // Then create necessary tables with RLS
    await createTables(supabaseAdmin);
    
    // Create the site_settings table if it doesn't exist
    await ensureSiteSettingsTable(supabaseAdmin);
    
    // Insert default site settings
    await insertSiteSettings(supabaseAdmin, requestData);
    
    // Create admin user if provided
    if (requestData.adminUser) {
      await createAdminUser(supabaseAdmin, requestData.adminUser);
    }
    
    // Create a sample home page
    await createSampleHomePage(supabaseAdmin);

    return new Response(
      JSON.stringify({ success: true, message: "Default data imported successfully" }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200
      }
    );
  } catch (error) {
    console.error("Error in import-default-data function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      }
    );
  }
});

async function createTypes(supabaseAdmin: any) {
  try {
    // Create supported_language enum if it doesn't exist
    console.log("Creating supported_language enum...");
    await supabaseAdmin.rpc('create_types', {
      sql: `
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'supported_language') THEN
            CREATE TYPE public.supported_language AS ENUM ('en', 'uk', 'fr');
          END IF;
        END
        $$;
      `
    });

    // Create reminder_recurrence enum if it doesn't exist
    console.log("Creating reminder_recurrence enum...");
    await supabaseAdmin.rpc('create_types', {
      sql: `
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'reminder_recurrence') THEN
            CREATE TYPE public.reminder_recurrence AS ENUM ('none', 'daily', 'weekly', 'monthly', 'yearly');
          END IF;
        END
        $$;
      `
    });

    console.log("Types created successfully!");
  } catch (error) {
    console.error("Error creating types:", error);
    throw error;
  }
}

async function createTables(supabaseAdmin: any) {
  try {
    console.log("Creating necessary tables...");
    
    // Create the user_roles table if it doesn't exist
    await supabaseAdmin.rpc('create_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.user_roles (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          user_id UUID NOT NULL,
          role TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
        );

        -- Set up RLS policies for user_roles
        ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies if any
        DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
        DROP POLICY IF EXISTS "Only admins can insert roles" ON public.user_roles;
        DROP POLICY IF EXISTS "Only admins can update roles" ON public.user_roles;
        DROP POLICY IF EXISTS "Only admins can delete roles" ON public.user_roles;
        
        -- Create policies
        CREATE POLICY "Users can view their own roles" 
          ON public.user_roles FOR SELECT 
          USING (auth.uid() = user_id);
          
        CREATE POLICY "Only admins can insert roles" 
          ON public.user_roles FOR INSERT 
          WITH CHECK (
            auth.uid() IN (
              SELECT user_id FROM public.user_roles WHERE role = 'admin'
            )
          );
          
        CREATE POLICY "Only admins can update roles" 
          ON public.user_roles FOR UPDATE 
          USING (
            auth.uid() IN (
              SELECT user_id FROM public.user_roles WHERE role = 'admin'
            )
          );
          
        CREATE POLICY "Only admins can delete roles" 
          ON public.user_roles FOR DELETE 
          USING (
            auth.uid() IN (
              SELECT user_id FROM public.user_roles WHERE role = 'admin'
            )
          );
      `
    });
    
    // Create the profiles table if it doesn't exist
    await supabaseAdmin.rpc('create_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.profiles (
          id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
          email TEXT,
          full_name TEXT,
          avatar_url TEXT,
          address JSONB,
          phone TEXT,
          preferences JSONB DEFAULT '{}'::jsonb,
          language TEXT DEFAULT 'en',
          newsletter_subscribed BOOLEAN DEFAULT false,
          company_name TEXT,
          tax_id TEXT,
          business_type TEXT,
          billing_address JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
        );
        
        -- Set up RLS policies for profiles
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies if any
        DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
        DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
        DROP POLICY IF EXISTS "Admin users can view all profiles" ON public.profiles;
        DROP POLICY IF EXISTS "Admin users can update all profiles" ON public.profiles;
        
        -- Create policies
        CREATE POLICY "Users can view their own profile" 
          ON public.profiles FOR SELECT 
          USING (auth.uid() = id);
          
        CREATE POLICY "Users can update their own profile" 
          ON public.profiles FOR UPDATE 
          USING (auth.uid() = id);
          
        CREATE POLICY "Admin users can view all profiles" 
          ON public.profiles FOR SELECT 
          USING (
            auth.uid() IN (
              SELECT user_id FROM public.user_roles WHERE role = 'admin'
            )
          );
          
        CREATE POLICY "Admin users can update all profiles" 
          ON public.profiles FOR UPDATE 
          USING (
            auth.uid() IN (
              SELECT user_id FROM public.user_roles WHERE role = 'admin'
            )
          );
      `
    });
    
    // Create the pages table if it doesn't exist
    await supabaseAdmin.rpc('create_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.pages (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          title TEXT NOT NULL,
          slug TEXT NOT NULL UNIQUE,
          meta_title TEXT,
          meta_description TEXT,
          featured_image TEXT,
          status TEXT DEFAULT 'draft',
          author_id UUID REFERENCES auth.users,
          show_in_menu BOOLEAN DEFAULT false,
          parent_id UUID REFERENCES public.pages(id),
          template TEXT,
          content JSONB DEFAULT '{}'::jsonb,
          published_at TIMESTAMP WITH TIME ZONE,
          menu_order INTEGER DEFAULT 0,
          view_count INTEGER DEFAULT 0,
          open_graph_image TEXT,
          canonical_url TEXT,
          structured_data JSONB,
          require_auth BOOLEAN DEFAULT false,
          revision_history JSONB DEFAULT '[]'::jsonb,
          last_modified_by UUID REFERENCES auth.users,
          seo_keywords TEXT,
          css TEXT,
          js TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
        );
        
        -- Set up RLS policies for pages
        ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies if any
        DROP POLICY IF EXISTS "Everyone can view published pages" ON public.pages;
        DROP POLICY IF EXISTS "Admin users can perform all operations on pages" ON public.pages;
        
        -- Create policies
        CREATE POLICY "Everyone can view published pages" 
          ON public.pages FOR SELECT 
          USING (status = 'published' OR 
                (status = 'private' AND require_auth = true AND auth.uid() IS NOT NULL) OR
                auth.uid() IN (
                  SELECT user_id FROM public.user_roles WHERE role = 'admin'
                ));
          
        CREATE POLICY "Admin users can perform all operations on pages" 
          ON public.pages FOR ALL 
          USING (
            auth.uid() IN (
              SELECT user_id FROM public.user_roles WHERE role = 'admin'
            )
          );
      `
    });
    
    // Create content_blocks table if it doesn't exist
    await supabaseAdmin.rpc('create_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.content_blocks (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          page_id UUID REFERENCES public.pages(id) ON DELETE CASCADE,
          block_type TEXT NOT NULL,
          content JSONB DEFAULT '{}'::jsonb,
          order_index INTEGER DEFAULT 0,
          is_enabled BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
        );
        
        -- Set up RLS policies for content_blocks
        ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies if any
        DROP POLICY IF EXISTS "Everyone can view content blocks of published pages" ON public.content_blocks;
        DROP POLICY IF EXISTS "Admin users can perform all operations on content blocks" ON public.content_blocks;
        
        -- Create policies
        CREATE POLICY "Everyone can view content blocks of published pages" 
          ON public.content_blocks FOR SELECT 
          USING (
            page_id IN (
              SELECT id FROM public.pages WHERE 
                status = 'published' OR 
                (status = 'private' AND require_auth = true AND auth.uid() IS NOT NULL)
            ) OR
            auth.uid() IN (
              SELECT user_id FROM public.user_roles WHERE role = 'admin'
            )
          );
          
        CREATE POLICY "Admin users can perform all operations on content blocks" 
          ON public.content_blocks FOR ALL 
          USING (
            auth.uid() IN (
              SELECT user_id FROM public.user_roles WHERE role = 'admin'
            )
          );
      `
    });

    // Create a function to handle new users
    await supabaseAdmin.rpc('create_function', {
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
    await supabaseAdmin.rpc('create_trigger', {
      sql: `
        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
      `
    });

    console.log("Tables created successfully!");
  } catch (error) {
    console.error("Error creating tables:", error);
    throw error;
  }
}

async function ensureSiteSettingsTable(supabaseAdmin: any) {
  try {
    console.log("Creating site_settings table if it doesn't exist...");
    
    await supabaseAdmin.rpc('create_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.site_settings (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          site_title TEXT NOT NULL,
          site_description TEXT,
          logo_url TEXT,
          favicon_url TEXT,
          social_media JSONB DEFAULT '{}'::jsonb,
          contact_email TEXT,
          contact_phone TEXT,
          contact_address TEXT,
          footer_text TEXT,
          primary_color TEXT DEFAULT '#3B82F6',
          secondary_color TEXT DEFAULT '#10B981',
          analytics_code TEXT,
          custom_css TEXT,
          custom_js TEXT,
          default_meta_image TEXT,
          default_language supported_language DEFAULT 'en'::supported_language,
          maintenance_mode BOOLEAN DEFAULT false,
          terms_page_id UUID REFERENCES public.pages(id),
          privacy_page_id UUID REFERENCES public.pages(id),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
        );
        
        -- Set up RLS policies for site_settings
        ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies if any
        DROP POLICY IF EXISTS "Everyone can view site settings" ON public.site_settings;
        DROP POLICY IF EXISTS "Admin users can update site settings" ON public.site_settings;
        
        -- Create policies
        CREATE POLICY "Everyone can view site settings" 
          ON public.site_settings FOR SELECT 
          TO PUBLIC;
          
        CREATE POLICY "Admin users can update site settings" 
          ON public.site_settings FOR ALL 
          USING (
            auth.uid() IN (
              SELECT user_id FROM public.user_roles WHERE role = 'admin'
            )
          );
          
        -- Create trigger for updated_at
        DROP TRIGGER IF EXISTS update_site_settings_updated_at ON public.site_settings;
        
        CREATE TRIGGER update_site_settings_updated_at
          BEFORE UPDATE ON public.site_settings
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();
      `
    });
    
    console.log("site_settings table created successfully!");
  } catch (error) {
    console.error("Error creating site_settings table:", error);
    throw error;
  }
}

async function insertSiteSettings(supabaseAdmin: any, requestData: RequestBody) {
  try {
    console.log("Inserting default site settings...");
    
    // Check if settings already exist
    const { data: existingSettings, error: fetchError } = await supabaseAdmin
      .from('site_settings')
      .select('id')
      .limit(1);
      
    if (fetchError) {
      throw fetchError;
    }
    
    // If settings already exist, update them
    if (existingSettings && existingSettings.length > 0) {
      const { error: updateError } = await supabaseAdmin
        .from('site_settings')
        .update({
          site_title: requestData.siteTitle,
          site_description: requestData.siteDescription,
          default_language: requestData.defaultLanguage,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSettings[0].id);
        
      if (updateError) {
        throw updateError;
      }
    } else {
      // If settings don't exist, insert them
      const { error: insertError } = await supabaseAdmin
        .from('site_settings')
        .insert({
          site_title: requestData.siteTitle,
          site_description: requestData.siteDescription,
          default_language: requestData.defaultLanguage,
          contact_email: 'contact@example.com',
          footer_text: `© ${new Date().getFullYear()} ${requestData.siteTitle}. All rights reserved.`
        });
        
      if (insertError) {
        throw insertError;
      }
    }
    
    console.log("Site settings inserted/updated successfully!");
  } catch (error) {
    console.error("Error inserting site settings:", error);
    throw error;
  }
}

async function createAdminUser(supabaseAdmin: any, adminUser: { email: string, password: string, fullName: string }) {
  try {
    console.log("Creating admin user...");
    
    // Create the user
    const { data: userData, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email: adminUser.email,
      password: adminUser.password,
      email_confirm: true,
      user_metadata: {
        full_name: adminUser.fullName
      }
    });
    
    if (createUserError) {
      throw createUserError;
    }
    
    if (!userData?.user) {
      throw new Error("Failed to create admin user - no user returned");
    }
    
    // Insert admin role
    const { error: roleError } = await supabaseAdmin
      .from('user_roles')
      .insert({
        user_id: userData.user.id,
        role: 'admin'
      });
      
    if (roleError) {
      throw roleError;
    }
    
    // Make sure profile is updated with fullName
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({
        full_name: adminUser.fullName
      })
      .eq('id', userData.user.id);
      
    if (profileError) {
      throw profileError;
    }
    
    console.log("Admin user created successfully!");
  } catch (error) {
    console.error("Error creating admin user:", error);
    throw error;
  }
}

async function createSampleHomePage(supabaseAdmin: any) {
  try {
    console.log("Creating sample home page...");
    
    // Check if home page already exists
    const { data: existingPages, error: fetchError } = await supabaseAdmin
      .from('pages')
      .select('id')
      .eq('slug', 'home')
      .limit(1);
      
    if (fetchError) {
      throw fetchError;
    }
    
    let pageId;
    
    // If home page doesn't exist, create it
    if (!existingPages || existingPages.length === 0) {
      const { data: pageData, error: pageError } = await supabaseAdmin
        .from('pages')
        .insert({
          title: 'Home',
          slug: 'home',
          status: 'published',
          meta_title: 'Welcome to our Website',
          meta_description: 'Our official website home page',
          template: 'default',
          show_in_menu: true,
          menu_order: 1
        })
        .select('id')
        .single();
        
      if (pageError) {
        throw pageError;
      }
      
      pageId = pageData.id;
    } else {
      pageId = existingPages[0].id;
    }
    
    // Add some content blocks to the home page
    // Only add if there are no existing blocks
    const { data: existingBlocks, error: blocksError } = await supabaseAdmin
      .from('content_blocks')
      .select('id')
      .eq('page_id', pageId)
      .limit(1);
      
    if (blocksError) {
      throw blocksError;
    }
    
    if (!existingBlocks || existingBlocks.length === 0) {
      // Add a hero block
      const { error: heroError } = await supabaseAdmin
        .from('content_blocks')
        .insert({
          page_id: pageId,
          block_type: 'hero',
          order_index: 0,
          content: {
            title: 'Welcome to Our Website',
            subtitle: 'We provide the best products and services',
            buttonText: 'Learn More',
            buttonLink: '/about',
            backgroundImage: '/placeholder.svg'
          }
        });
        
      if (heroError) {
        throw heroError;
      }
      
      // Add a features block
      const { error: featuresError } = await supabaseAdmin
        .from('content_blocks')
        .insert({
          page_id: pageId,
          block_type: 'features',
          order_index: 1,
          content: {
            title: 'Our Features',
            features: [
              {
                title: 'Feature 1',
                description: 'Description of feature 1',
                icon: 'Star'
              },
              {
                title: 'Feature 2',
                description: 'Description of feature 2',
                icon: 'Heart'
              },
              {
                title: 'Feature 3',
                description: 'Description of feature 3',
                icon: 'Zap'
              }
            ]
          }
        });
        
      if (featuresError) {
        throw featuresError;
      }
    }
    
    console.log("Sample home page created successfully!");
  } catch (error) {
    console.error("Error creating sample home page:", error);
    throw error;
  }
}
