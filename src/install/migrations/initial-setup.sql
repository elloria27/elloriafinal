
-- Create required types
CREATE TYPE user_role AS ENUM ('admin', 'client', 'moderator');
CREATE TYPE post_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE component_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'done');
CREATE TYPE task_category AS ENUM ('bug', 'feature', 'maintenance', 'other');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE invoice_status AS ENUM ('draft', 'pending', 'paid', 'overdue', 'cancelled');
CREATE TYPE notification_type AS ENUM ('task_assigned', 'task_updated', 'deadline_approaching');
CREATE TYPE form_status AS ENUM ('new', 'in_progress', 'completed');
CREATE TYPE form_type AS ENUM ('bulk_consultation', 'custom_solutions', 'business_contact');
CREATE TYPE reminder_recurrence AS ENUM ('none', 'daily', 'weekly', 'monthly');
CREATE TYPE expense_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE page_view_type AS ENUM ('page_view', 'file_view');
CREATE TYPE supported_language AS ENUM ('en', 'fr', 'es');
CREATE TYPE supported_currency AS ENUM ('USD', 'CAD', 'EUR');
CREATE TYPE referral_status AS ENUM ('pending', 'completed', 'expired');
CREATE TYPE flow_intensity AS ENUM ('light', 'medium', 'heavy');
CREATE TYPE symptom_severity AS ENUM ('mild', 'moderate', 'severe');

-- Create profiles table first as it's referenced by many other tables
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    phone_number TEXT,
    address TEXT,
    country TEXT,
    region TEXT,
    language supported_language DEFAULT 'en',
    currency TEXT DEFAULT 'USD',
    marketing_emails BOOLEAN DEFAULT false,
    email_notifications BOOLEAN DEFAULT false,
    completed_initial_setup BOOLEAN DEFAULT false,
    selected_delivery_method UUID,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'client',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Blog related tables
CREATE TABLE IF NOT EXISTS blog_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    parent_id UUID REFERENCES blog_categories(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT,
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    excerpt TEXT,
    featured_image TEXT,
    author_id UUID REFERENCES profiles(id),
    status post_status NOT NULL DEFAULT 'draft',
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT[],
    published_at TIMESTAMP WITH TIME ZONE,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS blog_posts_categories (
    post_id UUID NOT NULL REFERENCES blog_posts(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES blog_categories(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, category_id)
);

CREATE TABLE IF NOT EXISTS blog_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS blog_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hero_title TEXT NOT NULL DEFAULT 'Stay Inspired with Elloria: News, Insights, and Stories',
    hero_subtitle TEXT NOT NULL DEFAULT 'Explore the latest updates on feminine care, sustainability, and empowering women',
    hero_background_image TEXT,
    instagram_profile_url TEXT DEFAULT 'https://instagram.com',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- File management tables
CREATE TABLE IF NOT EXISTS folders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    path TEXT NOT NULL,
    parent_path TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS file_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_path TEXT NOT NULL,
    folder_path TEXT,
    share_token TEXT NOT NULL,
    access_level TEXT NOT NULL,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    expires_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS bulk_file_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_paths TEXT[] NOT NULL,
    share_token TEXT NOT NULL,
    access_level TEXT NOT NULL,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    expires_at TIMESTAMP WITH TIME ZONE
);

-- Create RLS policies for basic tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_shares ENABLE ROW LEVEL SECURITY;

-- Basic policies
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Anyone can view published blog posts"
    ON blog_posts FOR SELECT
    USING (status = 'published');

CREATE POLICY "Authors can manage own blog posts"
    ON blog_posts FOR ALL
    USING (auth.uid() = author_id);

-- Add function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'full_name', ''));
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'client');
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

