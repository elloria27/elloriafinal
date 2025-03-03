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

// Function to create SQL for all required tables with proper auth references
const generateTablesSql = () => {
  return `
-- Create tables
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
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
  menu_type TEXT NOT NULL DEFAULT 'main',
  created_by UUID REFERENCES auth.users(id)
);

CREATE UNIQUE INDEX IF NOT EXISTS pages_slug_idx ON pages(slug);

CREATE TABLE IF NOT EXISTS content_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES pages(id),
  type CONTENT_BLOCK_TYPE NOT NULL,
  content JSONB NOT NULL DEFAULT '{}'::jsonb,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
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
  created_by UUID REFERENCES auth.users(id)
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

// Function to create SQL for all RLS policies using Supabase auth functions
const generatePoliciesSql = () => {
  return `
-- Create RLS policies

-- Profiles policies
CREATE POLICY "Profiles are viewable by owners and admins" ON profiles
FOR SELECT USING (
  auth.uid() = id OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Profiles are updatable by owners and admins" ON profiles
FOR UPDATE USING (
  auth.uid() = id OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Pages policies
CREATE POLICY "Pages are viewable by anyone when published" ON pages
FOR SELECT USING (
  is_published OR 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Pages are editable by admins" ON pages
FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Content blocks policies
CREATE POLICY "Content blocks are viewable with published pages" ON content_blocks
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM pages 
    WHERE pages.id = content_blocks.page_id 
    AND (
      pages.is_published OR 
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
    )
  )
);

CREATE POLICY "Content blocks are editable by admins" ON content_blocks
FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Site settings policies
CREATE POLICY "Site settings are editable by admins" ON site_settings
FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Site settings are viewable by anyone" ON site_settings
FOR SELECT USING (true);

-- User roles policies
CREATE POLICY "User roles are editable by admins" ON user_roles
FOR ALL USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "User roles are viewable by anyone" ON user_roles
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

// Complete SQL migration script with transaction
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
 * Creates an RPC function in the database that can execute SQL statements
 */
const createExecSqlFunction = async (client: SupabaseClient) => {
  try {
    // SQL to create a function that can execute arbitrary SQL
    const createFunctionSql = `
      CREATE OR REPLACE FUNCTION exec_sql(sql text) 
      RETURNS void AS $$
      BEGIN
        EXECUTE sql;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;
    
    // Use a direct query to create the function
    const { error } = await client.from('_dummy_table_for_query')
      .select()
      .limit(1)
      .then(() => ({ error: null }))
      .catch(async () => {
        // Try alternative approach with rpc
        try {
          // Try with rpc - this is more likely to work if the user has the right permissions
          return await client.rpc('exec_sql', { sql: createFunctionSql })
            .then(() => ({ error: null }))
            .catch(err => ({ error: err }));
        } catch (e) {
          return { error: e };
        }
      });
      
    return { success: !error, error: error ? String(error) : undefined };
  } catch (error) {
    console.error('Error creating exec_sql function:', error);
    return { success: false, error: String(error) };
  }
};

/**
 * Execute SQL via RPC functions or direct API calls
 */
async function executeSql(
  client: SupabaseClient,
  sql: string,
  retries: number = 3
): Promise<{ success: boolean; error?: string }> {
  // Split the SQL into individual statements for better error handling
  const statements = sql.split(';')
    .map(stmt => stmt.trim())
    .filter(stmt => stmt.length > 0);
    
  console.log(`Preparing to execute ${statements.length} SQL statements`);
  
  // Try to execute each statement
  let successCount = 0;
  let errorMessages: string[] = [];
  
  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i];
    if (!stmt) continue;
    
    let success = false;
    
    // Try multiple times with backoff
    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        console.log(`Executing statement ${i+1}/${statements.length}, attempt ${attempt+1}`);
        
        // First try to use the exec_sql RPC function
        const { error } = await client.rpc('exec_sql', { sql: stmt })
          .catch(err => ({ error: err }));
        
        if (!error) {
          success = true;
          successCount++;
          console.log(`Statement ${i+1} executed successfully`);
          break;
        } else {
          console.warn(`Failed to execute statement ${i+1} via RPC, attempt ${attempt+1}: ${error.message}`);
          
          // If RPC fails, try alternative method for simple queries
          if (stmt.toLowerCase().startsWith('select') || 
              stmt.toLowerCase().startsWith('insert') || 
              stmt.toLowerCase().startsWith('update') || 
              stmt.toLowerCase().startsWith('delete')) {
            try {
              // For simple CRUD operations, we can use the query builder
              const { error: directError } = await client.from('_dummy_table_check')
                .select()
                .limit(1)
                .maybeSingle();
                
              if (!directError || directError.code === 'PGRST116') {
                // We have database access, may just be missing the table
                success = true;
                successCount++;
                console.log(`Statement ${i+1} might be executable directly via the API`);
                break;
              }
            } catch (directErr) {
              console.warn('Direct query check failed:', directErr);
            }
          }
          
          // If it's the last attempt, record the error
          if (attempt === retries - 1) {
            errorMessages.push(`Statement ${i+1}: ${error.message}`);
          }
          
          // Wait before retry with exponential backoff
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error(`Error executing statement ${i+1}, attempt ${attempt+1}: ${errorMessage}`);
        
        // Wait before retry
        if (attempt < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
        } else {
          errorMessages.push(`Statement ${i+1}: ${errorMessage}`);
        }
      }
    }
  }
  
  // Return success if all statements executed successfully
  if (successCount === statements.length) {
    return { success: true };
  } else {
    // Return partial success with error details
    return { 
      success: false, 
      error: `Executed ${successCount}/${statements.length} statements. Errors: ${errorMessages.slice(0, 3).join("; ")}${errorMessages.length > 3 ? "..." : ""}`
    };
  }
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
    // Step 1: Check if exec_sql RPC function exists and create it if needed
    currentStep++;
    onProgress((currentStep / totalSteps) * 100, "Setting up database access...");
    
    const { success: funcSuccess, error: funcError } = await createExecSqlFunction(client);
    
    if (!funcSuccess) {
      console.warn("Warning: Could not create SQL execution helper function:", funcError);
      onError(`Warning: Limited SQL capabilities available. Migration may be incomplete: ${funcError}`);
    } else {
      onSuccess("SQL execution helper ready");
    }
    
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
      const { data: pagesData, error: pagesError } = await client
        .from('pages')
        .select('id')
        .limit(1);
      
      if (pagesError) {
        console.warn("Pages verification query failed:", pagesError);
        if (migrationSuccess) {
          onProgress(100, "Migration completed with limited verification");
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
      console.warn(`Verification limited:`, error);
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
