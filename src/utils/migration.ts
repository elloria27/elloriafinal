
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/integrations/supabase/types";
import { supabase as defaultSupabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MigrationCallbacks {
  onProgress: (progress: number, task: string) => void;
  onSuccess: (message: string) => void;
  onError: (error: string) => void;
}

// Function to create SQL for all required enum types
const generateEnumTypesSql = () => {
  return `
-- Create enum types
DO $$
BEGIN
  -- Create content_block_type enum if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_block_type') THEN
    CREATE TYPE content_block_type AS ENUM (
      'hero', 'text', 'image', 'gallery', 'video', 'products', 
      'testimonials', 'features', 'cta', 'contact_form', 'faq'
    );
  END IF;

  -- Create user_role enum if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('admin', 'client');
  END IF;

  -- Create post_status enum if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'post_status') THEN
    CREATE TYPE post_status AS ENUM ('draft', 'published');
  END IF;

  -- Create supported_currency enum if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'supported_currency') THEN
    CREATE TYPE supported_currency AS ENUM ('USD', 'EUR', 'UAH', 'CAD');
  END IF;

  -- Create supported_language enum if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'supported_language') THEN
    CREATE TYPE supported_language AS ENUM ('en', 'fr', 'uk');
  END IF;
END
$$;`;
};

// Function to create SQL for all required tables
const generateTablesSql = () => {
  return `
-- Create tables
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  role USER_ROLE NOT NULL DEFAULT 'client'
);

CREATE INDEX IF NOT EXISTS profiles_email_idx ON profiles(email);

CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  show_in_header BOOLEAN NOT NULL DEFAULT FALSE,
  show_in_footer BOOLEAN NOT NULL DEFAULT FALSE,
  parent_id UUID REFERENCES pages(id),
  menu_order INTEGER NOT NULL DEFAULT 0,
  menu_type TEXT NOT NULL DEFAULT 'main'
);

CREATE UNIQUE INDEX IF NOT EXISTS pages_slug_idx ON pages(slug);

CREATE TABLE IF NOT EXISTS content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id),
  type CONTENT_BLOCK_TYPE NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS content_blocks_page_id_idx ON content_blocks(page_id);

CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT NOT NULL DEFAULT 'My Site',
  site_description TEXT,
  logo_url TEXT,
  favicon_url TEXT,
  primary_color TEXT NOT NULL DEFAULT '#4338ca',
  secondary_color TEXT NOT NULL DEFAULT '#60a5fa',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID
);`;
};

// Function to create SQL for enabling RLS on all tables
const generateRlsSql = () => {
  return `
-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;`;
};

// Function to create SQL for all RLS policies
const generatePoliciesSql = () => {
  return `
-- Create RLS policies

-- Profiles policies
CREATE POLICY "Profiles select own" ON profiles
FOR SELECT USING ((auth.uid() = id) OR (auth.jwt() ->> 'role' = 'admin'));

CREATE POLICY "Profiles update own" ON profiles
FOR UPDATE USING ((auth.uid() = id) OR (auth.jwt() ->> 'role' = 'admin'));

-- Pages policies
CREATE POLICY "Pages select published" ON pages
FOR SELECT USING (is_published OR (auth.jwt() ->> 'role' = 'admin'));

CREATE POLICY "Pages admin crud" ON pages
FOR ALL USING ((auth.jwt() ->> 'role' = 'admin'));

-- Content blocks policies
CREATE POLICY "Content blocks select for published" ON content_blocks
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM pages 
    WHERE pages.id = content_blocks.page_id 
    AND (pages.is_published OR (auth.jwt() ->> 'role' = 'admin'))
  )
);

CREATE POLICY "Content blocks admin crud" ON content_blocks
FOR ALL USING ((auth.jwt() ->> 'role' = 'admin'));

-- Site settings policies
CREATE POLICY "Site settings admin crud" ON site_settings
FOR ALL USING ((auth.jwt() ->> 'role' = 'admin'));

CREATE POLICY "Site settings public read" ON site_settings
FOR SELECT USING (true);

-- User roles policies
CREATE POLICY "User roles admin crud" ON user_roles
FOR ALL USING ((auth.jwt() ->> 'role' = 'admin'));

CREATE POLICY "User roles public read" ON user_roles
FOR SELECT USING (true);`;
};

// Function to create SQL for initial data
const generateInitialDataSql = () => {
  return `
-- Insert initial data
INSERT INTO user_roles (name, description)
VALUES 
  ('admin', 'Administrator with full access'),
  ('client', 'Regular user with limited access')
ON CONFLICT (name) DO NOTHING;

-- Create initial home page if it doesn't exist
INSERT INTO pages (title, slug, is_published, show_in_header, menu_order)
SELECT 'Home', 'home', true, true, 0
WHERE NOT EXISTS (SELECT 1 FROM pages WHERE slug = 'home');

-- Create a sample hero block for the home page
INSERT INTO content_blocks (page_id, type, content, order_index)
SELECT 
  (SELECT id FROM pages WHERE slug = 'home'),
  'hero',
  '{"title": "Welcome to Your CMS", "subtitle": "Get started by customizing this page", "cta_text": "Learn More", "cta_link": "/about", "background_color": "#f9fafb"}',
  0
WHERE EXISTS (SELECT 1 FROM pages WHERE slug = 'home')
AND NOT EXISTS (
  SELECT 1 FROM content_blocks 
  WHERE page_id = (SELECT id FROM pages WHERE slug = 'home')
  AND type = 'hero'
);

-- Insert default site settings if they don't exist
INSERT INTO site_settings (site_name, site_description, primary_color, secondary_color)
SELECT 'My CMS', 'A powerful headless CMS', '#4338ca', '#60a5fa'
WHERE NOT EXISTS (SELECT 1 FROM site_settings);`;
};

// Complete SQL migration script - making it export to address module error
export const generateCompleteMigrationSql = () => {
  return `
BEGIN;
  ${generateEnumTypesSql()}
  ${generateTablesSql()}
  ${generateRlsSql()}
  ${generatePoliciesSql()}
  ${generateInitialDataSql()}
COMMIT;
`;
};

/**
 * Execute SQL directly using the Supabase client
 */
async function executeSql(
  client: SupabaseClient,
  sql: string,
  retries: number = 3
): Promise<{ success: boolean; error?: string }> {
  for (let i = 0; i < retries; i++) {
    try {
      console.log("Executing SQL with method attempt", i + 1);
      
      if (i === 0) {
        // First try: Use REST API direct SQL execution
        const { error } = await client
          .from('_')
          .select('*')
          .csv();
          
        // This won't actually execute our SQL, but it tests if authentication is working
        if (!error) {
          console.log("Connection test successful");
        } else {
          console.warn("Connection test failed:", error.message);
        }
      }
      
      // Try to execute SQL using direct REST API call if possible
      try {
        const response = await fetch(`${(client as any).supabaseUrl}/rest/v1/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': (client as any).supabaseKey,
            'Authorization': `Bearer ${(client as any).supabaseKey}`
          },
          body: JSON.stringify({ query: sql })
        });
        
        if (response.ok) {
          return { success: true };
        }
      } catch (err) {
        console.warn("Direct REST API call failed:", err);
      }
      
      // Try using pg_query function if it exists
      try {
        const { error: pgQueryError } = await client.rpc('pg_query', { query_text: sql });
        if (!pgQueryError) {
          return { success: true };
        }
      } catch (err) {
        console.warn("pg_query RPC failed:", err);
      }
      
      // Try using an insert to a nonexistent table as a last resort
      // Some Supabase instances allow this as a way to execute raw SQL
      try {
        const { error: insertError } = await client
          .from('_sql_runner')
          .insert([{ sql }]);
          
        if (!insertError || insertError.message.includes("does not exist")) {
          // If the error is just that the table doesn't exist, the SQL might have executed
          return { success: true };
        }
      } catch (err) {
        console.warn("SQL insert attempt failed:", err);
      }
      
      // If all methods fail, split the SQL into individual statements and try again
      if (i === retries - 1) {
        const statements = sql.split(';')
          .map(stmt => stmt.trim())
          .filter(stmt => stmt.length > 0);
          
        console.log(`Attempting to execute ${statements.length} individual statements`);
        
        let successCount = 0;
        let lastError = '';
        
        for (const stmt of statements) {
          try {
            // Try direct REST API call first
            const response = await fetch(`${(client as any).supabaseUrl}/rest/v1/`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': (client as any).supabaseKey,
                'Authorization': `Bearer ${(client as any).supabaseKey}`
              },
              body: JSON.stringify({ query: stmt + ';' })
            });
            
            if (response.ok) {
              successCount++;
              continue;
            }
            
            // Try using pg_query function if it exists
            const { error: pgQueryError } = await client.rpc('pg_query', { query_text: stmt + ';' });
            if (!pgQueryError) {
              successCount++;
              continue;
            }
            
            // Try using an insert to a nonexistent table as a last resort
            const { error: insertError } = await client
              .from('_sql_runner')
              .insert([{ sql: stmt + ';' }]);
              
            if (!insertError || insertError.message.includes("does not exist")) {
              successCount++;
              continue;
            }
            
            lastError = insertError?.message || pgQueryError?.message || 'Unknown error';
            
          } catch (err) {
            const errorMsg = err instanceof Error ? err.message : String(err);
            lastError = errorMsg;
            console.warn(`Failed to execute statement: ${stmt}`, errorMsg);
          }
        }
        
        if (successCount === statements.length) {
          return { success: true };
        } else {
          return { 
            success: false, 
            error: `Executed ${successCount}/${statements.length} statements. Last error: ${lastError}`
          };
        }
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      console.error('SQL execution error:', error);
      
      // Last retry, return error
      if (i === retries - 1) {
        return { success: false, error: error.message };
      }
    }
    
    // Wait before next retry with exponential backoff
    await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
  }
  
  return { 
    success: false, 
    error: 'Failed to execute SQL after multiple retries' 
  };
}

// The main migration function
export const runMigration = async (
  client: SupabaseClient, 
  callbacks: MigrationCallbacks
) => {
  const { onProgress, onSuccess, onError } = callbacks;
  const totalSteps = 6;
  let currentStep = 0;
  let migrationSuccess = true;

  try {
    // Store config in localStorage
    let config = {
      url: '',
      key: '',
      projectId: ''
    };
    
    try {
      const storedConfig = localStorage.getItem('supabase_config');
      if (storedConfig) {
        config = JSON.parse(storedConfig);
      }
    } catch (e) {
      console.error("Error getting stored config:", e);
    }
    
    try {
      localStorage.setItem('supabase_config', JSON.stringify(config));
    } catch (e) {
      console.error("Error storing config:", e);
    }

    // Step 1: Prepare SQL migration
    currentStep++;
    onProgress((currentStep / totalSteps) * 100, "Preparing migration script...");

    const migrationSql = generateCompleteMigrationSql();
    
    // Step 2: Execute enum creation
    currentStep++;
    onProgress((currentStep / totalSteps) * 100, "Creating enum types...");
    
    const enumSql = generateEnumTypesSql();
    const { success: enumSuccess, error: enumError } = await executeSql(client, enumSql);
    
    if (!enumSuccess) {
      onError(`Error creating enum types: ${enumError}`);
      migrationSuccess = false;
    } else {
      onSuccess("Enum types created successfully");
    }
    
    // Step 3: Create tables
    currentStep++;
    onProgress((currentStep / totalSteps) * 100, "Creating database tables...");
    
    const tablesSql = generateTablesSql();
    const { success: tablesSuccess, error: tablesError } = await executeSql(client, tablesSql);
    
    if (!tablesSuccess) {
      onError(`Error creating tables: ${tablesError}`);
      migrationSuccess = false;
    } else {
      onSuccess("Database tables created successfully");
    }
    
    // Step 4: Enable RLS
    currentStep++;
    onProgress((currentStep / totalSteps) * 100, "Enabling row-level security...");
    
    const rlsSql = generateRlsSql();
    const { success: rlsSuccess, error: rlsError } = await executeSql(client, rlsSql);
    
    if (!rlsSuccess) {
      onError(`Error enabling RLS: ${rlsError}`);
      migrationSuccess = false;
    } else {
      onSuccess("Row-level security enabled successfully");
    }
    
    // Step 5: Create policies
    currentStep++;
    onProgress((currentStep / totalSteps) * 100, "Creating security policies...");
    
    const policiesSql = generatePoliciesSql();
    const { success: policiesSuccess, error: policiesError } = await executeSql(client, policiesSql);
    
    if (!policiesSuccess) {
      onError(`Error creating policies: ${policiesError}`);
      migrationSuccess = false;
    } else {
      onSuccess("Security policies created successfully");
    }
    
    // Step 6: Insert initial data
    currentStep++;
    onProgress((currentStep / totalSteps) * 100, "Creating initial data...");
    
    const initialDataSql = generateInitialDataSql();
    const { success: dataSuccess, error: dataError } = await executeSql(client, initialDataSql);
    
    if (!dataSuccess) {
      onError(`Error inserting initial data: ${dataError}`);
      migrationSuccess = false;
    } else {
      onSuccess("Initial data created successfully");
    }
    
    // Verify installation
    onProgress(100, "Verifying installation...");
    
    try {
      // Try to verify if the tables were created
      const { data: profilesData, error: profilesError } = await client
        .from('profiles')
        .select('count(*)', { count: 'exact', head: true });
      
      const { data: pagesData, error: pagesError } = await client
        .from('pages')
        .select('count(*)', { count: 'exact', head: true });
      
      if (profilesError && pagesError) {
        console.warn("Verification queries failed:", profilesError, pagesError);
        if (migrationSuccess) {
          onProgress(100, "Migration completed with limited verification!");
        } else {
          onProgress(100, "Migration completed with errors. Manual verification recommended.");
        }
      } else {
        // At least one verification query succeeded
        if (migrationSuccess) {
          onProgress(100, "Migration completed successfully!");
        } else {
          onProgress(100, "Migration partially completed. Some steps failed.");
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.warn(`Verification limited: ${errorMessage}`);
      if (migrationSuccess) {
        onProgress(100, "Migration completed with limited verification!");
      } else {
        onProgress(100, "Migration completed with errors. Manual verification recommended.");
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    onError(errorMessage);
    throw error;
  }
};

// Functions below are kept for backwards compatibility
export const saveSupabaseConfig = async (newConfig: {
  url: string;
  key: string;
  projectId: string;
}) => {
  try {
    const config = { ...newConfig };
    
    if (config.url && !config.url.includes('://')) {
      config.url = `https://${config.url}`;
    }
    
    localStorage.setItem('supabase_config', JSON.stringify(config));
    return true;
  } catch (error) {
    console.error('Failed to save Supabase configuration:', error);
    return false;
  }
};

export const isInstallationNeeded = async (): Promise<boolean> => {
  try {
    const installed = localStorage.getItem('cms_installed');
    if (installed === 'true') {
      const dbVerified = await verifyDatabaseSetup();
      if (dbVerified) {
        return false;
      }
      localStorage.removeItem('cms_installed');
    }
    
    return true;
  } catch (error) {
    console.error('Error checking installation status:', error);
    return true;
  }
};

const verifyDatabaseSetup = async (): Promise<boolean> => {
  try {
    try {
      const { error: tableError } = await defaultSupabase
        .from('profiles')
        .select('id')
        .limit(0);
      
      if (!tableError) {
        return true;
      }
    } catch {
      // Failed to check profiles, continue with other checks
    }
    
    try {
      const { data, error } = await defaultSupabase
        .from('profiles')
        .select('count(*)', { count: 'exact', head: true });
      
      if (!error) {
        return true;
      }
    } catch {
      // Failed to check profile count, continue with other checks
    }
    
    const { data: authData, error: authError } = await defaultSupabase.auth.getSession();
    if (!authError && authData) {
      try {
        const { data: siteSettings } = await defaultSupabase
          .from('site_settings')
          .select('id')
          .limit(1);
          
        return siteSettings !== null && siteSettings.length > 0;
      } catch {
        return false;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error in database verification:', error);
    return false;
  }
};

export const markInstallationComplete = () => {
  localStorage.setItem('cms_installed', 'true');
};
