
-- Insert initial products data
CREATE OR REPLACE FUNCTION insert_products_data() RETURNS void AS $$
BEGIN
  -- Insert products data only if table exists and is empty
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'products') THEN
    IF NOT EXISTS (SELECT FROM products LIMIT 1) THEN
      INSERT INTO products (
        name, 
        description, 
        price, 
        features, 
        image, 
        specifications, 
        media,
        why_choose_features,
        slug
      )
      VALUES 
        (
          'Ultra Comfort Day Pads', 
          'Experience superior comfort and protection with our Ultra Comfort Day Pads. Designed for active lifestyles, these pads feature advanced absorption technology and a soft, breathable top layer.', 
          12.99, 
          ARRAY['Ultra-soft surface', 'Maximum absorption', 'Breathable design', 'Leak protection'], 
          '/lovable-uploads/033d3c83-3a91-4fee-a121-d5e700b8768d.png',
          '{"length": "240mm", "absorption": "Heavy", "quantity": "10 pcs", "material": "Cotton, SAP", "features": "Wings, Breathable"}',
          '[{"type": "image", "url": "/lovable-uploads/033d3c83-3a91-4fee-a121-d5e700b8768d.png"}]',
          '[{"icon": "Shield", "title": "Superior Protection", "description": "Advanced leak guard ensures worry-free protection day and night"}, {"icon": "Heart", "title": "Gentle Comfort", "description": "Ultra-soft top layer for comfort throughout your day"}]',
          'ultra-comfort-day-pads'
        ),
        (
          'Overnight Protection Pads', 
          'Rest easy with our Overnight Protection Pads. These extra-long pads provide maximum coverage and absorption for uninterrupted sleep.', 
          14.99, 
          ARRAY['Extra length', 'Maximum absorption', 'Odor control', 'Soft texture'], 
          '/lovable-uploads/5064d341-66ba-411d-8a91-8781d383f256.png',
          '{"length": "280mm", "absorption": "Super", "quantity": "8 pcs", "material": "Cotton, SAP", "features": "Wings, Odor control"}',
          '[{"type": "image", "url": "/lovable-uploads/5064d341-66ba-411d-8a91-8781d383f256.png"}]',
          '[{"icon": "Moon", "title": "Night Protection", "description": "Extra-long design for worry-free sleep"}, {"icon": "Wind", "title": "Odor Control", "description": "Special technology neutralizes odors for fresh feeling"}]',
          'overnight-protection-pads'
        );
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql;

SELECT insert_products_data();
DROP FUNCTION IF EXISTS insert_products_data();
