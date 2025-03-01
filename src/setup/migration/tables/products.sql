
-- Table structure for 'products'

-- Products table stores all products in the shop
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  price NUMERIC NOT NULL,
  image TEXT NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  specifications JSONB NOT NULL DEFAULT '{}',
  media JSONB DEFAULT '[]',
  why_choose_features JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
