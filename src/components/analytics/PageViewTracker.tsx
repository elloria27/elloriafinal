
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export const PageViewTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const trackPageView = async () => {
      // Generate a session ID if not exists
      let sessionId = localStorage.getItem('session_id');
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem('session_id', sessionId);
      }

      try {
        // Call our Edge Function instead of ipapi.co directly
        const { data: locationData, error } = await supabase.functions.invoke('get-geolocation');
        
        if (error) {
          console.error('Error getting location:', error);
          throw error;
        }

        console.log('Location data:', locationData);

        // Insert page view with location data
        const { error: insertError } = await supabase
          .from('page_views')
          .insert({
            page_path: location.pathname,
            session_id: sessionId,
            referrer: document.referrer,
            user_agent: navigator.userAgent,
            country: locationData.country_name,
            city: locationData.city
          });

        if (insertError) {
          console.error('Error tracking page view:', insertError);
        }
      } catch (err) {
        console.error('Error tracking page view:', err);
        
        // If location service fails, still track the page view without location data
        try {
          const { error } = await supabase
            .from('page_views')
            .insert({
              page_path: location.pathname,
              session_id: sessionId,
              referrer: document.referrer,
              user_agent: navigator.userAgent
            });

          if (error) {
            console.error('Error tracking page view without location:', error);
          }
        } catch (fallbackErr) {
          console.error('Error in fallback tracking:', fallbackErr);
        }
      }
    };

    trackPageView();
  }, [location.pathname]);

  return null;
};
