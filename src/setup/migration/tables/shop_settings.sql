
-- Table structure for 'shop_settings'

-- Shop configuration settings
CREATE TABLE IF NOT EXISTS shop_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  default_currency TEXT NOT NULL DEFAULT 'USD',
  enable_guest_checkout BOOLEAN DEFAULT true,
  min_order_amount NUMERIC DEFAULT 0,
  max_order_amount NUMERIC,
  tax_rate NUMERIC DEFAULT 0,
  shipping_countries TEXT[] DEFAULT ARRAY['US', 'CA'],
  payment_methods JSONB DEFAULT '{"stripe": false, "cash_on_delivery": true}',
  shipping_methods JSONB DEFAULT '{"CA": [], "US": []}',
  tax_settings JSONB DEFAULT '{"CA": {"provinces": {}}, "US": {"states": {}}}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);
