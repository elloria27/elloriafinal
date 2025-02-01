import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface SEOData {
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  canonical_url: string | null;
  og_title: string | null;
  og_description: string | null;
  og_image: string | null;
}

export const useSEO = () => {
  const location = useLocation();
  const [seoData, setSeoData] = useState<SEOData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSEOData = async () => {
      try {
        console.log('Fetching SEO data for path:', location.pathname);
        
        // Convert path to slug (remove leading slash and handle index)
        const slug = location.pathname === '/' ? 'index' : location.pathname.slice(1);
        
        const { data, error } = await supabase
          .from('pages')
          .select('meta_title, meta_description, meta_keywords, canonical_url, og_title, og_description, og_image')
          .eq('slug', slug)
          .single();

        if (error) {
          console.error('Error fetching SEO data:', error);
          return;
        }

        console.log('Fetched SEO data:', data);
        setSeoData(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSEOData();
  }, [location.pathname]);

  return { seoData, loading };
};