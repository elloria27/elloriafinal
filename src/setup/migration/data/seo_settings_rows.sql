
-- Sample data for the seo_settings table
INSERT INTO seo_settings (
  default_title_template,
  default_meta_description,
  default_meta_keywords,
  google_site_verification,
  robots_txt
) VALUES (
  '{{page_title}} | Elloria - Premium Feminine Care',
  'Elloria offers sustainable feminine care products for modern women. Discover our eco-friendly pads, tampons, and menstrual cups.',
  'feminine care, sustainable products, eco-friendly, women health, organic tampons, menstrual products',
  '',
  'User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /checkout/\nDisallow: /profile/\n'
);
