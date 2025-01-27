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
        
        // Get visitor's country using ipapi.co (free service)
        const response = await fetch('https://ipapi.co/json/');
        const locationData = await response.json();
        
        const { error } = await supabase
          .from('page_views')
          .insert({
            page_path: location.pathname,
            session_id: sessionId,
            referrer: document.referrer,
            user_agent: navigator.userAgent,
            country: locationData.country_name,
            city: locationData.city
          });

        if (error) {
          console.error('Error tracking page view:', error);
        }
      } catch (err) {
        console.error('Error tracking page view:', err);
      }
    };

    trackPageView();
  }, [location.pathname]);

  return null;
};