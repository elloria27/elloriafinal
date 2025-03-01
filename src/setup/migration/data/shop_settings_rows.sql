
-- Sample data for the shop_settings table
INSERT INTO shop_settings (
  default_currency,
  enable_guest_checkout,
  min_order_amount,
  tax_rate,
  shipping_countries
) VALUES (
  'USD',
  true,
  10.00,
  5.00,
  ARRAY['US', 'CA', 'UK', 'AU']
);
