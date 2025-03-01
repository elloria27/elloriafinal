
-- Insert initial SEO settings
CREATE OR REPLACE FUNCTION insert_seo_settings() RETURNS void AS $$
BEGIN
  -- Insert SEO settings only if table exists and is empty
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'seo_settings') THEN
    IF NOT EXISTS (SELECT FROM seo_settings LIMIT 1) THEN
      INSERT INTO seo_settings (
        default_title_template, 
        default_meta_description, 
        default_meta_keywords,
        google_site_verification,
        robots_txt
      )
      VALUES (
        '{page} | Your Brand Name - Premium Feminine Care',
        'Your Brand Name offers premium feminine care products designed for comfort, protection, and sustainability.',
        'feminine care, pads, sustainable, comfort, protection',
        '',
        'User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /checkout/\nDisallow: /profile/'
      );
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql;

SELECT insert_seo_settings();
DROP FUNCTION IF EXISTS insert_seo_settings();
