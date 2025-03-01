
import { SupabaseClient } from "@supabase/supabase-js";

// Array of migration files to be executed in order
const migrationFiles = [
  "pages_rows.sql",
  "products_rows.sql",
  "profiles_rows.sql",
  "seo_settings_rows.sql",
  "shop_settings_rows.sql",
  "site_settings_rows.sql",
  "user_roles_rows.sql"
];

/**
 * Run all database migrations for a new Supabase project
 * @param supabase Supabase client with service_role key
 */
export const runMigrations = async (supabase: SupabaseClient) => {
  console.log("Starting database migrations...");
  
  // For each migration file
  for (const file of migrationFiles) {
    try {
      console.log(`Running migration: ${file}`);
      
      // Load migration SQL file content
      const response = await fetch(`/migrations/${file}`);
      
      if (!response.ok) {
        throw new Error(`Failed to load migration file: ${file}`);
      }
      
      const sqlContent = await response.text();
      
      // Execute the SQL statements using Supabase's function for running SQL
      if (file.includes("_rows.sql")) {
        // This is data insertion, execute as normal SQL
        const { error } = await supabase.rpc('create_table', { sql: sqlContent });
        
        if (error) {
          throw new Error(`Migration error in ${file}: ${error.message}`);
        }
      }
      
      console.log(`Successfully ran migration: ${file}`);
    } catch (error) {
      console.error(`Error running migration ${file}:`, error);
      throw error;
    }
  }
  
  console.log("All migrations completed successfully");
};
