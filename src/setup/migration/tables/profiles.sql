
-- Table structure for 'profiles'

-- Profiles table stores user profile information
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone_number TEXT,
  address TEXT,
  country TEXT,
  region TEXT,
  language TEXT DEFAULT 'en',
  currency TEXT DEFAULT 'USD',
  email_notifications BOOLEAN DEFAULT false,
  marketing_emails BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc', now())
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Set up Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read only their own profile
CREATE POLICY "Users can read their own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Create policy to allow users to update only their own profile
CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
