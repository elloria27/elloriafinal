
-- Insert initial site settings
CREATE OR REPLACE FUNCTION insert_site_settings() RETURNS void AS $$
BEGIN
  -- Insert site settings only if table exists and is empty
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'site_settings') THEN
    IF NOT EXISTS (SELECT FROM site_settings LIMIT 1) THEN
      INSERT INTO site_settings (
        site_title,
        logo_url,
        favicon_url,
        meta_description,
        contact_email,
        default_language,
        enable_registration,
        enable_search_indexing,
        enable_cookie_consent
      )
      VALUES (
        'Your Brand Name',
        '/lovable-uploads/033d3c83-3a91-4fee-a121-d5e700b8768d.png',
        '/favicon.ico',
        'Premium feminine care products designed for comfort and sustainability',
        'contact@example.com',
        'en',
        true,
        true,
        true
      );
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql;

SELECT insert_site_settings();
DROP FUNCTION IF EXISTS insert_site_settings();
