
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
    
    // Try a different approach using direct query to information_schema
    try {
      // Use direct query to check if the profiles table exists
      // This requires certain permissions but works in many cases
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
