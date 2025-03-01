
-- Table structure for 'seo_settings'

-- SEO settings for the website
CREATE TABLE IF NOT EXISTS seo_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  default_title_template TEXT,
  default_meta_description TEXT,
  default_meta_keywords TEXT,
  google_site_verification TEXT,
  robots_txt TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);
