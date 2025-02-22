
import { useEffect, useState } from 'react';
import { InstallationWizard } from '@/install/components/InstallationWizard';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';

export default function Setup() {
  const [needsSetup, setNeedsSetup] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSetup = async () => {
      try {
        // First check if Supabase is configured
        if (!isSupabaseConfigured) {
          setNeedsSetup(true);
          setIsLoading(false);
          return;
        }

        // If Supabase is configured, try to connect
        const { data, error } = await supabase!.from('site_settings').select('*').limit(1);
        
        if (error) {
          setNeedsSetup(true);
        } else {
          // If we can query the database, setup is complete
          setNeedsSetup(false);
          window.location.href = '/';
        }
      } catch (error) {
        setNeedsSetup(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkSetup();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!needsSetup) {
    return null;
  }

  return <InstallationWizard />;
}
