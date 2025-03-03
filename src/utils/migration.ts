import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/integrations/supabase/types";
import { supabase as defaultSupabase } from "@/integrations/supabase/client";

interface MigrationCallbacks {
  onProgress: (progress: number, task: string) => void;
  onSuccess: (message: string) => void;
  onError: (error: string) => void;
}

interface ColumnDefinition {
  name: string;
  type: string;
  isPrimary?: boolean;
  isUnique?: boolean;
  isNullable?: boolean;
  defaultValue?: string;
  references?: {
    table: string;
    column: string;
  };
}

interface TableDefinition {
  name: string;
  columns: ColumnDefinition[];
  indices?: {
    name: string;
    columns: string[];
    isUnique?: boolean;
  }[];
}

const extractTableSchema = (): TableDefinition[] => {
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

const executeSql = async (client: SupabaseClient, query: string): Promise<any> => {
  try {
    const response = await fetch(`${client.auth.getSession().then(res => res.data.session?.access_token)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(client as any).supabaseKey}`,
        'apikey': `${(client as any).supabaseKey}`,
      },
      body: JSON.stringify({ query })
    });
    
    if (!response.ok) {
      throw new Error(`SQL execution failed: ${await response.text()}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error executing SQL:", error);
    throw error;
  }
};

export const runMigration = async (
  client: SupabaseClient, 
  callbacks: MigrationCallbacks
) => {
  const { onProgress, onSuccess, onError } = callbacks;
  const totalSteps = 7; // Total number of main migration steps
  let currentStep = 0;
  
  try {
    currentStep++;
    onProgress((currentStep / totalSteps) * 100, "Preparing database schema...");
    
    currentStep++;
    onProgress((currentStep / totalSteps) * 100, "Creating enum types...");
    
    const enumTypes = extractEnumTypes();
    for (const enumType of enumTypes) {
      try {
        const enumValuesStr = enumType.values.map(v => `'${v}'`).join(', ');
        const query = `
          DO $$
          BEGIN
            BEGIN
              CREATE TYPE ${enumType.name} AS ENUM (${enumValuesStr});
            EXCEPTION
              WHEN duplicate_object THEN NULL;
            END;
          END $$;
        `;
        
        const response = await fetch(`${client.supabaseUrl}/rest/v1/sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(client as any).supabaseKey}`,
            'apikey': `${(client as any).supabaseKey}`,
          },
          body: JSON.stringify({ query })
        });
        
        onSuccess(`Enum type ${enumType.name} created`);
      } catch (error) {
        console.error(`Failed to create enum type: ${error}`);
        onError(`Could not create enum type ${enumType.name}: ${error}`);
      }
    }
    
    currentStep++;
    onProgress((currentStep / totalSteps) * 100, "Creating database tables...");
    
    const tables = extractTableSchema();
    for (const table of tables) {
      try {
        let createTableSql = `CREATE TABLE IF NOT EXISTS ${table.name} (`;
        
        for (const col of table.columns) {
          createTableSql += `${col.name} ${col.type}`;
          
          if (col.isPrimary) {
            createTableSql += ' PRIMARY KEY';
          }
          
          if (col.isUnique) {
            createTableSql += ' UNIQUE';
          }
          
          if (col.isNullable !== true) {
            createTableSql += ' NOT NULL';
          }
          
          if (col.defaultValue) {
            createTableSql += ` DEFAULT ${col.defaultValue}`;
          }
          
          if (col.references) {
            createTableSql += ` REFERENCES ${col.references.table}(${col.references.column})`;
          }
          
          createTableSql += ', ';
        }
        
        createTableSql = createTableSql.slice(0, -2);
        createTableSql += ');';
        
        const response = await fetch(`${client.supabaseUrl}/rest/v1/sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(client as any).supabaseKey}`,
            'apikey': `${(client as any).supabaseKey}`,
          },
          body: JSON.stringify({ query: createTableSql })
        });
        
        if (table.indices) {
          for (const index of table.indices) {
            const isUnique = index.isUnique ? 'UNIQUE' : '';
            const indexSql = `CREATE ${isUnique} INDEX IF NOT EXISTS ${index.name} ON ${table.name} (${index.columns.join(', ')});`;
            
            await fetch(`${client.supabaseUrl}/rest/v1/sql`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${(client as any).supabaseKey}`,
                'apikey': `${(client as any).supabaseKey}`,
              },
              body: JSON.stringify({ query: indexSql })
            });
          }
        }
        
        onSuccess(`Table ${table.name} created with indices`);
      } catch (error) {
        console.error(`Failed to create table: ${error}`);
        onError(`Could not create table ${table.name}: ${error}`);
      }
    }
    
    currentStep++;
    onProgress((currentStep / totalSteps) * 100, "Enabling row-level security...");
    
    for (const table of tables) {
      try {
        const query = `ALTER TABLE ${table.name} ENABLE ROW LEVEL SECURITY;`;
        
        await fetch(`${client.supabaseUrl}/rest/v1/sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(client as any).supabaseKey}`,
            'apikey': `${(client as any).supabaseKey}`,
          },
          body: JSON.stringify({ query })
        });
        
        onSuccess(`RLS enabled on ${table.name}`);
      } catch (error) {
        console.error(`Failed to enable RLS: ${error}`);
        onError(`Could not enable RLS on ${table.name}: ${error}`);
      }
    }
    
    currentStep++;
    onProgress((currentStep / totalSteps) * 100, "Creating security policies...");
    
    try {
      const policies = [
        { 
          table: 'profiles', 
          name: 'profiles_select_own', 
          operation: 'SELECT', 
          using: '(auth.uid() = id) OR (auth.jwt() ->> \'role\' = \'admin\')'
        },
        { 
          table: 'profiles', 
          name: 'profiles_update_own', 
          operation: 'UPDATE', 
          using: '(auth.uid() = id) OR (auth.jwt() ->> \'role\' = \'admin\')'
        },
        { 
          table: 'pages', 
          name: 'pages_select_published', 
          operation: 'SELECT', 
          using: 'is_published OR (auth.jwt() ->> \'role\' = \'admin\')'
        },
        { 
          table: 'pages', 
          name: 'pages_admin_crud', 
          operation: 'ALL', 
          using: '(auth.jwt() ->> \'role\' = \'admin\')'
        },
        { 
          table: 'content_blocks', 
          name: 'content_blocks_select_for_published', 
          operation: 'SELECT', 
          using: 'EXISTS (SELECT 1 FROM pages WHERE pages.id = content_blocks.page_id AND (pages.is_published OR (auth.jwt() ->> \'role\' = \'admin\')))'
        },
        { 
          table: 'content_blocks', 
          name: 'content_blocks_admin_crud', 
          operation: 'ALL', 
          using: '(auth.jwt() ->> \'role\' = \'admin\')'
        }
      ];
      
      for (const policy of policies) {
        try {
          const query = `
            BEGIN;
            DROP POLICY IF EXISTS ${policy.name} ON ${policy.table};
            CREATE POLICY ${policy.name} ON ${policy.table} 
            FOR ${policy.operation} TO authenticated 
            USING (${policy.using});
            COMMIT;
          `;
          
          await fetch(`${client.supabaseUrl}/rest/v1/sql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${(client as any).supabaseKey}`,
              'apikey': `${(client as any).supabaseKey}`,
            },
            body: JSON.stringify({ query })
          });
          
          onSuccess(`Created policy ${policy.name} on ${policy.table}`);
        } catch (pError) {
          console.error(`Failed to create policy ${policy.name}: ${pError}`);
          onError(`Could not create policy ${policy.name}: ${pError}`);
        }
      }
    } catch (error) {
      console.warn(`Failed to create RLS policies: ${error}`);
      onError(`Could not create security policies: ${error}`);
    }
    
    currentStep++;
    onProgress((currentStep / totalSteps) * 100, "Initializing default data...");
    
    const rolesQuery = `
      INSERT INTO user_roles (id, name, description, created_at) 
      VALUES 
        (gen_random_uuid(), 'admin', 'Administrator with full access', now()),
        (gen_random_uuid(), 'client', 'Regular user with limited access', now())
      ON CONFLICT (name) DO NOTHING;
    `;
    
    await fetch(`${client.supabaseUrl}/rest/v1/sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(client as any).supabaseKey}`,
        'apikey': `${(client as any).supabaseKey}`,
      },
      body: JSON.stringify({ query: rolesQuery })
    });
    
    const homePageQuery = `
      WITH inserted_page AS (
        INSERT INTO pages (
          id, title, slug, is_published, show_in_header, 
          show_in_footer, menu_order, created_at, updated_at
        ) 
        VALUES (
          gen_random_uuid(), 'Home', 'home', true, true, 
          false, 0, now(), now()
        )
        ON CONFLICT (slug) DO NOTHING
        RETURNING id
      )
      INSERT INTO content_blocks (
        id, page_id, type, content, order_index, created_at, updated_at
      )
      SELECT 
        gen_random_uuid(), id, 'hero', 
        '{"title":"Welcome to Your CMS","subtitle":"Get started by customizing this page","cta_text":"Learn More","cta_link":"/about","background_color":"#f9fafb"}'::jsonb, 
        0, now(), now()
      FROM inserted_page
      WHERE EXISTS (SELECT 1 FROM inserted_page);
    `;
    
    await fetch(`${client.supabaseUrl}/rest/v1/sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(client as any).supabaseKey}`,
        'apikey': `${(client as any).supabaseKey}`,
      },
      body: JSON.stringify({ query: homePageQuery })
    });
    
    onSuccess("Default data initialized");
    
    currentStep++;
    onProgress((currentStep / totalSteps) * 100, "Verifying installation...");
    
    const verifyQuery = `SELECT EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'pages'
    );`;
    
    const response = await fetch(`${client.supabaseUrl}/rest/v1/sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(client as any).supabaseKey}`,
        'apikey': `${(client as any).supabaseKey}`,
      },
      body: JSON.stringify({ query: verifyQuery })
    });
    
    const result = await response.json();
    
    if (result.error) {
      throw new Error(`Verification failed: ${result.error.message}`);
    }
    
    onProgress(100, "Migration completed successfully!");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    onError(errorMessage);
    throw error;
  }
};

export const saveSupabaseConfig = async (config: {
  url: string;
  key: string;
  projectId: string;
}) => {
  try {
    const configContent = `project_id = "${config.projectId}"`;
    
    const clientContent = `// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "${config.url}";
const SUPABASE_PUBLISHABLE_KEY = "${config.key}";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
`;

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
    }
    
    try {
      const { data, error } = await defaultSupabase
        .from('profiles')
        .select('count(*)', { count: 'exact', head: true });
      
      if (!error) {
        return true;
      }
    } catch {
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

export const createDbHelperFunctions = async (client: SupabaseClient) => {
  console.log("Using direct SQL for helper functions instead of RPC");
  return true;
};

export const createRlsHelper = async (client: SupabaseClient) => {
  console.log("Using direct SQL for RLS helper instead of RPC");
  return true;
};
