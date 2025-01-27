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

        // Try to get location data using the browser's Geolocation API instead
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              try {
                // Use reverse geocoding with a more reliable service
                const response = await fetch(
                  `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`,
                  { signal: AbortSignal.timeout(3000) }
                );

                if (response.ok) {
                  const locationData = await response.json();
                  
                  // Update the page view with location data
                  const { error: updateError } = await supabase
                    .from('page_views')
                    .update({
                      country: locationData.countryName,
                      city: locationData.city
                    })
                    .eq('page_path', location.pathname)
                    .eq('session_id', sessionId);

                  if (updateError) {
                    console.warn('Could not update location data:', updateError);
                  }
                }
              } catch (locationError) {
                console.warn('Location service unavailable:', locationError);
              }
            },
            (error) => {
              console.warn('Geolocation permission denied:', error);
            },
            { timeout: 5000, enableHighAccuracy: false }
          );
        }
      } catch (err) {
        console.error('Error tracking page view:', err);
      }
    };

    trackPageView();
  }, [location.pathname]);

  return null;
};