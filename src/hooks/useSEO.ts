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
        
        // Extract the base path without dynamic parameters
        const basePath = location.pathname.split('/').slice(0, 2).join('/');
        console.log('Base path for SEO:', basePath);
        
        // Check if this is a blog post page
        if (location.pathname.startsWith('/blog/')) {
          const postId = location.pathname.split('/blog/')[1];
          if (!postId) {
            setLoading(false);
            return;
          }

          const { data, error } = await supabase
            .from('blog_posts')
            .select('meta_title, meta_description, keywords, featured_image')
            .eq('id', postId)
            .single();

          if (!error && data) {
            console.log('Found blog post SEO data:', data);
            setSeoData({
              meta_title: data.meta_title,
              meta_description: data.meta_description,
              meta_keywords: data.keywords?.join(', ') || null,
              canonical_url: `${window.location.origin}/blog/${postId}`,
              og_title: data.meta_title,
              og_description: data.meta_description,
              og_image: data.featured_image
            });
          }
          setLoading(false);
          return;
        }

        // Check if this is a product page
        if (location.pathname.startsWith('/products/')) {
          const productId = location.pathname.split('/products/')[1];
          if (!productId) {
            setLoading(false);
            return;
          }

          const { data, error } = await supabase
            .from('products')
            .select('name, description, image')
            .eq('id', productId)
            .single();

          if (!error && data) {
            console.log('Found product SEO data:', data);
            setSeoData({
              meta_title: `${data.name} - Eco Curve Interact`,
              meta_description: data.description,
              meta_keywords: null,
              canonical_url: `${window.location.origin}/products/${productId}`,
              og_title: data.name,
              og_description: data.description,
              og_image: data.image
            });
          }
          setLoading(false);
          return;
        }

        // For regular pages
        const slug = basePath === '/' ? 'index' : basePath.slice(1);
        console.log('Looking up SEO data for slug:', slug);
        
        const { data, error } = await supabase
          .from('pages')
          .select('meta_title, meta_description, meta_keywords, canonical_url, og_title, og_description, og_image')
          .eq('slug', slug)
          .single();

        if (error) {
          console.log('No SEO data found for slug:', slug);
          setLoading(false);
          return;
        }

        console.log('Found page SEO data:', data);
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