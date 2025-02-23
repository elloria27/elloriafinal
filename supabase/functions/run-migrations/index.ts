
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { supabaseUrl, supabaseKey } = await req.json();
    
    // Initialize Supabase client with provided credentials
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Execute migrations in order
    const migrations = [
      // Create custom types
      `DO $$ BEGIN
        CREATE TYPE user_role AS ENUM ('admin', 'client');
        CREATE TYPE post_status AS ENUM ('draft', 'published');
        CREATE TYPE page_view_type AS ENUM ('page_view', 'action');
        CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed');
        CREATE TYPE invoice_status AS ENUM ('pending', 'paid', 'overdue', 'cancelled');
        CREATE TYPE supported_currency AS ENUM ('USD', 'EUR', 'GBP', 'CAD');
        CREATE TYPE supported_language AS ENUM ('en', 'es', 'fr');
        CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'done');
        CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');
        CREATE TYPE task_category AS ENUM ('development', 'design', 'marketing', 'other');
        CREATE TYPE reminder_recurrence AS ENUM ('none', 'daily', 'weekly', 'monthly');
        CREATE TYPE severity_level AS ENUM ('low', 'medium', 'high');
        CREATE TYPE flow_intensity AS ENUM ('light', 'medium', 'heavy');
        CREATE TYPE referral_status AS ENUM ('pending', 'completed', 'expired');
        CREATE TYPE form_status AS ENUM ('new', 'in_progress', 'completed');
        CREATE TYPE component_status AS ENUM ('draft', 'published', 'archived');
        CREATE TYPE expense_status AS ENUM ('pending', 'approved', 'rejected');
        CREATE TYPE expense_payment_method AS ENUM ('cash', 'card', 'bank_transfer', 'other');
        CREATE TYPE expense_category AS ENUM ('office', 'travel', 'equipment', 'software', 'marketing', 'other');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;`,

      // Create essential functions
      `CREATE OR REPLACE FUNCTION create_table(sql text)
      RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
      BEGIN
        EXECUTE sql;
      END; $$;`,

      // Create core tables
      `CREATE TABLE IF NOT EXISTS profiles (
        id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
        email text,
        full_name text,
        phone_number text,
        address text,
        country text,
        region text,
        currency text DEFAULT 'USD',
        language text DEFAULT 'en',
        email_notifications boolean DEFAULT false,
        marketing_emails boolean DEFAULT false,
        completed_initial_setup boolean DEFAULT false,
        selected_delivery_method uuid,
        created_at timestamptz DEFAULT timezone('utc'::text, now()),
        updated_at timestamptz DEFAULT timezone('utc'::text, now())
      );`,

      `CREATE TABLE IF NOT EXISTS user_roles (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL,
        role user_role NOT NULL DEFAULT 'client',
        created_at timestamptz DEFAULT timezone('utc'::text, now())
      );`,

      // Blog related tables
      `CREATE TABLE IF NOT EXISTS blog_categories (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name text NOT NULL,
        slug text NOT NULL UNIQUE,
        parent_id uuid REFERENCES blog_categories(id),
        created_at timestamptz DEFAULT timezone('utc'::text, now()),
        updated_at timestamptz DEFAULT timezone('utc'::text, now())
      );`,

      `CREATE TABLE IF NOT EXISTS blog_posts (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        title text NOT NULL,
        content jsonb NOT NULL DEFAULT '{}'::jsonb,
        excerpt text,
        slug text UNIQUE,
        status post_status NOT NULL DEFAULT 'draft',
        featured_image text,
        author_id uuid REFERENCES auth.users(id),
        meta_title text,
        meta_description text,
        keywords text[],
        view_count integer DEFAULT 0,
        published_at timestamptz,
        created_at timestamptz DEFAULT timezone('utc'::text, now()),
        updated_at timestamptz DEFAULT timezone('utc'::text, now())
      );`,

      `CREATE TABLE IF NOT EXISTS blog_posts_categories (
        post_id uuid REFERENCES blog_posts(id) ON DELETE CASCADE,
        category_id uuid REFERENCES blog_categories(id) ON DELETE CASCADE,
        PRIMARY KEY (post_id, category_id)
      );`,

      // Pages and content
      `CREATE TABLE IF NOT EXISTS pages (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        title text NOT NULL,
        slug text NOT NULL UNIQUE,
        content jsonb DEFAULT '[]'::jsonb,
        content_blocks jsonb[] DEFAULT '{}'::jsonb[],
        is_published boolean DEFAULT false,
        show_in_header boolean DEFAULT false,
        show_in_footer boolean DEFAULT false,
        parent_id uuid REFERENCES pages(id),
        menu_order integer DEFAULT 0,
        page_template text DEFAULT 'default',
        menu_type text DEFAULT 'main',
        meta_title text,
        meta_description text,
        meta_keywords text,
        canonical_url text,
        og_title text,
        og_description text,
        og_image text,
        custom_canonical_url text,
        redirect_url text,
        meta_robots text,
        allow_indexing boolean DEFAULT true,
        created_at timestamptz DEFAULT timezone('utc'::text, now()),
        updated_at timestamptz DEFAULT timezone('utc'::text, now())
      );`,

      // Content blocks
      `CREATE TABLE IF NOT EXISTS content_blocks (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        type text NOT NULL,
        content jsonb NOT NULL DEFAULT '{}'::jsonb,
        order_index integer NOT NULL,
        page_id uuid REFERENCES pages(id) ON DELETE CASCADE,
        created_at timestamptz DEFAULT timezone('utc'::text, now()),
        updated_at timestamptz DEFAULT timezone('utc'::text, now())
      );`,

      // Products and inventory
      `CREATE TABLE IF NOT EXISTS products (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name text NOT NULL,
        description text NOT NULL,
        price numeric NOT NULL,
        image text NOT NULL,
        media jsonb DEFAULT '[]'::jsonb,
        specifications jsonb DEFAULT '{}'::jsonb,
        features text[] DEFAULT '{}'::text[],
        why_choose_features jsonb DEFAULT '[]'::jsonb,
        slug text NOT NULL UNIQUE,
        created_at timestamptz DEFAULT timezone('utc'::text, now()),
        updated_at timestamptz DEFAULT timezone('utc'::text, now())
      );`,

      `CREATE TABLE IF NOT EXISTS inventory (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        product_id uuid NOT NULL REFERENCES products(id),
        quantity integer NOT NULL DEFAULT 0,
        sku text,
        location text,
        unit_cost numeric DEFAULT 0,
        reorder_point integer DEFAULT 50,
        optimal_stock integer DEFAULT 200,
        low_stock_threshold integer DEFAULT 100,
        last_counted_at timestamptz,
        created_at timestamptz DEFAULT timezone('utc'::text, now()),
        updated_at timestamptz DEFAULT timezone('utc'::text, now())
      );`,

      // Orders and payments
      `CREATE TABLE IF NOT EXISTS orders (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid REFERENCES auth.users(id),
        profile_id uuid REFERENCES profiles(id),
        order_number text NOT NULL,
        status text NOT NULL,
        items jsonb NOT NULL,
        total_amount numeric NOT NULL,
        shipping_address jsonb NOT NULL,
        billing_address jsonb NOT NULL,
        shipping_cost numeric DEFAULT 0,
        gst numeric DEFAULT 0,
        payment_method text,
        stripe_session_id text,
        applied_promo_code jsonb,
        created_at timestamptz DEFAULT timezone('utc'::text, now())
      );`,

      // Settings tables
      `CREATE TABLE IF NOT EXISTS site_settings (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        site_title text NOT NULL DEFAULT 'My Website',
        logo_url text,
        favicon_url text,
        contact_email text,
        google_analytics_id text,
        meta_description text,
        meta_keywords text,
        homepage_slug text DEFAULT '',
        default_language supported_language NOT NULL DEFAULT 'en',
        enable_registration boolean NOT NULL DEFAULT true,
        enable_search_indexing boolean NOT NULL DEFAULT true,
        maintenance_mode boolean DEFAULT false,
        enable_cookie_consent boolean DEFAULT false,
        enable_https_redirect boolean DEFAULT false,
        max_upload_size integer DEFAULT 10,
        enable_user_avatars boolean DEFAULT false,
        custom_scripts jsonb DEFAULT '[]'::jsonb,
        created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now()),
        updated_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
      );`,

      // Add RLS policies
      `ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;`,
      `CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);`,
      `CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);`,

      `ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;`,
      `CREATE POLICY "Anyone can view published posts" ON blog_posts FOR SELECT USING (status = 'published' OR auth.role() = 'admin');`,
      `CREATE POLICY "Admins can manage posts" ON blog_posts FOR ALL USING (auth.role() = 'admin');`,

      `ALTER TABLE orders ENABLE ROW LEVEL SECURITY;`,
      `CREATE POLICY "Users can view own orders" ON orders FOR SELECT USING (auth.uid() = user_id);`,
      `CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);`,

      // Create functions for auto-updating timestamps
      `CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = timezone('utc'::text, now());
          RETURN NEW;
      END;
      $$ language 'plpgsql';`,

      // Add triggers for updating timestamps
      `CREATE TRIGGER update_profiles_updated_at
          BEFORE UPDATE ON profiles
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();`,

      `CREATE TRIGGER update_blog_posts_updated_at
          BEFORE UPDATE ON blog_posts
          FOR EACH ROW
          EXECUTE FUNCTION update_updated_at_column();`,

      // Add initial seed data
      `INSERT INTO site_settings (site_title, meta_description)
      VALUES ('My E-commerce Site', 'A modern e-commerce solution') 
      ON CONFLICT (id) DO NOTHING;`,

      // Initial blog category
      `INSERT INTO blog_categories (name, slug)
      VALUES ('General', 'general')
      ON CONFLICT (slug) DO NOTHING;`
    ];

    console.log('Starting migrations...');

    for (const migration of migrations) {
      const { error } = await supabase.rpc('create_table', { sql: migration });
      if (error) {
        console.error('Migration error:', error);
        throw error;
      }
    }

    console.log('Migrations completed successfully');

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error running migrations:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
