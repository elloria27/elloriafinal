
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

// Properly configured CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    });
  }

  // Check if the request method is valid
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ success: false, error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
  
  try {
    const requestData = await req.json();
    console.log("Received setup request:", requestData);
    
    // Get database connection string
    const connectionString = Deno.env.get("SUPABASE_DB_URL");
    if (!connectionString) {
      console.error("ERROR: Database connection string (SUPABASE_DB_URL) is missing!");
      return new Response(JSON.stringify({ 
        success: false, 
        error: "Database connection string not found in environment variables" 
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Create a client and connect to the database
    const client = new Client(connectionString);
    
    try {
      console.log("Connecting to database...");
      await client.connect();
      console.log("Connected to database successfully");
      
      // Function to execute SQL safely with detailed error and success logging
      const executeSql = async (sqlStatement, description) => {
        try {
          console.log(`Starting: ${description}`);
          await client.queryArray(sqlStatement);
          console.log(`Completed: ${description}`);
          return { success: true };
        } catch (err) {
          console.error(`Error in ${description}:`, err);
          throw new Error(`Failed to ${description}: ${err.message}`);
        }
      };

      // Execute migrations in a specific sequence based on their dependencies
      try {
        // 1. Create ENUM types first
        await executeSql(`
          -- Create necessary ENUMs
          DO $$
          BEGIN
            -- Create task status enum if it doesn't exist
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_status') THEN
              CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'review', 'done');
            END IF;

            -- Create task priority enum if it doesn't exist
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_priority') THEN
              CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
            END IF;

            -- Create task category enum if it doesn't exist
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_category') THEN
              CREATE TYPE task_category AS ENUM ('development', 'design', 'marketing', 'support', 'hr', 'finance', 'other');
            END IF;

            -- Create task notification type enum if it doesn't exist
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_notification_type') THEN
              CREATE TYPE task_notification_type AS ENUM ('assigned', 'comment', 'due_soon', 'completed', 'status_change');
            END IF;

            -- Create expense status enum if it doesn't exist
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'expense_status') THEN
              CREATE TYPE expense_status AS ENUM ('pending', 'approved', 'rejected', 'paid');
            END IF;

            -- Create expense payment method enum if it doesn't exist
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'expense_payment_method') THEN
              CREATE TYPE expense_payment_method AS ENUM ('credit_card', 'cash', 'bank_transfer', 'cheque', 'other');
            END IF;

            -- Create expense category enum if it doesn't exist
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'expense_category') THEN
              CREATE TYPE expense_category AS ENUM ('office_supplies', 'travel', 'meals', 'marketing', 'software', 'hardware', 'rent', 'utilities', 'salary', 'taxes', 'other');
            END IF;

            -- Create payment status enum if it doesn't exist
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
              CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
            END IF;

            -- Create invoice status enum if it doesn't exist
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'invoice_status') THEN
              CREATE TYPE invoice_status AS ENUM ('draft', 'pending', 'paid', 'overdue', 'cancelled');
            END IF;

            -- Create page view type enum if it doesn't exist
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'page_view_type') THEN
              CREATE TYPE page_view_type AS ENUM ('page_view', 'file_download', 'product_view', 'blog_view');
            END IF;

            -- Create form status enum if it doesn't exist
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'form_status') THEN
              CREATE TYPE form_status AS ENUM ('new', 'in_progress', 'contacted', 'completed', 'archived');
            END IF;

            -- Create user role enum if it doesn't exist
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
              CREATE TYPE user_role AS ENUM ('admin', 'editor', 'contributor', 'client');
            END IF;

            -- Create component status enum if it doesn't exist
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'component_status') THEN
              CREATE TYPE component_status AS ENUM ('draft', 'active', 'archived');
            END IF;

            -- Create content block type enum if it doesn't exist
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_block_type') THEN
              CREATE TYPE content_block_type AS ENUM ('hero', 'features', 'testimonials', 'cta', 'text', 'carousel', 'gallery', 'contact_form', 'faq', 'pricing', 'team', 'blog', 'partners');
            END IF;

            -- Create post status enum if it doesn't exist
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'post_status') THEN
              CREATE TYPE post_status AS ENUM ('draft', 'published', 'archived');
            END IF;

            -- Create promo code type enum if it doesn't exist
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'promo_code_type') THEN
              CREATE TYPE promo_code_type AS ENUM ('percentage', 'fixed_amount', 'free_shipping');
            END IF;

            -- Create referral status enum if it doesn't exist
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'referral_status') THEN
              CREATE TYPE referral_status AS ENUM ('pending', 'converted', 'expired');
            END IF;

            -- Create flow intensity enum if it doesn't exist
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'flow_intensity') THEN
              CREATE TYPE flow_intensity AS ENUM ('light', 'medium', 'heavy');
            END IF;

            -- Create symptom severity enum if it doesn't exist
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'symptom_severity') THEN
              CREATE TYPE symptom_severity AS ENUM ('mild', 'moderate', 'severe');
            END IF;

            -- Create reminder recurrence enum if it doesn't exist
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'reminder_recurrence') THEN
              CREATE TYPE reminder_recurrence AS ENUM ('none', 'daily', 'weekly', 'monthly', 'yearly');
            END IF;

            -- Create supported currency enum if it doesn't exist
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'supported_currency') THEN
              CREATE TYPE supported_currency AS ENUM ('USD', 'CAD', 'EUR', 'GBP');
            END IF;

            -- Create supported language enum if it doesn't exist
            IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'supported_language') THEN
              CREATE TYPE supported_language AS ENUM ('en', 'fr', 'uk');
            END IF;
          END
          $$;
        `, "Create ENUM types");

        // 2. Create core tables
        await executeSql(`
          -- Create site_settings table
          CREATE TABLE IF NOT EXISTS site_settings (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            site_title VARCHAR(255),
            default_language supported_language,
            enable_registration BOOLEAN,
            enable_search_indexing BOOLEAN,
            meta_description TEXT,
            meta_keywords TEXT,
            custom_scripts JSONB,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            updated_at TIMESTAMPTZ DEFAULT NOW(),
            homepage_slug VARCHAR(255),
            favicon_url TEXT,
            maintenance_mode BOOLEAN,
            contact_email VARCHAR(255),
            google_analytics_id VARCHAR(255),
            enable_cookie_consent BOOLEAN,
            enable_https_redirect BOOLEAN,
            max_upload_size BIGINT,
            enable_user_avatars BOOLEAN,
            logo_url TEXT
          );

          -- Create user_roles table (needed for RLS policies)
          CREATE TABLE IF NOT EXISTS user_roles (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
            role user_role NOT NULL,
            created_at TIMESTAMPTZ DEFAULT NOW(),
            UNIQUE(user_id, role)
          );

          -- Create profiles table (needed for user data)
          CREATE TABLE IF NOT EXISTS profiles (
            id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            email TEXT,
            full_name TEXT,
            phone_number TEXT,
            address TEXT,
            country TEXT,
            region TEXT,
            language TEXT DEFAULT 'en',
            email_notifications BOOLEAN DEFAULT FALSE,
            marketing_emails BOOLEAN DEFAULT FALSE,
            selected_delivery_method UUID,
            currency TEXT DEFAULT 'USD',
            updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
            completed_initial_setup BOOLEAN DEFAULT FALSE
          );
        `, "Create core tables (site_settings, user_roles, profiles)");

        // 3. Create content management system tables
        await executeSql(`
          -- Create pages table
          CREATE TABLE IF NOT EXISTS pages (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            title TEXT NOT NULL,
            slug TEXT NOT NULL,
            content JSONB NOT NULL DEFAULT '[]'::jsonb,
            is_published BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
            updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
            show_in_header BOOLEAN DEFAULT FALSE,
            show_in_footer BOOLEAN DEFAULT FALSE,
            content_blocks JSONB[] DEFAULT '{}'::jsonb[],
            parent_id UUID,
            menu_order INTEGER DEFAULT 0,
            allow_indexing BOOLEAN DEFAULT TRUE,
            meta_title TEXT,
            meta_description TEXT,
            meta_keywords TEXT,
            canonical_url TEXT,
            og_title TEXT,
            og_description TEXT,
            og_image TEXT,
            custom_canonical_url TEXT,
            redirect_url TEXT,
            meta_robots TEXT,
            page_template TEXT DEFAULT 'default',
            menu_type TEXT DEFAULT 'main'
          );

          -- Create content_blocks table
          CREATE TABLE IF NOT EXISTS content_blocks (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            page_id UUID,
            type content_block_type NOT NULL,
            content JSONB NOT NULL DEFAULT '{}'::jsonb,
            order_index INTEGER NOT NULL,
            created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
            updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
          );

          -- Create component_definitions table
          CREATE TABLE IF NOT EXISTS component_definitions (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            description TEXT,
            type TEXT NOT NULL,
            category TEXT NOT NULL,
            icon TEXT,
            default_props JSONB DEFAULT '{}'::jsonb,
            status component_status DEFAULT 'draft',
            created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
            updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
          );

          -- Create seo_settings table
          CREATE TABLE IF NOT EXISTS seo_settings (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            default_title_template TEXT,
            default_meta_description TEXT,
            default_meta_keywords TEXT,
            robots_txt TEXT,
            google_site_verification TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
          );
        `, "Create content management system tables");

        // 4. Create blog system tables
        await executeSql(`
          -- Create blog_categories table
          CREATE TABLE IF NOT EXISTS blog_categories (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            slug TEXT NOT NULL,
            parent_id UUID,
            created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
            updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
          );

          -- Create blog_posts table
          CREATE TABLE IF NOT EXISTS blog_posts (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            title TEXT NOT NULL,
            slug TEXT,
            content JSONB NOT NULL DEFAULT '{}'::jsonb,
            excerpt TEXT,
            featured_image TEXT,
            status post_status NOT NULL DEFAULT 'draft',
            author_id UUID,
            published_at TIMESTAMPTZ,
            meta_title TEXT,
            meta_description TEXT,
            keywords TEXT[],
            view_count INTEGER DEFAULT 0,
            created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
            updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
          );

          -- Create blog_posts_categories table (junction table)
          CREATE TABLE IF NOT EXISTS blog_posts_categories (
            post_id UUID NOT NULL,
            category_id UUID NOT NULL
          );

          -- Create blog_comments table
          CREATE TABLE IF NOT EXISTS blog_comments (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            post_id UUID,
            user_id UUID,
            content TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
            updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
          );

          -- Create blog_settings table
          CREATE TABLE IF NOT EXISTS blog_settings (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            hero_title TEXT NOT NULL DEFAULT 'Stay Inspired with Elloria: News, Insights, and Stories',
            hero_subtitle TEXT NOT NULL DEFAULT 'Explore the latest updates on feminine care, sustainability, and empowering women',
            hero_background_image TEXT,
            instagram_profile_url TEXT DEFAULT 'https://instagram.com',
            created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
            updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
          );
        `, "Create blog system tables");

        // 5. Create e-commerce system tables
        await executeSql(`
          -- Create products table
          CREATE TABLE IF NOT EXISTS products (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            price NUMERIC NOT NULL,
            image TEXT NOT NULL,
            slug TEXT NOT NULL,
            features TEXT[] NOT NULL DEFAULT '{}',
            specifications JSONB NOT NULL DEFAULT '{}',
            media JSONB DEFAULT '[]',
            why_choose_features JSONB DEFAULT '[]',
            created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
            updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
          );

          -- Create inventory table
          CREATE TABLE IF NOT EXISTS inventory (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            product_id UUID NOT NULL,
            quantity INTEGER NOT NULL DEFAULT 0,
            sku TEXT,
            unit_cost NUMERIC DEFAULT 0,
            location TEXT,
            reorder_point INTEGER DEFAULT 50,
            low_stock_threshold INTEGER DEFAULT 100,
            optimal_stock INTEGER DEFAULT 200,
            last_counted_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
            updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
          );

          -- Create inventory_logs table
          CREATE TABLE IF NOT EXISTS inventory_logs (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            product_id UUID NOT NULL,
            quantity_change INTEGER NOT NULL,
            previous_quantity INTEGER NOT NULL,
            new_quantity INTEGER NOT NULL,
            reason_type TEXT NOT NULL,
            reason_details TEXT,
            adjustment_type TEXT,
            reference_number TEXT,
            performed_by TEXT,
            unit_cost NUMERIC,
            total_cost NUMERIC,
            location TEXT,
            retailer_name TEXT,
            created_by UUID,
            created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
          );

          -- Create orders table
          CREATE TABLE IF NOT EXISTS orders (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID,
            profile_id UUID,
            order_number TEXT NOT NULL,
            items JSONB NOT NULL,
            total_amount NUMERIC NOT NULL,
            shipping_address JSONB NOT NULL,
            billing_address JSONB NOT NULL,
            status TEXT NOT NULL,
            shipping_cost NUMERIC DEFAULT 0,
            gst NUMERIC DEFAULT 0,
            applied_promo_code JSONB,
            stripe_session_id TEXT,
            payment_method TEXT,
            created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
          );

          -- Create promo_codes table
          CREATE TABLE IF NOT EXISTS promo_codes (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            code TEXT NOT NULL,
            type promo_code_type NOT NULL,
            value NUMERIC NOT NULL,
            min_purchase_amount NUMERIC DEFAULT 0,
            max_uses INTEGER,
            uses_count INTEGER DEFAULT 0,
            start_date TIMESTAMPTZ,
            end_date TIMESTAMPTZ,
            description TEXT,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
            updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
          );

          -- Create delivery_methods table
          CREATE TABLE IF NOT EXISTS delivery_methods (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            description TEXT,
            base_price NUMERIC DEFAULT 0,
            regions TEXT[] DEFAULT '{}',
            estimated_days TEXT,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
            updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
          );

          -- Create payment_methods table
          CREATE TABLE IF NOT EXISTS payment_methods (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            description TEXT,
            icon_url TEXT,
            processing_fee NUMERIC DEFAULT 0,
            stripe_config JSONB DEFAULT '{"secret_key": "", "publishable_key": ""}'::jsonb,
            is_active BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
            updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
          );

          -- Create shop_settings table
          CREATE TABLE IF NOT EXISTS shop_settings (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            default_currency supported_currency NOT NULL DEFAULT 'USD',
            tax_rate NUMERIC DEFAULT 0,
            min_order_amount NUMERIC DEFAULT 0,
            max_order_amount NUMERIC,
            enable_guest_checkout BOOLEAN DEFAULT TRUE,
            shipping_countries TEXT[] DEFAULT ARRAY['US', 'CA'],
            shipping_methods JSONB DEFAULT '{"US": [], "CA": []}'::jsonb,
            tax_settings JSONB DEFAULT '{"CA": {"provinces": {"Quebec": {"gst": 5, "pst": 9.975}, "Alberta": {"gst": 5, "pst": 0}, "Ontario": {"hst": 13}, "Manitoba": {"gst": 5, "pst": 7}, "Nova Scotia": {"hst": 15}, "Saskatchewan": {"gst": 5, "pst": 6}, "New Brunswick": {"hst": 15}, "British Columbia": {"gst": 5, "pst": 7}, "Prince Edward Island": {"hst": 15}, "Newfoundland and Labrador": {"hst": 15}}}, "US": {"states": {}}}'::jsonb,
            stripe_settings JSONB DEFAULT '{"secret_key": "", "publishable_key": ""}'::jsonb,
            payment_methods JSONB DEFAULT '{"stripe": false, "cash_on_delivery": true}'::jsonb,
            created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
          );

          -- Create shop_company_expenses table
          CREATE TABLE IF NOT EXISTS shop_company_expenses (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            title TEXT NOT NULL,
            amount NUMERIC NOT NULL,
            date DATE NOT NULL,
            category expense_category NOT NULL,
            vendor_name TEXT NOT NULL,
            payment_method expense_payment_method NOT NULL,
            status expense_status NOT NULL DEFAULT 'pending',
            receipt_path TEXT,
            notes TEXT,
            created_by UUID,
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now()
          );
        `, "Create e-commerce system tables");

        // 6. Create HRM system tables (invoices, tasks, etc.)
        await executeSql(`
          -- Create hrm_customers table
          CREATE TABLE IF NOT EXISTS hrm_customers (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT,
            address JSONB,
            tax_id TEXT,
            created_by UUID,
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now()
          );

          -- Create hrm_invoices table
          CREATE TABLE IF NOT EXISTS hrm_invoices (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            invoice_number TEXT NOT NULL,
            customer_id UUID,
            employee_id UUID,
            due_date DATE NOT NULL,
            subtotal_amount NUMERIC NOT NULL DEFAULT 0,
            tax_amount NUMERIC NOT NULL DEFAULT 0,
            total_amount NUMERIC NOT NULL DEFAULT 0,
            total_amount_with_tax NUMERIC DEFAULT 0,
            status invoice_status NOT NULL DEFAULT 'pending',
            payment_terms TEXT,
            notes TEXT,
            company_info JSONB DEFAULT '{}'::jsonb,
            discount_type TEXT,
            discount_amount NUMERIC DEFAULT 0,
            shipping_amount NUMERIC DEFAULT 0,
            footer_text TEXT,
            payment_instructions TEXT,
            reference_number TEXT,
            currency TEXT NOT NULL DEFAULT 'CAD',
            tax_details JSONB DEFAULT '{}'::jsonb,
            late_fee_percentage NUMERIC DEFAULT 0,
            template_version TEXT DEFAULT '1.0',
            pdf_url TEXT,
            last_sent_at TIMESTAMPTZ,
            last_sent_to TEXT,
            created_by UUID,
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now()
          );

          -- Create hrm_invoice_items table
          CREATE TABLE IF NOT EXISTS hrm_invoice_items (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            invoice_id UUID,
            description TEXT NOT NULL,
            quantity INTEGER NOT NULL DEFAULT 1,
            unit_price NUMERIC NOT NULL,
            tax_percentage NUMERIC DEFAULT 0,
            total_price NUMERIC NOT NULL,
            tax_category_id UUID,
            created_at TIMESTAMPTZ DEFAULT now()
          );

          -- Create hrm_invoice_payments table
          CREATE TABLE IF NOT EXISTS hrm_invoice_payments (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            invoice_id UUID,
            amount_paid NUMERIC NOT NULL,
            payment_date TIMESTAMPTZ NOT NULL DEFAULT now(),
            payment_method TEXT NOT NULL,
            transaction_id TEXT,
            status payment_status NOT NULL DEFAULT 'pending',
            created_by UUID,
            created_at TIMESTAMPTZ DEFAULT now()
          );

          -- Create hrm_invoice_settings table
          CREATE TABLE IF NOT EXISTS hrm_invoice_settings (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            company_id UUID,
            company_info JSONB DEFAULT '{}'::jsonb,
            company_email TEXT,
            company_phone TEXT,
            logo_url TEXT,
            default_notes TEXT,
            payment_instructions TEXT,
            footer_text TEXT,
            default_due_days INTEGER DEFAULT 30,
            late_fee_percentage NUMERIC DEFAULT 0,
            invoice_template TEXT DEFAULT 'standard',
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now()
          );

          -- Create hrm_invoice_emails table
          CREATE TABLE IF NOT EXISTS hrm_invoice_emails (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            invoice_id UUID,
            sent_to TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'sent',
            email_type TEXT NOT NULL DEFAULT 'invoice',
            sent_at TIMESTAMPTZ DEFAULT now(),
            sent_by UUID,
            template_version TEXT,
            error_message TEXT
          );

          -- Create hrm_recurring_invoices table
          CREATE TABLE IF NOT EXISTS hrm_recurring_invoices (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            customer_id UUID,
            frequency TEXT NOT NULL,
            start_date DATE NOT NULL,
            end_date DATE,
            template_data JSONB NOT NULL,
            is_active BOOLEAN DEFAULT TRUE,
            last_generated TIMESTAMPTZ,
            next_generation TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now()
          );

          -- Create hrm_credit_notes table
          CREATE TABLE IF NOT EXISTS hrm_credit_notes (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            credit_note_number TEXT NOT NULL,
            customer_id UUID,
            invoice_id UUID,
            amount NUMERIC NOT NULL,
            reason TEXT,
            status TEXT NOT NULL DEFAULT 'issued',
            created_by UUID,
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now()
          );

          -- Create hrm_customer_payment_methods table
          CREATE TABLE IF NOT EXISTS hrm_customer_payment_methods (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            customer_id UUID,
            type TEXT NOT NULL,
            details JSONB NOT NULL,
            is_default BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now()
          );

          -- Create hrm_expense_categories table
          CREATE TABLE IF NOT EXISTS hrm_expense_categories (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            description TEXT,
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now()
          );

          -- Create hrm_estimates table
          CREATE TABLE IF NOT EXISTS hrm_estimates (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            estimate_number TEXT NOT NULL,
            customer_id UUID,
            valid_until DATE,
            subtotal_amount NUMERIC NOT NULL DEFAULT 0,
            tax_amount NUMERIC NOT NULL DEFAULT 0,
            total_amount NUMERIC NOT NULL DEFAULT 0,
            status TEXT NOT NULL DEFAULT 'draft',
            notes TEXT,
            terms TEXT,
            created_by UUID,
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now()
          );

          -- Create hrm_estimate_items table
          CREATE TABLE IF NOT EXISTS hrm_estimate_items (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            estimate_id UUID,
            description TEXT NOT NULL,
            quantity INTEGER NOT NULL DEFAULT 1,
            unit_price NUMERIC NOT NULL,
            tax_percentage NUMERIC DEFAULT 0,
            total_price NUMERIC NOT NULL,
            created_at TIMESTAMPTZ DEFAULT now()
          );

          -- Create hrm_tasks table
          CREATE TABLE IF NOT EXISTS hrm_tasks (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            title TEXT NOT NULL,
            description TEXT,
            status task_status NOT NULL DEFAULT 'todo',
            priority task_priority NOT NULL DEFAULT 'medium',
            category task_category NOT NULL DEFAULT 'other',
            assigned_to UUID NOT NULL,
            created_by UUID NOT NULL,
            start_date TIMESTAMPTZ,
            due_date TIMESTAMPTZ,
            estimated_hours NUMERIC DEFAULT 0,
            actual_hours NUMERIC DEFAULT 0,
            completion_date TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            last_updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
          );

          -- Create hrm_subtasks table
          CREATE TABLE IF NOT EXISTS hrm_subtasks (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            task_id UUID NOT NULL,
            title TEXT NOT NULL,
            completed BOOLEAN DEFAULT FALSE,
            order_index INTEGER NOT NULL,
            created_by UUID,
            created_at TIMESTAMPTZ DEFAULT now(),
            last_updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
          );

          -- Create hrm_task_comments table
          CREATE TABLE IF NOT EXISTS hrm_task_comments (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            task_id UUID NOT NULL,
            created_by UUID NOT NULL,
            comment TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
          );

          -- Create hrm_task_attachments table
          CREATE TABLE IF NOT EXISTS hrm_task_attachments (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            task_id UUID NOT NULL,
            file_name TEXT NOT NULL,
            file_path TEXT NOT NULL,
            uploaded_by UUID NOT NULL,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
          );

          -- Create hrm_task_labels table
          CREATE TABLE IF NOT EXISTS hrm_task_labels (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            color TEXT NOT NULL,
            created_by UUID,
            created_at TIMESTAMPTZ DEFAULT now()
          );

          -- Create hrm_task_label_assignments table
          CREATE TABLE IF NOT EXISTS hrm_task_label_assignments (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            task_id UUID,
            label_id UUID,
            created_at TIMESTAMPTZ DEFAULT now()
          );

          -- Create hrm_task_checklists table
          CREATE TABLE IF NOT EXISTS hrm_task_checklists (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            task_id UUID,
            title TEXT NOT NULL,
            order_index INTEGER NOT NULL,
            created_by UUID,
            created_at TIMESTAMPTZ DEFAULT now(),
            last_updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
          );

          -- Create hrm_checklist_items table
          CREATE TABLE IF NOT EXISTS hrm_checklist_items (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            checklist_id UUID NOT NULL,
            content TEXT NOT NULL,
            completed BOOLEAN DEFAULT FALSE,
            order_index INTEGER NOT NULL,
            created_by UUID,
            created_at TIMESTAMPTZ DEFAULT now(),
            last_updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
          );

          -- Create hrm_task_notifications table
          CREATE TABLE IF NOT EXISTS hrm_task_notifications (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            task_id UUID,
            user_id UUID,
            notification_type task_notification_type NOT NULL,
            message TEXT NOT NULL,
            is_read BOOLEAN DEFAULT FALSE,
            email_sent BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMPTZ DEFAULT now(),
            updated_at TIMESTAMPTZ DEFAULT now()
          );

          -- Create hrm_task_history table
          CREATE TABLE IF NOT EXISTS hrm_task_history (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            task_id UUID NOT NULL,
            action TEXT NOT NULL,
            changed_by UUID NOT NULL,
            old_value JSONB,
            new_value JSONB,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
          );

          -- Create hrm_personal_reminders table
          CREATE TABLE IF NOT EXISTS hrm_personal_reminders (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            admin_id UUID NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            reminder_date DATE NOT NULL,
            reminder_time TIME NOT NULL,
            recurrence reminder_recurrence NOT NULL DEFAULT 'none',
            email_notify BOOLEAN NOT NULL DEFAULT TRUE,
            status BOOLEAN NOT NULL DEFAULT TRUE,
            created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
          );
        `, "Create HRM system tables");

        // 7. Create file management system tables
        await executeSql(`
          -- Create folders table
          CREATE TABLE IF NOT EXISTS folders (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            path TEXT NOT NULL,
            parent_path TEXT,
            created_by UUID,
            created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
          );

          -- Create file_shares table
          CREATE TABLE IF NOT EXISTS file_shares (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            file_path TEXT NOT NULL,
            folder_path TEXT,
            share_token TEXT NOT NULL,
            access_level TEXT NOT NULL,
            created_by UUID,
            expires_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
          );

          -- Create bulk_file_shares table
          CREATE TABLE IF NOT EXISTS bulk_file_shares (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            file_paths TEXT[] NOT NULL,
            share_token TEXT NOT NULL,
            access_level TEXT NOT NULL,
            created_by UUID,
            expires_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
          );
        `, "Create file management system tables");

        // 8. Create miscellaneous tables
        await executeSql(`
          -- Create page_views table
          CREATE TABLE IF NOT EXISTS page_views (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            page_path TEXT NOT NULL,
            session_id TEXT NOT NULL,
            visitor_ip TEXT,
            country TEXT,
            city TEXT,
            user_agent TEXT,
            referrer TEXT,
            view_type page_view_type DEFAULT 'page_view',
            created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
          );

          -- Create subscriptions table
          CREATE TABLE IF NOT EXISTS subscriptions (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            email TEXT NOT NULL,
            source TEXT,
            created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
            updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
          );

          -- Create contact_submissions table
          CREATE TABLE IF NOT EXISTS contact_submissions (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            full_name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT NOT NULL,
            message TEXT NOT NULL,
            phone TEXT,
            status TEXT DEFAULT 'pending',
            newsletter_subscription BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
          );

          -- Create business_forms table
          CREATE TABLE IF NOT EXISTS business_forms (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            company_name TEXT NOT NULL,
            email TEXT NOT NULL,
            inquiry_type TEXT NOT NULL,
            message TEXT NOT NULL,
            created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
          );

          -- Create business_form_submissions table
          CREATE TABLE IF NOT EXISTS business_form_submissions (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            form_type form_status NOT NULL,
            full_name TEXT NOT NULL,
            email TEXT NOT NULL,
            company_name TEXT,
            phone TEXT,
            message TEXT,
            inquiry_type TEXT,
            business_type TEXT,
            order_quantity TEXT,
            terms_accepted BOOLEAN DEFAULT FALSE,
            attachments JSONB,
            status form_status DEFAULT 'new',
            notes TEXT,
            admin_notes TEXT,
            assigned_to UUID,
            assigned_at TIMESTAMPTZ,
            completed_at TIMESTAMPTZ,
            created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
            updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
            last_updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
          );

          -- Create donations table
          CREATE TABLE IF NOT EXISTS donations (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            amount NUMERIC NOT NULL,
            donor_name TEXT,
            donor_email TEXT,
            currency TEXT DEFAULT 'USD',
            payment_method TEXT,
            status TEXT DEFAULT 'completed',
            stripe_session_id TEXT,
            created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
            updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
          );

          -- Create donation_settings table
          CREATE TABLE IF NOT EXISTS donation_settings (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            page_id UUID,
            title TEXT,
            description TEXT,
            icon TEXT,
            button_text TEXT,
            button_link TEXT,
            created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
          );

          -- Create reviews table
          CREATE TABLE IF NOT EXISTS reviews (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL,
            rating INTEGER NOT NULL,
            content TEXT,
            created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
          );

          -- Create chat_interactions table
          CREATE TABLE IF NOT EXISTS chat_interactions (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID,
            message TEXT NOT NULL,
            response TEXT NOT NULL,
            created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
            updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
          );

          -- Create certificates table
          CREATE TABLE IF NOT EXISTS certificates (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            certificate_number TEXT NOT NULL,
            issuing_authority TEXT NOT NULL,
            category TEXT NOT NULL,
            issue_date DATE NOT NULL,
            expiry_date DATE NOT NULL,
            image_url TEXT,
            qr_code_url TEXT,
            created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
            updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
          );

          -- Create referrals table
          CREATE TABLE IF NOT EXISTS referrals (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            referrer_id UUID,
            referral_code TEXT NOT NULL,
            referral_count INTEGER DEFAULT 0,
            created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
            updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
          );

          -- Create referral_tracking table
          CREATE TABLE IF NOT EXISTS referral_tracking (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            referral_id UUID,
            referred_email TEXT NOT NULL,
            status referral_status DEFAULT 'pending',
            utm_source TEXT,
            utm_medium TEXT,
            utm_campaign TEXT,
            created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
            updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
          );

          -- Create cycle_settings table
          CREATE TABLE IF NOT EXISTS cycle_settings (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL,
            cycle_length INTEGER NOT NULL DEFAULT 28,
            period_length INTEGER NOT NULL DEFAULT 5,
            last_period_date DATE,
            notifications_enabled BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
            updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
          );

          -- Create symptoms table
          CREATE TABLE IF NOT EXISTS symptoms (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            icon TEXT,
            category TEXT,
            created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
          );

          -- Create period_logs table
          CREATE TABLE IF NOT EXISTS period_logs (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL,
            date DATE NOT NULL,
            flow_intensity flow_intensity NOT NULL,
            notes TEXT,
            created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
            updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
          );

          -- Create symptom_logs table
          CREATE TABLE IF NOT EXISTS symptom_logs (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL,
            symptom_id UUID NOT NULL,
            date DATE NOT NULL,
            severity symptom_severity NOT NULL,
            notes TEXT,
            created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
            updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
          );

          -- Create reminders table
          CREATE TABLE IF NOT EXISTS reminders (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            reminder_type TEXT NOT NULL,
            time TIME NOT NULL,
            days_before INTEGER,
            is_enabled BOOLEAN DEFAULT TRUE,
            created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
            updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
          );
        `, "Create miscellaneous tables");

        // 9. Set up RLS policies
        await executeSql(`
          -- Enable Row-Level Security on tables
          ALTER TABLE IF EXISTS site_settings ENABLE ROW LEVEL SECURITY;
          ALTER TABLE IF EXISTS user_roles ENABLE ROW LEVEL SECURITY;
          ALTER TABLE IF EXISTS profiles ENABLE ROW LEVEL SECURITY;
          ALTER TABLE IF EXISTS pages ENABLE ROW LEVEL SECURITY;
          ALTER TABLE IF EXISTS content_blocks ENABLE ROW LEVEL SECURITY;
          ALTER TABLE IF EXISTS blog_posts ENABLE ROW LEVEL SECURITY;
          ALTER TABLE IF EXISTS blog_categories ENABLE ROW LEVEL SECURITY;
          ALTER TABLE IF EXISTS blog_comments ENABLE ROW LEVEL SECURITY;
          ALTER TABLE IF EXISTS products ENABLE ROW LEVEL SECURITY;
          ALTER TABLE IF EXISTS orders ENABLE ROW LEVEL SECURITY;
          ALTER TABLE IF EXISTS inventory ENABLE ROW LEVEL SECURITY;
          ALTER TABLE IF EXISTS hrm_tasks ENABLE ROW LEVEL SECURITY;
          ALTER TABLE IF EXISTS hrm_invoices ENABLE ROW LEVEL SECURITY;
          ALTER TABLE IF EXISTS files ENABLE ROW LEVEL SECURITY;
          ALTER TABLE IF EXISTS folders ENABLE ROW LEVEL SECURITY;
          
          -- Create RLS policies for site_settings
          DROP POLICY IF EXISTS "Allow anonymous read access to site_settings" ON site_settings;
          CREATE POLICY "Allow anonymous read access to site_settings"
          ON site_settings
          FOR SELECT
          TO anon
          USING (true);

          DROP POLICY IF EXISTS "Allow authenticated read access to site_settings" ON site_settings;
          CREATE POLICY "Allow authenticated read access to site_settings"
          ON site_settings
          FOR SELECT
          TO authenticated
          USING (true);

          DROP POLICY IF EXISTS "Allow admin full access to site_settings" ON site_settings;
          CREATE POLICY "Allow admin full access to site_settings"
          ON site_settings
          FOR ALL
          TO authenticated
          USING (
              EXISTS (
                  SELECT 1 FROM user_roles
                  WHERE user_id = auth.uid() AND role = 'admin'
              )
          );
          
          -- Create RLS policies for user_roles
          DROP POLICY IF EXISTS "Allow users to view their own roles" ON user_roles;
          CREATE POLICY "Allow users to view their own roles"
            ON user_roles
            FOR SELECT
            TO authenticated
            USING (user_id = auth.uid());
          
          DROP POLICY IF EXISTS "Allow admins full access to user roles" ON user_roles;
          CREATE POLICY "Allow admins full access to user roles"
            ON user_roles
            FOR ALL
            TO authenticated
            USING (
              EXISTS (
                SELECT 1 FROM user_roles
                WHERE user_id = auth.uid() AND role = 'admin'
              )
            );

          -- Create RLS policies for profiles
          DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
          CREATE POLICY "Users can view their own profile"
            ON profiles
            FOR SELECT
            TO authenticated
            USING (id = auth.uid());

          DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
          CREATE POLICY "Users can update their own profile"
            ON profiles
            FOR UPDATE
            TO authenticated
            USING (id = auth.uid());

          DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
          CREATE POLICY "Admins can view all profiles"
            ON profiles
            FOR SELECT
            TO authenticated
            USING (
              EXISTS (
                SELECT 1 FROM user_roles
                WHERE user_id = auth.uid() AND role = 'admin'
              )
            );

          DROP POLICY IF EXISTS "Admins can update all profiles" ON profiles;
          CREATE POLICY "Admins can update all profiles"
            ON profiles
            FOR UPDATE
            TO authenticated
            USING (
              EXISTS (
                SELECT 1 FROM user_roles
                WHERE user_id = auth.uid() AND role = 'admin'
              )
            );

          -- Create trigger function to handle new users
          CREATE OR REPLACE FUNCTION public.handle_new_user()
          RETURNS trigger
          LANGUAGE plpgsql
          SECURITY DEFINER
          AS $function$
          BEGIN
            INSERT INTO public.profiles (id, email, full_name)
            VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'full_name', ''));
            
            INSERT INTO public.user_roles (user_id, role)
            VALUES (new.id, 'client');
            
            RETURN new;
          END;
          $function$;

          -- Create trigger to automatically create a profile and assign client role when a new user signs up
          DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
          CREATE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

          -- Insert default admin user role for the first user if user_roles is empty
          INSERT INTO user_roles (user_id, role)
          SELECT id, 'admin'::user_role
          FROM auth.users
          ORDER BY created_at
          LIMIT 1
          ON CONFLICT (user_id, role) DO NOTHING;

          -- Insert default values into site_settings if empty
          INSERT INTO site_settings (
            id, 
            site_title, 
            default_language, 
            enable_registration, 
            enable_search_indexing, 
            custom_scripts, 
            homepage_slug, 
            maintenance_mode, 
            contact_email, 
            enable_cookie_consent, 
            enable_https_redirect, 
            max_upload_size, 
            enable_user_avatars
          )
          SELECT 
            gen_random_uuid(), 
            'Elloria', 
            'en'::supported_language, 
            true, 
            true, 
            '[]'::jsonb, 
            'index', 
            false, 
            'admin@elloria.ca', 
            false, 
            false, 
            10, 
            false
          WHERE NOT EXISTS (SELECT 1 FROM site_settings);
        `, "Set up RLS policies and default data");

        // Return success response
        return new Response(JSON.stringify({ 
          success: true, 
          message: "Database setup completed successfully" 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        });
      } catch (err) {
        console.error("SQL Execution Error:", err);
        return new Response(JSON.stringify({ 
          success: false, 
          error: `Database setup failed: ${err.message}` 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        });
      }
    } catch (err) {
      console.error("Database connection error:", err);
      return new Response(JSON.stringify({ 
        success: false, 
        error: `Database connection error: ${err.message}` 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    } finally {
      // Ensure the client connection is closed
      try {
        await client.end();
        console.log("Database connection closed");
      } catch (err) {
        console.error("Error closing database connection:", err);
      }
    }
  } catch (err) {
    console.error("Request processing error:", err);
    return new Response(JSON.stringify({ 
      success: false, 
      error: `Failed to process request: ${err.message}` 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
