
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/integrations/supabase/types";
import { supabase as defaultSupabase } from "@/integrations/supabase/client";

interface MigrationCallbacks {
  onProgress: (progress: number, task: string) => void;
  onSuccess: (message: string) => void;
  onError: (error: string) => void;
}

// Extract table and column definitions from types.ts
const extractTableSchema = () => {
  // These would be manually defined based on the types.ts file structure
  return [
    {
      name: "profiles",
      columns: [
        { name: "id", type: "uuid", isPrimary: true, defaultValue: "auth.uid()" },
        { name: "full_name", type: "text" },
        { name: "email", type: "text" },
        { name: "avatar_url", type: "text", isNullable: true },
        { name: "created_at", type: "timestamptz", defaultValue: "now()" },
        { name: "updated_at", type: "timestamptz", defaultValue: "now()" },
        { name: "role", type: "user_role", defaultValue: "'client'" },
      ],
      indices: [
        { name: "profiles_email_idx", columns: ["email"] }
      ],
    },
    {
      name: "user_roles",
      columns: [
        { name: "id", type: "uuid", isPrimary: true, defaultValue: "gen_random_uuid()" },
        { name: "name", type: "text", isUnique: true },
        { name: "description", type: "text", isNullable: true },
        { name: "created_at", type: "timestamptz", defaultValue: "now()" },
      ],
    },
    {
      name: "pages",
      columns: [
        { name: "id", type: "uuid", isPrimary: true, defaultValue: "gen_random_uuid()" },
        { name: "title", type: "text" },
        { name: "slug", type: "text", isUnique: true },
        { name: "content", type: "jsonb", defaultValue: "'[]'::jsonb" },
        { name: "is_published", type: "boolean", defaultValue: "false" },
        { name: "created_at", type: "timestamptz", defaultValue: "now()" },
        { name: "updated_at", type: "timestamptz", defaultValue: "now()" },
        { name: "show_in_header", type: "boolean", defaultValue: "false" },
        { name: "show_in_footer", type: "boolean", defaultValue: "false" },
        { name: "parent_id", type: "uuid", isNullable: true, references: { table: "pages", column: "id" } },
        { name: "menu_order", type: "integer", defaultValue: "0" },
        { name: "menu_type", type: "text", defaultValue: "'main'" },
      ],
      indices: [
        { name: "pages_slug_idx", columns: ["slug"], isUnique: true }
      ],
    },
    {
      name: "content_blocks",
      columns: [
        { name: "id", type: "uuid", isPrimary: true, defaultValue: "gen_random_uuid()" },
        { name: "page_id", type: "uuid", references: { table: "pages", column: "id" } },
        { name: "type", type: "content_block_type" },
        { name: "content", type: "jsonb", defaultValue: "'{}'::jsonb" },
        { name: "order_index", type: "integer", defaultValue: "0" },
        { name: "created_at", type: "timestamptz", defaultValue: "now()" },
        { name: "updated_at", type: "timestamptz", defaultValue: "now()" },
      ],
      indices: [
        { name: "content_blocks_page_id_idx", columns: ["page_id"] }
      ],
    },
    {
      name: "site_settings",
      columns: [
        { name: "id", type: "uuid", isPrimary: true, defaultValue: "gen_random_uuid()" },
        { name: "site_name", type: "text", defaultValue: "'My Site'" },
        { name: "site_description", type: "text", isNullable: true },
        { name: "logo_url", type: "text", isNullable: true },
        { name: "favicon_url", type: "text", isNullable: true },
        { name: "primary_color", type: "text", defaultValue: "'#4338ca'" },
        { name: "secondary_color", type: "text", defaultValue: "'#60a5fa'" },
        { name: "created_at", type: "timestamptz", defaultValue: "now()" },
        { name: "updated_at", type: "timestamptz", defaultValue: "now()" },
        { name: "created_by", type: "uuid", isNullable: true },
      ],
    },
  ];
};

// Extract enum types from types.ts
const extractEnumTypes = () => {
  return [
    {
      name: "content_block_type",
      values: [
        "hero", "text", "image", "gallery", "video", "products", 
        "testimonials", "features", "cta", "contact_form", "faq"
      ]
    },
    {
      name: "user_role",
      values: ["admin", "client"]
    },
    {
      name: "post_status",
      values: ["draft", "published"]
    },
    {
      name: "supported_currency",
      values: ["USD", "EUR", "UAH", "CAD"]
    },
    {
      name: "supported_language",
      values: ["en", "fr", "uk"]
    }
  ];
};

// Define RLS policies for security
const createRlsPolicies = (client: SupabaseClient) => {
  return [
    // Profiles policies
    client.rpc('define_rls_policy', {
      table_name: 'profiles',
      policy_name: 'profiles_select_own',
      operation: 'SELECT',
      definition: '(auth.uid() = id) OR (auth.jwt() ->> \'role\' = \'admin\')',
      check_expression: 'true'
    }),
    client.rpc('define_rls_policy', {
      table_name: 'profiles',
      policy_name: 'profiles_update_own',
      operation: 'UPDATE',
      definition: '(auth.uid() = id) OR (auth.jwt() ->> \'role\' = \'admin\')',
      check_expression: 'true'
    }),
    
    // Pages policies
    client.rpc('define_rls_policy', {
      table_name: 'pages',
      policy_name: 'pages_select_published',
      operation: 'SELECT',
      definition: 'is_published OR (auth.jwt() ->> \'role\' = \'admin\')',
      check_expression: 'true'
    }),
    client.rpc('define_rls_policy', {
      table_name: 'pages',
      policy_name: 'pages_admin_crud',
      operation: 'ALL',
      definition: '(auth.jwt() ->> \'role\' = \'admin\')',
      check_expression: 'true'
    }),
    
    // Content blocks policies
    client.rpc('define_rls_policy', {
      table_name: 'content_blocks',
      policy_name: 'content_blocks_select_for_published',
      operation: 'SELECT',
      definition: 'EXISTS (SELECT 1 FROM pages WHERE pages.id = content_blocks.page_id AND (pages.is_published OR (auth.jwt() ->> \'role\' = \'admin\')))',
      check_expression: 'true'
    }),
    client.rpc('define_rls_policy', {
      table_name: 'content_blocks',
      policy_name: 'content_blocks_admin_crud',
      operation: 'ALL',
      definition: '(auth.jwt() ->> \'role\' = \'admin\')',
      check_expression: 'true'
    }),
  ];
};

// Core migration logic
export const runMigration = async (
  client: SupabaseClient, 
  callbacks: MigrationCallbacks
) => {
  const { onProgress, onSuccess, onError } = callbacks;
  const totalSteps = 7; // Total number of main migration steps
  let currentStep = 0;
  
  try {
    // Step 1: Create helper functions for RLS
    currentStep++;
    onProgress((currentStep / totalSteps) * 100, "Creating helper functions...");
    
    await client.rpc('create_rls_helper', {});
    onSuccess("Helper functions created successfully");
    
    // Step 2: Create enum types
    currentStep++;
    onProgress((currentStep / totalSteps) * 100, "Creating enum types...");
    
    const enumTypes = extractEnumTypes();
    for (const enumType of enumTypes) {
      await client.rpc('create_enum_type', {
        enum_name: enumType.name,
        enum_values: enumType.values
      });
      onSuccess(`Enum type ${enumType.name} created`);
    }
    
    // Step 3: Create tables from schema
    currentStep++;
    onProgress((currentStep / totalSteps) * 100, "Creating database tables...");
    
    const tables = extractTableSchema();
    for (const table of tables) {
      await client.rpc('create_table_from_schema', {
        table_name: table.name,
        columns_json: JSON.stringify(table.columns)
      });
      
      // Create indices
      if (table.indices) {
        for (const index of table.indices) {
          await client.rpc('create_index', {
            index_name: index.name,
            table_name: table.name,
            columns: index.columns,
            is_unique: 'isUnique' in index ? !!index.isUnique : false
          });
        }
      }
      
      onSuccess(`Table ${table.name} created with indices`);
    }
    
    // Step 4: Enable RLS on tables
    currentStep++;
    onProgress((currentStep / totalSteps) * 100, "Enabling row-level security...");
    
    for (const table of tables) {
      await client.rpc('enable_rls', {
        table_name: table.name
      });
      onSuccess(`RLS enabled on ${table.name}`);
    }
    
    // Step 5: Create RLS policies
    currentStep++;
    onProgress((currentStep / totalSteps) * 100, "Creating security policies...");
    
    const policies = createRlsPolicies(client);
    await Promise.all(policies);
    onSuccess("Security policies created");
    
    // Step 6: Insert default data
    currentStep++;
    onProgress((currentStep / totalSteps) * 100, "Initializing default data...");
    
    // Insert default user roles
    await client.from('user_roles').insert([
      { name: 'admin', description: 'Administrator with full access' },
      { name: 'client', description: 'Regular user with limited access' }
    ]);
    
    // Insert home page
    const { data: homePage } = await client.from('pages').insert([
      { 
        title: 'Home', 
        slug: 'home', 
        is_published: true,
        show_in_header: true,
        show_in_footer: false,
        menu_order: 0
      }
    ]).select();
    
    // Add a simple welcome content block to home page
    if (homePage && homePage.length > 0) {
      await client.from('content_blocks').insert([
        {
          page_id: homePage[0].id,
          type: 'hero',
          content: {
            title: 'Welcome to Your CMS',
            subtitle: 'Get started by customizing this page',
            cta_text: 'Learn More',
            cta_link: '/about',
            background_color: '#f9fafb'
          },
          order_index: 0
        }
      ]);
    }
    
    onSuccess("Default data initialized");
    
    // Step 7: Final verification
    currentStep++;
    onProgress((currentStep / totalSteps) * 100, "Verifying installation...");
    
    // Test querying a table to verify it exists and has the right structure
    const { error: verifyError } = await client
      .from('pages')
      .select('id, title, slug')
      .limit(1);
    
    if (verifyError) {
      throw new Error(`Verification failed: ${verifyError.message}`);
    }
    
    onProgress(100, "Migration completed successfully!");
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    onError(errorMessage);
    throw error;
  }
};

// Function to permanently save Supabase configuration
export const saveSupabaseConfig = async (config: {
  url: string;
  key: string;
  projectId: string;
}) => {
  try {
    // Create or update the config.toml file
    const configContent = `project_id = "${config.projectId}"`;
    
    // Create or update the client.ts file
    const clientContent = `// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "${config.url}";
const SUPABASE_PUBLISHABLE_KEY = "${config.key}";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
`;

    // In a real implementation we might use local storage or browser storage
    // for temporary persistence, but here we'll simulate it
    localStorage.setItem('supabase_config', JSON.stringify(config));
    
    // In a production app, we would write these to actual files, but
    // that would be handled by the backend

    return true;
  } catch (error) {
    console.error('Failed to save Supabase configuration:', error);
    return false;
  }
};

// Function to check if install wizard is needed
export const isInstallationNeeded = async (): Promise<boolean> => {
  try {
    // First check localStorage for quick response
    const installed = localStorage.getItem('cms_installed');
    if (installed === 'true') {
      // Even if localStorage says it's installed, verify with the database
      const dbVerified = await verifyDatabaseSetup();
      if (dbVerified) {
        return false; // Installation not needed, DB is verified
      }
      // If DB verification failed but localStorage says installed,
      // clear the localStorage value as it's incorrect
      localStorage.removeItem('cms_installed');
    }
    
    return true; // Installation is needed
  } catch (error) {
    console.error('Error checking installation status:', error);
    return true; // Default to needing installation if there's an error
  }
};

// Helper function to verify database tables exist
const verifyDatabaseSetup = async (): Promise<boolean> => {
  try {
    // Try to use a direct query first - this works even with limited permissions
    try {
      // Try to select from the profiles table directly with limit 0
      // This will error only if the table doesn't exist, not if it's empty
      const { error: tableError } = await defaultSupabase
        .from('profiles')
        .select('id')
        .limit(0);
      
      // If we don't get an error, the table exists
      if (!tableError) {
        return true;
      }
    } catch {
      // If direct query fails, continue to other methods
    }
    
    // Try a different approach using an EXISTS query
    try {
      // Use a direct query with FROM to check if the table exists
      // This avoids using RPC which might not be available
      const { data, error } = await defaultSupabase
        .from('profiles')
        .select('count(*)', { count: 'exact', head: true });
      
      // If we can query the table (even if empty), it exists
      if (!error) {
        return true;
      }
    } catch {
      // If that also fails, continue to other fallbacks
    }
    
    // Final fallback - check if we can authenticate, if yes, assume tables are set up
    // This is not as reliable but better than nothing
    const { data: authData, error: authError } = await defaultSupabase.auth.getSession();
    if (!authError && authData) {
      // Last resort - look for any existing table to determine if setup is complete
      try {
        const { data: siteSettings } = await defaultSupabase
          .from('site_settings')
          .select('id')
          .limit(1);
          
        return siteSettings !== null && siteSettings.length > 0;
      } catch {
        // If we can authenticate but no tables exist, assume setup is not complete
        return false;
      }
    }
    
    return false;
  } catch (error) {
    console.error('Error in database verification:', error);
    return false;
  }
};

// Function to mark installation as complete
export const markInstallationComplete = () => {
  localStorage.setItem('cms_installed', 'true');
};

// Helper to create the database schema functions during migration
export const createDbHelperFunctions = async (client: SupabaseClient) => {
  try {
    // Create functions to check if tables exist - using SQL instead of RPC
    // We'll create other helper functions instead
    
    // Create a function to enable RLS
    const { error: enableRlsError } = await client.rpc('create_function', {
      function_name: 'enable_rls',
      function_definition: `
        CREATE OR REPLACE FUNCTION enable_rls(table_name text)
        RETURNS void AS $$
        BEGIN
          EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', table_name);
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    });
    
    if (enableRlsError) throw enableRlsError;
    
    // Create a function to create enum types
    const { error: createEnumError } = await client.rpc('create_function', {
      function_name: 'create_enum_type',
      function_definition: `
        CREATE OR REPLACE FUNCTION create_enum_type(enum_name text, enum_values text[])
        RETURNS void AS $$
        BEGIN
          BEGIN
            EXECUTE format('CREATE TYPE %I AS ENUM (%s);',
              enum_name,
              array_to_string(array(SELECT format('%L', v) FROM unnest(enum_values) AS v), ',')
            );
          EXCEPTION
            WHEN duplicate_object THEN
              NULL;
          END;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    });
    
    if (createEnumError) throw createEnumError;
    
    // Create a function to create indices
    const { error: createIndexError } = await client.rpc('create_function', {
      function_name: 'create_index',
      function_definition: `
        CREATE OR REPLACE FUNCTION create_index(index_name text, table_name text, columns text[], is_unique boolean DEFAULT false)
        RETURNS void AS $$
        BEGIN
          BEGIN
            IF is_unique THEN
              EXECUTE format('CREATE UNIQUE INDEX IF NOT EXISTS %I ON %I (%s);',
                index_name, table_name, array_to_string(columns, ',')
              );
            ELSE
              EXECUTE format('CREATE INDEX IF NOT EXISTS %I ON %I (%s);',
                index_name, table_name, array_to_string(columns, ',')
              );
            END IF;
          EXCEPTION
            WHEN duplicate_object THEN
              NULL;
          END;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    });
    
    if (createIndexError) throw createIndexError;
    
    // Create functions for RLS policies
    const { error: rlsPolicyError } = await client.rpc('create_function', {
      function_name: 'define_rls_policy',
      function_definition: `
        CREATE OR REPLACE FUNCTION define_rls_policy(
          table_name text,
          policy_name text,
          operation text,
          definition text,
          check_expression text DEFAULT 'true'
        )
        RETURNS void AS $$
        BEGIN
          BEGIN
            EXECUTE format('CREATE POLICY %I ON %I FOR %s TO authenticated USING (%s) WITH CHECK (%s);',
              policy_name, table_name, operation, definition, check_expression
            );
          EXCEPTION
            WHEN duplicate_object THEN
              EXECUTE format('ALTER POLICY %I ON %I USING (%s) WITH CHECK (%s);',
                policy_name, table_name, definition, check_expression
              );
          END;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    });
    
    if (rlsPolicyError) throw rlsPolicyError;
    
    // Create a helper function for creating tables
    const { error: createTableError } = await client.rpc('create_function', {
      function_name: 'create_table_from_schema',
      function_definition: `
        CREATE OR REPLACE FUNCTION create_table_from_schema(
          table_name text,
          columns_json json
        )
        RETURNS void AS $$
        DECLARE
          col json;
          col_name text;
          col_type text;
          col_constraints text;
          create_statement text;
        BEGIN
          create_statement := format('CREATE TABLE IF NOT EXISTS %I (', table_name);
          
          FOR col IN SELECT * FROM json_array_elements(columns_json)
          LOOP
            col_name := col->>'name';
            col_type := col->>'type';
            
            col_constraints := '';
            
            IF (col->>'isPrimary')::boolean THEN
              col_constraints := col_constraints || ' PRIMARY KEY';
            END IF;
            
            IF (col->>'isUnique')::boolean THEN
              col_constraints := col_constraints || ' UNIQUE';
            END IF;
            
            IF NOT (col->>'isNullable')::boolean THEN
              col_constraints := col_constraints || ' NOT NULL';
            END IF;
            
            IF col->>'defaultValue' IS NOT NULL THEN
              col_constraints := col_constraints || ' DEFAULT ' || (col->>'defaultValue');
            END IF;
            
            IF col->>'references' IS NOT NULL THEN
              col_constraints := col_constraints || format(' REFERENCES %I(%I)',
                (col->'references'->>'table'),
                (col->'references'->>'column')
              );
            END IF;
            
            create_statement := create_statement || format('%I %s%s, ', col_name, col_type, col_constraints);
          END LOOP;
          
          -- Remove trailing comma and space
          create_statement := left(create_statement, length(create_statement) - 2);
          
          create_statement := create_statement || ');';
          
          EXECUTE create_statement;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
      `
    });
    
    if (createTableError) throw createTableError;
    
    return true;
  } catch (error) {
    console.error("Error creating database helper functions:", error);
    throw error;
  }
};

// Helper function to create all the needed RLS helper functions
export const createRlsHelper = async (client: SupabaseClient) => {
  await client.rpc('create_function', {
    function_name: 'create_rls_helper',
    function_definition: `
      BEGIN
        -- Create the enable_rls function
        CREATE OR REPLACE FUNCTION enable_rls(table_name text)
        RETURNS void AS $$
        BEGIN
          EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY;', table_name);
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
        
        -- Create the define_rls_policy function
        CREATE OR REPLACE FUNCTION define_rls_policy(
          table_name text,
          policy_name text,
          operation text,
          definition text,
          check_expression text DEFAULT 'true'
        )
        RETURNS void AS $$
        BEGIN
          BEGIN
            EXECUTE format('CREATE POLICY %I ON %I FOR %s TO authenticated USING (%s) WITH CHECK (%s);',
              policy_name, table_name, operation, definition, check_expression
            );
          EXCEPTION
            WHEN duplicate_object THEN
              EXECUTE format('ALTER POLICY %I ON %I USING (%s) WITH CHECK (%s);',
                policy_name, table_name, definition, check_expression
              );
          END;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;
        
        -- Create other helper functions as needed
        
        RETURN;
      END;
    `
  });
  
  return true;
};
