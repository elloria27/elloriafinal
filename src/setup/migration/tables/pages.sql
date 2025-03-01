
-- Table structure for 'pages'

-- Pages table stores all the website pages and their content
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content JSONB DEFAULT '[]',
  is_published BOOLEAN DEFAULT false,
  show_in_header BOOLEAN DEFAULT false,
  show_in_footer BOOLEAN DEFAULT false,
  parent_id UUID REFERENCES pages(id),
  menu_order INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
