
-- This file intentionally left without insert statements
-- User roles will be created automatically through the installation wizard
-- when creating the admin user
CREATE OR REPLACE FUNCTION setup_user_roles_table() RETURNS void AS $$
BEGIN
  -- Ensure the user_roles table exists with the right schema
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_roles') THEN
    -- Create role type if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
      CREATE TYPE user_role AS ENUM ('admin', 'client');
    END IF;
    
    -- Create user_roles table
    CREATE TABLE IF NOT EXISTS user_roles (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL,
      role user_role NOT NULL DEFAULT 'client',
      created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
    );
    
    -- Create index on user_id for better query performance
    CREATE INDEX IF NOT EXISTS user_roles_user_id_idx ON user_roles (user_id);
  END IF;
END;
$$ LANGUAGE plpgsql;

SELECT setup_user_roles_table();
DROP FUNCTION IF EXISTS setup_user_roles_table();
