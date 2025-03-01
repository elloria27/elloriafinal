
-- Insert initial shop settings
CREATE OR REPLACE FUNCTION insert_shop_settings() RETURNS void AS $$
BEGIN
  -- Insert shop settings only if table exists and is empty
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'shop_settings') THEN
    IF NOT EXISTS (SELECT FROM shop_settings LIMIT 1) THEN
      INSERT INTO shop_settings (
        default_currency,
        enable_guest_checkout,
        min_order_amount,
        shipping_countries,
        tax_settings,
        payment_methods
      )
      VALUES (
        'USD',
        true,
        0,
        ARRAY['US', 'CA'],
        '{"CA": {"provinces": {"Quebec": {"gst": 5, "pst": 9.975}, "Alberta": {"gst": 5, "pst": 0}, "Ontario": {"hst": 13}, "Manitoba": {"gst": 5, "pst": 7}, "Nova Scotia": {"hst": 15}, "Saskatchewan": {"gst": 5, "pst": 6}, "New Brunswick": {"hst": 15}, "British Columbia": {"gst": 5, "pst": 7}, "Prince Edward Island": {"hst": 15}, "Newfoundland and Labrador": {"hst": 15}}}, "US": {"states": {}}}',
        '{"stripe": false, "cash_on_delivery": true}'
      );
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql;

SELECT insert_shop_settings();
DROP FUNCTION IF EXISTS insert_shop_settings();
