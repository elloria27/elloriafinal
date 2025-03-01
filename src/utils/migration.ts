
import { SupabaseClient } from '@supabase/supabase-js';

/**
 * Run database migrations by fetching SQL files from the public directory
 */
export const runMigrations = async (supabase: SupabaseClient) => {
  try {
    console.log("Starting database migrations...");
    
    // List of migration files to run
    const migrationFiles = [
      '/migrations/profiles_rows.sql',
      '/migrations/site_settings_rows.sql',
      '/migrations/shop_settings_rows.sql',
      '/migrations/seo_settings_rows.sql',
      '/migrations/pages_rows.sql',
      '/migrations/products_rows.sql',
      '/migrations/user_roles_rows.sql',
    ];

    // Run migrations sequentially
    for (const filePath of migrationFiles) {
      console.log(`Running migration: ${filePath}`);
      
      try {
        // Fetch the SQL file
        const response = await fetch(filePath);
        if (!response.ok) {
          throw new Error(`Failed to fetch migration file: ${filePath}, status: ${response.status}`);
        }
        
        const sqlContent = await response.text();
        if (!sqlContent || sqlContent.trim().length === 0) {
          console.warn(`Empty migration file: ${filePath}`);
          continue;
        }
        
        // Execute the SQL
        const { error } = await supabase.rpc('exec_sql', { sql_query: sqlContent });
        
        if (error) {
          console.error(`Error running migration ${filePath}:`, error);
          // Continue with other migrations even if one fails
        } else {
          console.log(`Successfully ran migration: ${filePath}`);
        }
      } catch (err) {
        console.error(`Error processing migration ${filePath}:`, err);
        // Continue with other migrations even if one fails
      }
    }
    
    console.log("Database migrations completed");
    return true;
  } catch (error) {
    console.error("Error running migrations:", error);
    throw error;
  }
};
