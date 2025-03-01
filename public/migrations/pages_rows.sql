
-- Insert initial pages data
CREATE OR REPLACE FUNCTION insert_pages_data() RETURNS void AS $$
BEGIN
  -- Insert pages data only if table exists and is empty
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'pages') THEN
    IF NOT EXISTS (SELECT FROM pages LIMIT 1) THEN
      INSERT INTO pages (title, slug, is_published, show_in_header, show_in_footer, menu_order, page_template)
      VALUES 
        ('Home', 'home', true, true, false, 1, 'home'),
        ('About', 'about', true, true, false, 2, 'about'),
        ('Contact', 'contact', true, true, true, 3, 'contact'),
        ('Shop', 'shop', true, true, false, 4, 'shop'),
        ('Blog', 'blog', true, true, true, 5, 'blog'),
        ('Sustainability', 'sustainability', true, true, true, 6, 'sustainability'),
        ('For Business', 'for-business', true, true, false, 7, 'business'),
        ('Terms & Conditions', 'terms', true, false, true, 8, 'default');
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql;

SELECT insert_pages_data();
DROP FUNCTION IF EXISTS insert_pages_data();
