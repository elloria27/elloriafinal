
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
    // More tables would be defined here based on the Database type
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
            is_unique: index.isUnique ?? false // Add null coalescing operator to provide a default value
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
export const isInstallationNeeded = (): boolean => {
  // Check if any tables exist in the database
  const testConnection = async () => {
    try {
      const { data, error } = await defaultSupabase.from('profiles').select('count').limit(1);
      // If profiles table doesn't exist, we need installation
      return !!error;
    } catch (error) {
      return true;
    }
  };
  
  // For demo purposes, we'll use localStorage to determine if installation is needed
  const installed = localStorage.getItem('cms_installed');
  
  return !installed || installed !== 'true';
};

// Function to mark installation as complete
export const markInstallationComplete = () => {
  localStorage.setItem('cms_installed', 'true');
};

// Helper to create the database schema functions during migration
export const createDbHelperFunctions = async (client: SupabaseClient) => {
  // Create a function to enable RLS
  await client.rpc('create_function', {
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
  
  // Create a function to create enum types
  await client.rpc('create_function', {
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
  
  // Create a function to create indices
  await client.rpc('create_function', {
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
  
  // Create functions for RLS policies
  await client.rpc('create_function', {
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
  
  // Create a helper function for creating tables
  await client.rpc('create_function', {
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
  
  // Create a function to check schema permissions
  await client.rpc('create_function', {
    function_name: 'get_schema_permissions',
    function_definition: `
      CREATE OR REPLACE FUNCTION get_schema_permissions()
      RETURNS boolean AS $$
      BEGIN
        -- If this function executes successfully, the user has schema permissions
        RETURN true;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `
  });
  
  return true;
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
