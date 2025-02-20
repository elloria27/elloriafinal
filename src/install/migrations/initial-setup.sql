
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

-- Products and inventory
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    price NUMERIC NOT NULL,
    image TEXT NOT NULL,
    media JSONB DEFAULT '[]'::jsonb,
    features TEXT[] DEFAULT '{}'::text[],
    specifications JSONB NOT NULL DEFAULT '{}'::jsonb,
    why_choose_features JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 0,
    sku TEXT,
    location TEXT,
    unit_cost NUMERIC DEFAULT 0,
    reorder_point INTEGER DEFAULT 50,
    optimal_stock INTEGER DEFAULT 200,
    low_stock_threshold INTEGER DEFAULT 100,
    last_counted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS inventory_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id),
    quantity_change INTEGER NOT NULL,
    previous_quantity INTEGER NOT NULL,
    new_quantity INTEGER NOT NULL,
    reason_type TEXT NOT NULL,
    reason_details TEXT,
    adjustment_type TEXT,
    unit_cost NUMERIC,
    total_cost NUMERIC,
    reference_number TEXT,
    retailer_name TEXT,
    location TEXT,
    performed_by TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Orders and payments
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id),
    profile_id UUID REFERENCES profiles(id),
    order_number TEXT NOT NULL,
    items JSONB NOT NULL,
    total_amount NUMERIC NOT NULL,
    shipping_cost NUMERIC DEFAULT 0,
    gst NUMERIC DEFAULT 0,
    status TEXT NOT NULL,
    shipping_address JSONB NOT NULL,
    billing_address JSONB NOT NULL,
    payment_method TEXT,
    stripe_session_id TEXT,
    applied_promo_code JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS payment_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    processing_fee NUMERIC DEFAULT 0,
    icon_url TEXT,
    stripe_config JSONB DEFAULT '{"secret_key": "", "publishable_key": ""}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS delivery_methods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    estimated_days TEXT,
    base_price NUMERIC DEFAULT 0,
    regions TEXT[] DEFAULT '{}'::text[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Promotions and referrals
CREATE TABLE IF NOT EXISTS promo_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL,
    type TEXT NOT NULL,
    value NUMERIC NOT NULL,
    min_purchase_amount NUMERIC DEFAULT 0,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    max_uses INTEGER,
    uses_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS referrals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referrer_id UUID REFERENCES profiles(id),
    referral_code TEXT NOT NULL,
    referral_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS referral_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    referral_id UUID REFERENCES referrals(id),
    referred_email TEXT NOT NULL,
    status referral_status DEFAULT 'pending',
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Tasks and project management
CREATE TABLE IF NOT EXISTS hrm_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    status task_status NOT NULL DEFAULT 'todo',
    priority task_priority NOT NULL DEFAULT 'medium',
    category task_category NOT NULL DEFAULT 'other',
    assigned_to UUID NOT NULL REFERENCES profiles(id),
    created_by UUID NOT NULL REFERENCES profiles(id),
    due_date TIMESTAMP WITH TIME ZONE,
    start_date TIMESTAMP WITH TIME ZONE,
    completion_date TIMESTAMP WITH TIME ZONE,
    estimated_hours NUMERIC DEFAULT 0,
    actual_hours NUMERIC DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hrm_task_checklists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES hrm_tasks(id),
    title TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hrm_checklist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    checklist_id UUID NOT NULL REFERENCES hrm_task_checklists(id),
    content TEXT NOT NULL,
    completed BOOLEAN DEFAULT false,
    order_index INTEGER NOT NULL,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hrm_subtasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES hrm_tasks(id),
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT false,
    order_index INTEGER NOT NULL,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hrm_task_labels (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    color TEXT NOT NULL,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS hrm_task_label_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES hrm_tasks(id),
    label_id UUID REFERENCES hrm_task_labels(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS hrm_task_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES hrm_tasks(id),
    created_by UUID NOT NULL REFERENCES profiles(id),
    comment TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hrm_task_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES hrm_tasks(id),
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    uploaded_by UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hrm_task_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES hrm_tasks(id),
    action TEXT NOT NULL,
    changed_by UUID NOT NULL REFERENCES profiles(id),
    old_value JSONB,
    new_value JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS hrm_task_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES hrm_tasks(id),
    user_id UUID REFERENCES profiles(id),
    notification_type notification_type NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    email_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- File management
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

-- Health tracking
CREATE TABLE IF NOT EXISTS symptoms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS symptom_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    symptom_id UUID NOT NULL REFERENCES symptoms(id),
    severity symptom_severity NOT NULL,
    date DATE NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS period_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    date DATE NOT NULL,
    flow_intensity flow_intensity NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS cycle_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    cycle_length INTEGER NOT NULL DEFAULT 28,
    period_length INTEGER NOT NULL DEFAULT 5,
    last_period_date DATE,
    notifications_enabled BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Reviews and Certificates
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    rating INTEGER NOT NULL,
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    certificate_number TEXT NOT NULL,
    category TEXT NOT NULL,
    issuing_authority TEXT NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    image_url TEXT,
    qr_code_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Settings and configurations
CREATE TABLE IF NOT EXISTS site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_title TEXT NOT NULL DEFAULT 'My Website',
    meta_description TEXT,
    meta_keywords TEXT,
    logo_url TEXT,
    favicon_url TEXT,
    contact_email TEXT,
    google_analytics_id TEXT,
    homepage_slug TEXT DEFAULT '',
    default_language supported_language NOT NULL DEFAULT 'en',
    enable_registration BOOLEAN NOT NULL DEFAULT true,
    enable_search_indexing BOOLEAN NOT NULL DEFAULT true,
    enable_cookie_consent BOOLEAN DEFAULT false,
    enable_https_redirect BOOLEAN DEFAULT false,
    enable_user_avatars BOOLEAN DEFAULT false,
    maintenance_mode BOOLEAN DEFAULT false,
    max_upload_size INTEGER DEFAULT 10,
    custom_scripts JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS seo_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    default_meta_description TEXT,
    default_meta_keywords TEXT,
    default_title_template TEXT,
    google_site_verification TEXT,
    robots_txt TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Contact and Business Forms
CREATE TABLE IF NOT EXISTS contact_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    newsletter_subscription BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS business_form_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    form_type form_type NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company_name TEXT,
    business_type TEXT,
    inquiry_type TEXT,
    order_quantity TEXT,
    message TEXT,
    notes TEXT,
    admin_notes TEXT,
    attachments JSONB,
    status form_status DEFAULT 'new',
    terms_accepted BOOLEAN DEFAULT false,
    assigned_to UUID REFERENCES profiles(id),
    assigned_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    last_updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Shop settings and analytics
CREATE TABLE IF NOT EXISTS shop_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    default_currency supported_currency NOT NULL DEFAULT 'USD',
    enable_guest_checkout BOOLEAN DEFAULT true,
    min_order_amount NUMERIC DEFAULT 0,
    max_order_amount NUMERIC,
    tax_rate NUMERIC DEFAULT 0,
    shipping_countries TEXT[] DEFAULT ARRAY['US', 'CA'],
    payment_methods JSONB DEFAULT '{"stripe": false, "cash_on_delivery": true}'::jsonb,
    stripe_settings JSONB DEFAULT '{"secret_key": "", "publishable_key": ""}'::jsonb,
    shipping_methods JSONB DEFAULT '{"CA": [], "US": []}'::jsonb,
    tax_settings JSONB DEFAULT '{"CA": {"provinces": {"Quebec": {"gst": 5, "pst": 9.975}, "Alberta": {"gst": 5, "pst": 0}, "Ontario": {"hst": 13}, "Manitoba": {"gst": 5, "pst": 7}, "Nova Scotia": {"hst": 15}, "Saskatchewan": {"gst": 5, "pst": 6}, "New Brunswick": {"hst": 15}, "British Columbia": {"gst": 5, "pst": 7}, "Prince Edward Island": {"hst": 15}, "Newfoundland and Labrador": {"hst": 15}}}, "US": {"states": {}}}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS page_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL,
    page_path TEXT NOT NULL,
    view_type page_view_type DEFAULT 'page_view',
    visitor_ip TEXT,
    country TEXT,
    city TEXT,
    user_agent TEXT,
    referrer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE symptom_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE period_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrm_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE hrm_personal_reminders ENABLE ROW LEVEL SECURITY;

-- Basic policies for profiles
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- Create trigger for new user creation
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

-- Create trigger for the handle_new_user function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

