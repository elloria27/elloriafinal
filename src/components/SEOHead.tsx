
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
  noIndex?: boolean;
}

interface SEOSettings {
  default_title_template: string;
  default_meta_description: string;
  default_meta_keywords: string;
  google_site_verification: string;
  robots_txt: string;
}

export const SEOHead = ({
  title,
  description,
  keywords,
  canonicalUrl,
  ogTitle,
  ogDescription,
  ogImage,
  noIndex
}: SEOHeadProps) => {
  const [seoSettings, setSeoSettings] = useState<SEOSettings | null>(null);
  const [pageSettings, setPageSettings] = useState<any>(null);

  useEffect(() => {
    const loadSEOSettings = async () => {
      try {
        console.log('Loading SEO settings...');
        // Fetch global SEO settings
        const { data: seoData, error: seoError } = await supabase
          .from('seo_settings')
          .select('*')
          .single();

        if (seoError) {
          console.error('Error loading SEO settings:', seoError);
          return;
        }

        // Fetch current page SEO settings if we're on a specific page
        const currentPath = window.location.pathname;
        const { data: pageData, error: pageError } = await supabase
          .from('pages')
          .select('meta_title, meta_description, meta_keywords, canonical_url, allow_indexing, redirect_url')
          .eq('slug', currentPath === '/' ? 'index' : currentPath.slice(1))
          .single();

        if (pageError && pageError.code !== 'PGRST116') { // Ignore not found errors
          console.error('Error loading page SEO settings:', pageError);
        }

        console.log('SEO settings loaded:', { seoData, pageData });
        setSeoSettings(seoData);
        setPageSettings(pageData);

        // Handle redirects
        if (pageData?.redirect_url) {
          window.location.href = pageData.redirect_url;
        }
      } catch (error) {
        console.error('Error in loadSEOSettings:', error);
      }
    };

    loadSEOSettings();
  }, []);

  // Resolve final values using the cascade: props > page settings > global settings
  const finalTitle = title || pageSettings?.meta_title || seoSettings?.default_title_template?.replace('${page_title}', 'Home');
  const finalDescription = description || pageSettings?.meta_description || seoSettings?.default_meta_description;
  const finalKeywords = keywords || pageSettings?.meta_keywords || seoSettings?.default_meta_keywords;
  const finalCanonicalUrl = canonicalUrl || pageSettings?.canonical_url || `${window.location.origin}${window.location.pathname}`;
  
  // Determine if the page should be indexed
  const shouldIndex = !noIndex && (pageSettings?.allow_indexing !== false);
  const robotsContent = shouldIndex ? 'index,follow' : 'noindex,nofollow';

  return (
    <Helmet>
      {/* Basic meta tags */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="robots" content={robotsContent} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={finalCanonicalUrl} />
      
      {/* Open Graph meta tags */}
      <meta property="og:title" content={ogTitle || finalTitle} />
      <meta property="og:description" content={ogDescription || finalDescription} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={finalCanonicalUrl} />
      
      {/* Additional meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      
      {/* Google Site Verification */}
      {seoSettings?.google_site_verification && (
        <meta 
          name="google-site-verification" 
          content={seoSettings.google_site_verification}
        />
      )}
      
      {/* Dynamic robots.txt content */}
      {seoSettings?.robots_txt && (
        <link 
          type="text/plain" 
          rel="author" 
          href={`data:text/plain;charset=utf-8,${encodeURIComponent(seoSettings.robots_txt)}`} 
        />
      )}
    </Helmet>
  );
};
