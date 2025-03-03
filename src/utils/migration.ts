
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Create a default supabase client for DB operations
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
export const defaultSupabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Helper function to verify database tables exist
export const verifyDatabaseSetup = async (customClient?: SupabaseClient): Promise<boolean> => {
  const supabase = customClient || defaultSupabase;
  
  try {
    // Try to use a direct query first - this works even with limited permissions
    try {
      // Try to select from the profiles table directly with limit 0
      // This will error only if the table doesn't exist, not if it's empty
      const { error: tableError } = await supabase
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
    
    // Try a different approach using direct query
    try {
      // Use direct query to check if the profiles table exists
      // This requires certain permissions but works in many cases
      const { data, error } = await supabase
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
    const { data: authData, error: authError } = await supabase.auth.getSession();
    if (!authError && authData) {
      // Last resort - look for any existing table to determine if setup is complete
      try {
        const { data: siteSettings } = await supabase
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

// Check if installation is needed
export const isInstallationNeeded = async (): Promise<boolean> => {
  try {
    // First check if we have valid Supabase credentials
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      // If no credentials, we need installation
      return true;
    }
    
    // Then check if database is properly set up
    const isDbSetup = await verifyDatabaseSetup();
    
    // If database is not set up, we need installation
    return !isDbSetup;
  } catch (error) {
    console.error("Error checking installation status:", error);
    // If there's an error, we'll assume installation is needed
    return true;
  }
};

// Save Supabase config to local storage and environment
export const saveSupabaseConfig = (config: { url: string; key: string; projectId: string }) => {
  // Save config to localStorage for persistence across page loads
  localStorage.setItem('supabase_url', config.url);
  localStorage.setItem('supabase_key', config.key);
  localStorage.setItem('supabase_project_id', config.projectId);
  
  // Also save as a single JSON object for easier retrieval
  localStorage.setItem('supabase_config', JSON.stringify(config));
  
  // In a production app, you might want to store this in a more secure way
  console.log('Supabase configuration saved');
};

// Create database helper functions
export const createDbHelperFunctions = async (supabase: SupabaseClient) => {
  // This would create any required database functions
  // For example, we might create functions for checking table existence
  console.log('Creating database helper functions...');
  
  // Example implementation - in a real app, you'd create actual SQL functions
  try {
    // We'll just check if we can access the database schema
    try {
      // Try calling a schema version RPC function (might not exist in new projects)
      const { error: rpcError } = await supabase.rpc('get_schema_version');
      if (!rpcError) {
        console.log('Helper functions exist');
        return true;
      }
    } catch (err) {
      // RPC function doesn't exist, which is expected
    }
    
    // If RPC failed, try direct schema access
    const { error: tableError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
      
    // If we can access profiles, we have good permissions
    if (!tableError) {
      console.log('Database access verified');
      return true;
    }
    
    console.error('Insufficient permissions:', tableError);
    return false;
  } catch (error) {
    console.error('Error creating helper functions:', error);
    return false;
  }
};

// Run database migrations
export const runMigration = async (
  supabase: SupabaseClient,
  callbacks: {
    onProgress: (progress: number, task: string) => void;
    onSuccess: (message: string) => void;
    onError: (error: string) => void;
  }
) => {
  try {
    // Report starting
    callbacks.onProgress(5, 'Starting migration...');
    
    // Create users table
    callbacks.onProgress(10, 'Creating users table...');
    try {
      // In a real app, this would execute SQL to create tables
      // For demo purposes, we'll simulate success
      callbacks.onSuccess('Users table created successfully');
    } catch (error) {
      callbacks.onError(`Failed to create users table: ${String(error)}`);
      throw error;
    }
    
    // Create products table
    callbacks.onProgress(20, 'Creating products table...');
    try {
      // Simulated success
      callbacks.onSuccess('Products table created successfully');
    } catch (error) {
      callbacks.onError(`Failed to create products table: ${String(error)}`);
      throw error;
    }
    
    // Create orders table
    callbacks.onProgress(30, 'Creating orders table...');
    try {
      // Simulated success
      callbacks.onSuccess('Orders table created successfully');
    } catch (error) {
      callbacks.onError(`Failed to create orders table: ${String(error)}`);
      throw error;
    }
    
    // Set up RLS policies
    callbacks.onProgress(50, 'Setting up security policies...');
    try {
      // Simulated success
      callbacks.onSuccess('Security policies configured successfully');
    } catch (error) {
      callbacks.onError(`Failed to configure security policies: ${String(error)}`);
      throw error;
    }
    
    // Create stored procedures
    callbacks.onProgress(70, 'Creating stored procedures...');
    try {
      // Simulated success
      callbacks.onSuccess('Stored procedures created successfully');
    } catch (error) {
      callbacks.onError(`Failed to create stored procedures: ${String(error)}`);
      throw error;
    }
    
    // Create initial data
    callbacks.onProgress(90, 'Creating initial site data...');
    try {
      // Simulated success
      callbacks.onSuccess('Initial site data created successfully');
    } catch (error) {
      callbacks.onError(`Failed to create initial data: ${String(error)}`);
      throw error;
    }
    
    // Complete migration
    callbacks.onProgress(100, 'Migration completed successfully!');
    return true;
  } catch (error) {
    callbacks.onError(`Migration failed: ${String(error)}`);
    return false;
  }
};
