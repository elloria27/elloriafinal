
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useLogo() {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    // Only run if supabase is configured
    if (!supabase) return;

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

    // Subscribe to changes only if supabase is configured
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
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return logoUrl;
}
