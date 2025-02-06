import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

export const SEOHead = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage,
}: SEOHeadProps) => {
  const [siteSettings, setSiteSettings] = useState<any>(null);

  useEffect(() => {
    const loadSiteSettings = async () => {
      try {
        console.log('Loading site SEO settings...');
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .single();

        if (error) {
          console.error('Error loading site settings:', error);
          return;
        }

        console.log('Site settings loaded:', data);
        setSiteSettings(data);
      } catch (error) {
        console.error('Error in loadSiteSettings:', error);
      }
    };

    loadSiteSettings();
  }, []);

  const defaultTitle = siteSettings?.site_title || 'Eco Curve Interact';
  const defaultDescription = siteSettings?.meta_description || 'Sustainable solutions for a better future';
  const defaultKeywords = siteSettings?.meta_keywords || '';
  const currentUrl = window.location.href;
  
  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{title || defaultTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl || currentUrl} />
      
      {/* Open Graph meta tags */}
      <meta property="og:title" content={ogTitle || title || defaultTitle} />
      <meta property="og:description" content={ogDescription || description || defaultDescription} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl || currentUrl} />
      
      {/* Additional meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      
      {/* Favicon */}
      {siteSettings?.favicon_url && (
        <link rel="icon" href={siteSettings.favicon_url} />
      )}
    </Helmet>
  );
};