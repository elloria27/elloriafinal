
-- Table structure for 'user_roles'

-- User roles for permission management
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'client',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- Setup function to check if a user has admin role
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    is_admin_user BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 
        FROM user_roles 
        WHERE user_roles.user_id = $1 
        AND role = 'admin'
    ) INTO is_admin_user;
    
    RETURN is_admin_user;
END;
$$;

-- Setup trigger to assign default role when user is created
CREATE OR REPLACE FUNCTION handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'client');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created_assign_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_role();
