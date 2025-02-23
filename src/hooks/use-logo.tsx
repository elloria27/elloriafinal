
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useLogo() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      return; // Exit early if Supabase is not initialized
    }

    const fetchLogo = async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('logo_url')
        .single();

      if (!error && data?.logo_url) {
        setLogoUrl(data.logo_url);
      }
    };

    fetchLogo();

    // Subscribe to changes only if Supabase is initialized
    const channel = supabase
      .channel('site_settings_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'site_settings',
        },
        (payload) => {
          setLogoUrl((payload.new as any).logo_url);
        }
      )
      .subscribe();

    return () => {
      if (supabase && channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return logoUrl;
}
