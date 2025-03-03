
import { SupabaseClient } from "@supabase/supabase-js";
import { supabase as defaultSupabase } from "@/integrations/supabase/client";

// Function to save Supabase config
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

// Check if installation is needed
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

// Verify database setup
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

// Mark installation as complete
export const markInstallationComplete = () => {
  localStorage.setItem('cms_installed', 'true');
};
