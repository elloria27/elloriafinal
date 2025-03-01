
-- Table structure for 'site_settings'

-- Global site settings
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_title TEXT NOT NULL DEFAULT 'My Website',
  meta_description TEXT,
  meta_keywords TEXT,
  logo_url TEXT,
  favicon_url TEXT,
  contact_email TEXT,
  google_analytics_id TEXT,
  default_language TEXT NOT NULL DEFAULT 'en',
  enable_registration BOOLEAN NOT NULL DEFAULT true,
  enable_search_indexing BOOLEAN NOT NULL DEFAULT true,
  maintenance_mode BOOLEAN DEFAULT false,
  custom_scripts JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);
