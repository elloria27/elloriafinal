
-- This file intentionally left without insert statements
-- Profile data will be created automatically through the installation wizard
-- when creating the admin user
CREATE OR REPLACE FUNCTION setup_profiles_table() RETURNS void AS $$
BEGIN
  -- Ensure the profiles table exists with the right schema
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    CREATE TABLE IF NOT EXISTS profiles (
      id UUID PRIMARY KEY,
      email TEXT,
      full_name TEXT,
      phone_number TEXT,
      address TEXT,
      country TEXT,
      region TEXT,
      currency TEXT DEFAULT 'USD',
      language TEXT DEFAULT 'en',
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
      marketing_emails BOOLEAN DEFAULT false,
      email_notifications BOOLEAN DEFAULT false,
      completed_initial_setup BOOLEAN DEFAULT false
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

SELECT setup_profiles_table();
DROP FUNCTION IF EXISTS setup_profiles_table();
