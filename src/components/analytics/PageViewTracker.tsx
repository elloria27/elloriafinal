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
        console.log('Tracking page view:', location.pathname);
        
        // Insert page view without waiting for location data
        const { error } = await supabase
          .from('page_views')
          .insert({
            page_path: location.pathname,
            session_id: sessionId,
            referrer: document.referrer,
            user_agent: navigator.userAgent,
          });

        if (error) {
          console.error('Error tracking page view:', error);
        }

        // Try to get location data in the background with a timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        try {
          const response = await fetch('https://ipapi.co/json/', { 
            signal: controller.signal
          });
          
          clearTimeout(timeoutId);
          
          if (response.ok) {
            const locationData = await response.json();
            
            // Update the page view with location data
            if (locationData.country_name || locationData.city) {
              const { error: updateError } = await supabase
                .from('page_views')
                .update({
                  country: locationData.country_name,
                  city: locationData.city
                })
                .eq('page_path', location.pathname)
                .eq('session_id', sessionId);

              if (updateError) {
                console.warn('Could not update location data:', updateError);
              }
            }
          }
        } catch (locationError) {
          // Just log the location error but don't let it affect the page view tracking
          console.warn('Location service unavailable:', locationError);
          clearTimeout(timeoutId);
        }
      } catch (err) {
        console.error('Error tracking page view:', err);
      }
    };

    trackPageView();
  }, [location.pathname]);

  return null;
};