
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
      
      // Execute the database setup
      const { action } = requestData;
      
      if (action === 'run-migration') {
        console.log("Starting database migration...");
        
        // Begin transaction
        await client.queryArray("BEGIN");
        
        try {
          // Create ENUMs first
          console.log("Creating ENUM types...");
          await createEnumTypes(client);
          
          // Create tables in the correct order (respecting dependencies)
          console.log("Creating database tables...");
          await createCoreTables(client);
          await createHRMTables(client);
          await createBlogTables(client);
          await createEcommerceTables(client);
          await createFileTables(client);
          await createHealthTables(client);
          await createMiscTables(client);
          
          // Set up RLS policies
          console.log("Setting up Row Level Security (RLS) policies...");
          await setupRLSPolicies(client);
          
          // Insert initial data if needed
          console.log("Inserting initial data...");
          await insertInitialData(client);
          
          // Commit the transaction
          await client.queryArray("COMMIT");
          console.log("Database migration completed successfully!");
          
          return new Response(JSON.stringify({ 
            success: true, 
            message: "Database setup completed successfully" 
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 200,
          });
        } catch (err) {
          // Rollback the transaction on error
          await client.queryArray("ROLLBACK");
          console.error("Migration error, rolling back:", err);
          
          return new Response(JSON.stringify({ 
            success: false, 
            error: `Database migration failed: ${err.message}` 
          }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          });
        }
      } else {
        return new Response(JSON.stringify({ 
          success: false, 
          error: `Unknown action: ${action}` 
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        });
      }
    } catch (err) {
      console.error("SQL Execution Error:", err);
      return new Response(JSON.stringify({ 
        success: false, 
        error: `Database setup failed: ${err.message}` 
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

// Create ENUM types
async function createEnumTypes(client: Client) {
  // Common ENUM types used across tables
  const enumsSQL = `
    -- Create ENUMs if they don't exist
    DO $$ 
    BEGIN
      -- User Roles
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('admin', 'editor', 'client');
      END IF;
      
      -- Post Status
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'post_status') THEN
        CREATE TYPE public.post_status AS ENUM ('draft', 'published', 'archived');
      END IF;
      
      -- Component Status
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'component_status') THEN
        CREATE TYPE public.component_status AS ENUM ('draft', 'published', 'archived');
      END IF;
      
      -- Form Status
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'form_status') THEN
        CREATE TYPE public.form_status AS ENUM ('new', 'in_progress', 'completed', 'cancelled');
      END IF;
      
      -- Task Status
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_status') THEN
        CREATE TYPE public.task_status AS ENUM ('todo', 'in_progress', 'review', 'done', 'cancelled');
      END IF;
      
      -- Task Priority
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_priority') THEN
        CREATE TYPE public.task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
      END IF;
      
      -- Task Category
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_category') THEN
        CREATE TYPE public.task_category AS ENUM ('development', 'design', 'marketing', 'sales', 'support', 'other');
      END IF;
      
      -- Task Notification Type
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_notification_type') THEN
        CREATE TYPE public.task_notification_type AS ENUM ('assigned', 'comment', 'due_soon', 'status_change');
      END IF;
      
      -- Invoice Status
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'invoice_status') THEN
        CREATE TYPE public.invoice_status AS ENUM ('draft', 'pending', 'paid', 'overdue', 'cancelled');
      END IF;
      
      -- Payment Status
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE public.payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
      END IF;
      
      -- Promo Code Type
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'promo_code_type') THEN
        CREATE TYPE public.promo_code_type AS ENUM ('percentage', 'fixed_amount');
      END IF;
      
      -- Expense Status
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'expense_status') THEN
        CREATE TYPE public.expense_status AS ENUM ('pending', 'approved', 'rejected', 'paid');
      END IF;
      
      -- Expense Payment Method
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'expense_payment_method') THEN
        CREATE TYPE public.expense_payment_method AS ENUM ('cash', 'credit_card', 'bank_transfer', 'other');
      END IF;
      
      -- Expense Category
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'expense_category') THEN
        CREATE TYPE public.expense_category AS ENUM ('office', 'travel', 'marketing', 'utilities', 'salaries', 'other');
      END IF;
      
      -- Page View Type
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'page_view_type') THEN
        CREATE TYPE public.page_view_type AS ENUM ('page_view', 'product_view', 'blog_view');
      END IF;
      
      -- Reminder Recurrence
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'reminder_recurrence') THEN
        CREATE TYPE public.reminder_recurrence AS ENUM ('none', 'daily', 'weekly', 'monthly', 'yearly');
      END IF;
      
      -- Referral Status
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'referral_status') THEN
        CREATE TYPE public.referral_status AS ENUM ('pending', 'completed', 'expired');
      END IF;
      
      -- Flow Intensity
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'flow_intensity') THEN
        CREATE TYPE public.flow_intensity AS ENUM ('light', 'medium', 'heavy');
      END IF;
      
      -- Symptom Severity
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'symptom_severity') THEN
        CREATE TYPE public.symptom_severity AS ENUM ('mild', 'moderate', 'severe');
      END IF;
      
      -- Supported Language
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'supported_language') THEN
        CREATE TYPE public.supported_language AS ENUM ('en', 'fr', 'uk');
      END IF;
      
      -- Supported Currency
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'supported_currency') THEN
        CREATE TYPE public.supported_currency AS ENUM ('USD', 'EUR', 'GBP', 'CAD');
      END IF;
      
      -- Content Block Type
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_block_type') THEN
        CREATE TYPE public.content_block_type AS ENUM ('hero', 'features', 'testimonials', 'cta', 'blog', 'product');
      END IF;
    END $$;
  `;
  
  await client.queryArray(enumsSQL);
  console.log("ENUM types created successfully");
}

// Create core tables (user-related, settings)
async function createCoreTables(client: Client) {
  const coreTablesSQL = `
    -- Create site_settings table
    CREATE TABLE IF NOT EXISTS public.site_settings (
      id TEXT PRIMARY KEY DEFAULT 'default',
      site_title TEXT,
      meta_description TEXT,
      meta_keywords TEXT,
      logo_url TEXT,
      favicon_url TEXT,
      enable_registration BOOLEAN,
      enable_user_avatars BOOLEAN,
      enable_cookie_consent BOOLEAN,
      enable_https_redirect BOOLEAN,
      enable_search_indexing BOOLEAN,
      maintenance_mode BOOLEAN,
      google_analytics_id TEXT,
      custom_scripts JSONB,
      contact_email TEXT,
      homepage_slug TEXT,
      max_upload_size BIGINT,
      default_language supported_language DEFAULT 'en',
      created_at TIMESTAMPTZ,
      updated_at TIMESTAMPTZ
    );
    
    -- Create user_roles table
    CREATE TABLE IF NOT EXISTS public.user_roles (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL,
      role user_role NOT NULL DEFAULT 'client',
      created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
    );
    
    -- Create profiles table
    CREATE TABLE IF NOT EXISTS public.profiles (
      id UUID PRIMARY KEY REFERENCES auth.users,
      email TEXT,
      full_name TEXT,
      phone_number TEXT,
      address TEXT,
      country TEXT,
      region TEXT,
      language TEXT DEFAULT 'en',
      currency TEXT DEFAULT 'USD',
      marketing_emails BOOLEAN DEFAULT FALSE,
      email_notifications BOOLEAN DEFAULT FALSE,
      selected_delivery_method UUID,
      completed_initial_setup BOOLEAN DEFAULT FALSE,
      updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
    );
    
    -- Create SEO settings
    CREATE TABLE IF NOT EXISTS public.seo_settings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      default_title_template TEXT,
      default_meta_description TEXT,
      default_meta_keywords TEXT,
      robots_txt TEXT,
      google_site_verification TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
    );
  `;
  
  await client.queryArray(coreTablesSQL);
  console.log("Core tables created successfully");
}

// Create HRM (Human Resource Management) tables
async function createHRMTables(client: Client) {
  const hrmTablesSQL = `
    -- Create hrm_tasks table
    CREATE TABLE IF NOT EXISTS public.hrm_tasks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      description TEXT,
      status task_status NOT NULL DEFAULT 'todo',
      priority task_priority NOT NULL DEFAULT 'medium',
      category task_category NOT NULL DEFAULT 'other',
      created_by UUID NOT NULL,
      assigned_to UUID NOT NULL,
      start_date TIMESTAMPTZ,
      due_date TIMESTAMPTZ,
      completion_date TIMESTAMPTZ,
      estimated_hours NUMERIC DEFAULT 0,
      actual_hours NUMERIC DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      last_updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
    
    -- Create hrm_task_checklists table
    CREATE TABLE IF NOT EXISTS public.hrm_task_checklists (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      task_id UUID,
      title TEXT NOT NULL,
      order_index INTEGER NOT NULL,
      created_by UUID,
      created_at TIMESTAMPTZ DEFAULT now(),
      last_updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
    
    -- Create hrm_checklist_items table
    CREATE TABLE IF NOT EXISTS public.hrm_checklist_items (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      checklist_id UUID NOT NULL,
      content TEXT NOT NULL,
      completed BOOLEAN DEFAULT FALSE,
      order_index INTEGER NOT NULL,
      created_by UUID,
      created_at TIMESTAMPTZ DEFAULT now(),
      last_updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
    
    -- Create hrm_subtasks table
    CREATE TABLE IF NOT EXISTS public.hrm_subtasks (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      task_id UUID NOT NULL,
      title TEXT NOT NULL,
      completed BOOLEAN DEFAULT FALSE,
      order_index INTEGER NOT NULL,
      created_by UUID,
      created_at TIMESTAMPTZ DEFAULT now(),
      last_updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
    
    -- Create hrm_task_labels table
    CREATE TABLE IF NOT EXISTS public.hrm_task_labels (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      color TEXT NOT NULL,
      created_by UUID,
      created_at TIMESTAMPTZ DEFAULT now()
    );
    
    -- Create hrm_task_label_assignments table
    CREATE TABLE IF NOT EXISTS public.hrm_task_label_assignments (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      task_id UUID,
      label_id UUID,
      created_at TIMESTAMPTZ DEFAULT now()
    );
    
    -- Create hrm_task_comments table
    CREATE TABLE IF NOT EXISTS public.hrm_task_comments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      task_id UUID NOT NULL,
      created_by UUID NOT NULL,
      comment TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
    
    -- Create hrm_task_history table
    CREATE TABLE IF NOT EXISTS public.hrm_task_history (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      task_id UUID NOT NULL,
      action TEXT NOT NULL,
      changed_by UUID NOT NULL,
      old_value JSONB,
      new_value JSONB,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
    
    -- Create hrm_task_notifications table
    CREATE TABLE IF NOT EXISTS public.hrm_task_notifications (
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
    
    -- Create hrm_task_attachments table
    CREATE TABLE IF NOT EXISTS public.hrm_task_attachments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      task_id UUID NOT NULL,
      file_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      uploaded_by UUID NOT NULL,
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    );
    
    -- Create hrm_customers table
    CREATE TABLE IF NOT EXISTS public.hrm_customers (
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
    
    -- Create hrm_customer_payment_methods table
    CREATE TABLE IF NOT EXISTS public.hrm_customer_payment_methods (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      customer_id UUID,
      type TEXT NOT NULL,
      details JSONB NOT NULL,
      is_default BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
    
    -- Create hrm_invoices table
    CREATE TABLE IF NOT EXISTS public.hrm_invoices (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      invoice_number TEXT NOT NULL,
      customer_id UUID,
      employee_id UUID,
      status invoice_status NOT NULL DEFAULT 'pending',
      due_date DATE NOT NULL,
      subtotal_amount NUMERIC NOT NULL DEFAULT 0,
      tax_amount NUMERIC NOT NULL DEFAULT 0,
      total_amount NUMERIC NOT NULL DEFAULT 0,
      total_amount_with_tax NUMERIC DEFAULT 0,
      shipping_amount NUMERIC DEFAULT 0,
      discount_amount NUMERIC DEFAULT 0,
      discount_type TEXT,
      notes TEXT,
      payment_terms TEXT,
      payment_instructions TEXT,
      footer_text TEXT,
      reference_number TEXT,
      late_fee_percentage NUMERIC DEFAULT 0,
      company_info JSONB DEFAULT '{}'::jsonb,
      tax_details JSONB DEFAULT '{}'::jsonb,
      template_version TEXT DEFAULT '1.0',
      pdf_url TEXT,
      last_sent_at TIMESTAMPTZ,
      last_sent_to TEXT,
      currency TEXT NOT NULL DEFAULT 'CAD',
      created_by UUID,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
    
    -- Create hrm_invoice_items table
    CREATE TABLE IF NOT EXISTS public.hrm_invoice_items (
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
    CREATE TABLE IF NOT EXISTS public.hrm_invoice_payments (
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
    
    -- Create hrm_invoice_emails table
    CREATE TABLE IF NOT EXISTS public.hrm_invoice_emails (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      invoice_id UUID,
      sent_to TEXT NOT NULL,
      sent_by UUID,
      sent_at TIMESTAMPTZ DEFAULT now(),
      status TEXT NOT NULL DEFAULT 'sent',
      error_message TEXT,
      email_type TEXT NOT NULL DEFAULT 'invoice',
      template_version TEXT
    );
    
    -- Create hrm_invoice_settings table
    CREATE TABLE IF NOT EXISTS public.hrm_invoice_settings (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      company_id UUID,
      company_info JSONB DEFAULT '{}'::jsonb,
      company_email TEXT,
      company_phone TEXT,
      logo_url TEXT,
      invoice_template TEXT DEFAULT 'standard',
      default_notes TEXT,
      payment_instructions TEXT,
      footer_text TEXT,
      default_due_days INTEGER DEFAULT 30,
      late_fee_percentage NUMERIC DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
    
    -- Create hrm_recurring_invoices table
    CREATE TABLE IF NOT EXISTS public.hrm_recurring_invoices (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      customer_id UUID,
      frequency TEXT NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE,
      template_data JSONB NOT NULL,
      is_active BOOLEAN DEFAULT TRUE,
      next_generation TIMESTAMPTZ,
      last_generated TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
    
    -- Create hrm_estimates table
    CREATE TABLE IF NOT EXISTS public.hrm_estimates (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      estimate_number TEXT NOT NULL,
      customer_id UUID,
      valid_until DATE,
      subtotal_amount NUMERIC NOT NULL DEFAULT 0,
      tax_amount NUMERIC NOT NULL DEFAULT 0,
      total_amount NUMERIC NOT NULL DEFAULT 0,
      terms TEXT,
      notes TEXT,
      status TEXT NOT NULL DEFAULT 'draft',
      created_by UUID,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
    
    -- Create hrm_estimate_items table
    CREATE TABLE IF NOT EXISTS public.hrm_estimate_items (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      estimate_id UUID,
      description TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 1,
      unit_price NUMERIC NOT NULL,
      tax_percentage NUMERIC DEFAULT 0,
      total_price NUMERIC NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    );
    
    -- Create hrm_credit_notes table
    CREATE TABLE IF NOT EXISTS public.hrm_credit_notes (
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
    
    -- Create hrm_expense_categories table
    CREATE TABLE IF NOT EXISTS public.hrm_expense_categories (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name TEXT NOT NULL,
      description TEXT,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
    
    -- Create hrm_personal_reminders table
    CREATE TABLE IF NOT EXISTS public.hrm_personal_reminders (
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
  `;
  
  await client.queryArray(hrmTablesSQL);
  console.log("HRM tables created successfully");
}

// Create blog tables
async function createBlogTables(client: Client) {
  const blogTablesSQL = `
    -- Create blog_categories table
    CREATE TABLE IF NOT EXISTS public.blog_categories (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      parent_id UUID,
      created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
      updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
    );
    
    -- Create blog_posts table
    CREATE TABLE IF NOT EXISTS public.blog_posts (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title TEXT NOT NULL,
      slug TEXT,
      content JSONB NOT NULL DEFAULT '{}'::jsonb,
      excerpt TEXT,
      featured_image TEXT,
      status post_status NOT NULL DEFAULT 'draft',
      author_id UUID,
      published_at TIMESTAMPTZ,
      view_count INTEGER DEFAULT 0,
      meta_title TEXT,
      meta_description TEXT,
      keywords TEXT[],
      created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
      updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
    );
    
    -- Create blog_posts_categories table
    CREATE TABLE IF NOT EXISTS public.blog_posts_categories (
      post_id UUID NOT NULL,
      category_id UUID NOT NULL,
      PRIMARY KEY (post_id, category_id)
    );
    
    -- Create blog_comments table
    CREATE TABLE IF NOT EXISTS public.blog_comments (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      post_id UUID,
      user_id UUID,
      content TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
      updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
    );
    
    -- Create blog_settings table
    CREATE TABLE IF NOT EXISTS public.blog_settings (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      hero_title TEXT NOT NULL DEFAULT 'Stay Inspired with Elloria: News, Insights, and Stories',
      hero_subtitle TEXT NOT NULL DEFAULT 'Explore the latest updates on feminine care, sustainability, and empowering women',
      hero_background_image TEXT,
      instagram_profile_url TEXT DEFAULT 'https://instagram.com',
      created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
      updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
    );
  `;
  
  await client.queryArray(blogTablesSQL);
  console.log("Blog tables created successfully");
}

// Create ecommerce tables (products, orders, inventory)
async function createEcommerceTables(client: Client) {
  const ecommerceTablesSQL = `
    -- Create products table
    CREATE TABLE IF NOT EXISTS public.products (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      description TEXT NOT NULL,
      price NUMERIC NOT NULL,
      image TEXT NOT NULL,
      features TEXT[] NOT NULL DEFAULT '{}',
      specifications JSONB NOT NULL DEFAULT '{}',
      why_choose_features JSONB DEFAULT '[]',
      media JSONB DEFAULT '[]',
      created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
      updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
    );
    
    -- Create inventory table
    CREATE TABLE IF NOT EXISTS public.inventory (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      product_id UUID NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0,
      sku TEXT,
      location TEXT,
      unit_cost NUMERIC DEFAULT 0,
      low_stock_threshold INTEGER DEFAULT 100,
      optimal_stock INTEGER DEFAULT 200,
      reorder_point INTEGER DEFAULT 50,
      last_counted_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
      updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
    );
    
    -- Create inventory_logs table
    CREATE TABLE IF NOT EXISTS public.inventory_logs (
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
      created_by UUID,
      created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
      unit_cost NUMERIC,
      total_cost NUMERIC,
      location TEXT,
      retailer_name TEXT
    );
    
    -- Create orders table
    CREATE TABLE IF NOT EXISTS public.orders (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      order_number TEXT NOT NULL,
      user_id UUID,
      profile_id UUID,
      status TEXT NOT NULL,
      items JSONB NOT NULL,
      shipping_address JSONB NOT NULL,
      billing_address JSONB NOT NULL,
      total_amount NUMERIC NOT NULL,
      shipping_cost NUMERIC DEFAULT 0,
      gst NUMERIC DEFAULT 0,
      applied_promo_code JSONB,
      payment_method TEXT,
      stripe_session_id TEXT,
      created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
    );
    
    -- Create promo_codes table
    CREATE TABLE IF NOT EXISTS public.promo_codes (
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
    CREATE TABLE IF NOT EXISTS public.delivery_methods (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      description TEXT,
      base_price NUMERIC DEFAULT 0,
      estimated_days TEXT,
      regions TEXT[] DEFAULT '{}',
      is_active BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
      updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
    );
    
    -- Create payment_methods table
    CREATE TABLE IF NOT EXISTS public.payment_methods (
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
    CREATE TABLE IF NOT EXISTS public.shop_settings (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      default_currency supported_currency NOT NULL DEFAULT 'USD',
      tax_rate NUMERIC DEFAULT 0,
      min_order_amount NUMERIC DEFAULT 0,
      max_order_amount NUMERIC,
      enable_guest_checkout BOOLEAN DEFAULT TRUE,
      shipping_countries TEXT[] DEFAULT ARRAY['US', 'CA'],
      shipping_methods JSONB DEFAULT '{"US": [], "CA": []}'::jsonb,
      payment_methods JSONB DEFAULT '{"stripe": false, "cash_on_delivery": true}'::jsonb,
      tax_settings JSONB DEFAULT '{"CA": {"provinces": {"Quebec": {"gst": 5, "pst": 9.975}, "Alberta": {"gst": 5, "pst": 0}, "Ontario": {"hst": 13}, "Manitoba": {"gst": 5, "pst": 7}, "Nova Scotia": {"hst": 15}, "Saskatchewan": {"gst": 5, "pst": 6}, "New Brunswick": {"hst": 15}, "British Columbia": {"gst": 5, "pst": 7}, "Prince Edward Island": {"hst": 15}, "Newfoundland and Labrador": {"hst": 15}}}, "US": {"states": {}}}'::jsonb,
      stripe_settings JSONB DEFAULT '{"secret_key": "", "publishable_key": ""}'::jsonb,
      created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
    );
    
    -- Create shop_company_expenses table
    CREATE TABLE IF NOT EXISTS public.shop_company_expenses (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      title TEXT NOT NULL,
      amount NUMERIC NOT NULL,
      date DATE NOT NULL,
      vendor_name TEXT NOT NULL,
      category expense_category NOT NULL,
      payment_method expense_payment_method NOT NULL,
      status expense_status NOT NULL DEFAULT 'pending',
      notes TEXT,
      receipt_path TEXT,
      created_by UUID,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );
    
    -- Create reviews table
    CREATE TABLE IF NOT EXISTS public.reviews (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL,
      rating INTEGER NOT NULL,
      content TEXT,
      created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
    );
    
    -- Create donations table
    CREATE TABLE IF NOT EXISTS public.donations (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      amount NUMERIC NOT NULL,
      donor_name TEXT,
      donor_email TEXT,
      currency TEXT DEFAULT 'USD',
      status TEXT DEFAULT 'completed',
      payment_method TEXT,
      stripe_session_id TEXT,
      created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
      updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
    );
    
    -- Create donation_settings table
    CREATE TABLE IF NOT EXISTS public.donation_settings (
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
  `;
  
  await client.queryArray(ecommerceTablesSQL);
  console.log("Ecommerce tables created successfully");
}

// Create file management tables
async function createFileTables(client: Client) {
  const fileTablesSQL = `
    -- Create folders table
    CREATE TABLE IF NOT EXISTS public.folders (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      path TEXT NOT NULL,
      parent_path TEXT,
      created_by UUID,
      created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
    );
    
    -- Create file_shares table
    CREATE TABLE IF NOT EXISTS public.file_shares (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      file_path TEXT NOT NULL,
      folder_path TEXT,
      share_token TEXT NOT NULL,
      access_level TEXT NOT NULL,
      expires_at TIMESTAMPTZ,
      created_by UUID,
      created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
    );
    
    -- Create bulk_file_shares table
    CREATE TABLE IF NOT EXISTS public.bulk_file_shares (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      file_paths TEXT[] NOT NULL,
      share_token TEXT NOT NULL,
      access_level TEXT NOT NULL,
      expires_at TIMESTAMPTZ,
      created_by UUID,
      created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
    );
    
    -- Create certificates table
    CREATE TABLE IF NOT EXISTS public.certificates (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      certificate_number TEXT NOT NULL,
      issuing_authority TEXT NOT NULL,
      issue_date DATE NOT NULL,
      expiry_date DATE NOT NULL,
      category TEXT NOT NULL,
      image_url TEXT,
      qr_code_url TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
    );
  `;
  
  await client.queryArray(fileTablesSQL);
  console.log("File management tables created successfully");
}

// Create health tracking tables
async function createHealthTables(client: Client) {
  const healthTablesSQL = `
    -- Create cycle_settings table
    CREATE TABLE IF NOT EXISTS public.cycle_settings (
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
    CREATE TABLE IF NOT EXISTS public.symptoms (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      icon TEXT,
      category TEXT,
      created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
    );
    
    -- Create period_logs table
    CREATE TABLE IF NOT EXISTS public.period_logs (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL,
      date DATE NOT NULL,
      flow_intensity flow_intensity NOT NULL,
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
      updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
    );
    
    -- Create symptom_logs table
    CREATE TABLE IF NOT EXISTS public.symptom_logs (
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
    CREATE TABLE IF NOT EXISTS public.reminders (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      reminder_type TEXT NOT NULL,
      days_before INTEGER,
      time TIME NOT NULL,
      is_enabled BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
      updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
    );
  `;
  
  await client.queryArray(healthTablesSQL);
  console.log("Health tracking tables created successfully");
}

// Create miscellaneous tables
async function createMiscTables(client: Client) {
  const miscTablesSQL = `
    -- Create pages table
    CREATE TABLE IF NOT EXISTS public.pages (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      title TEXT NOT NULL,
      slug TEXT NOT NULL,
      content JSONB NOT NULL DEFAULT '[]'::jsonb,
      content_blocks JSONB[] DEFAULT '{}',
      is_published BOOLEAN DEFAULT FALSE,
      show_in_header BOOLEAN DEFAULT FALSE,
      show_in_footer BOOLEAN DEFAULT FALSE,
      parent_id UUID,
      menu_order INTEGER DEFAULT 0,
      menu_type TEXT DEFAULT 'main',
      page_template TEXT DEFAULT 'default',
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
      allow_indexing BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
      updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
    );
    
    -- Create content_blocks table
    CREATE TABLE IF NOT EXISTS public.content_blocks (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      page_id UUID,
      type content_block_type NOT NULL,
      content JSONB NOT NULL DEFAULT '{}'::jsonb,
      order_index INTEGER NOT NULL,
      created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
      updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
    );
    
    -- Create component_definitions table
    CREATE TABLE IF NOT EXISTS public.component_definitions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT,
      icon TEXT,
      default_props JSONB DEFAULT '{}'::jsonb,
      status component_status DEFAULT 'draft',
      created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
      updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
    );
    
    -- Create page_views table
    CREATE TABLE IF NOT EXISTS public.page_views (
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
    CREATE TABLE IF NOT EXISTS public.subscriptions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      email TEXT NOT NULL,
      source TEXT,
      created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
      updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
    );
    
    -- Create chat_interactions table
    CREATE TABLE IF NOT EXISTS public.chat_interactions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID,
      message TEXT NOT NULL,
      response TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
      updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
    );
    
    -- Create referrals table
    CREATE TABLE IF NOT EXISTS public.referrals (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      referrer_id UUID,
      referral_code TEXT NOT NULL,
      referral_count INTEGER DEFAULT 0,
      created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
      updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
    );
    
    -- Create referral_tracking table
    CREATE TABLE IF NOT EXISTS public.referral_tracking (
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
    
    -- Create business_forms table
    CREATE TABLE IF NOT EXISTS public.business_forms (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      company_name TEXT NOT NULL,
      email TEXT NOT NULL,
      inquiry_type TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
    );
    
    -- Create business_form_submissions table
    CREATE TABLE IF NOT EXISTS public.business_form_submissions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      form_type form_status NOT NULL,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      company_name TEXT,
      business_type TEXT,
      message TEXT,
      inquiry_type TEXT,
      order_quantity TEXT,
      terms_accepted BOOLEAN DEFAULT FALSE,
      attachments JSONB,
      status form_status DEFAULT 'new',
      assigned_to UUID,
      assigned_at TIMESTAMPTZ,
      completed_at TIMESTAMPTZ,
      notes TEXT,
      admin_notes TEXT,
      created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
      updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
      last_updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
    );
    
    -- Create contact_submissions table
    CREATE TABLE IF NOT EXISTS public.contact_submissions (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      newsletter_subscription BOOLEAN DEFAULT FALSE,
      status TEXT DEFAULT 'pending',
      created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
    );
  `;
  
  await client.queryArray(miscTablesSQL);
  console.log("Miscellaneous tables created successfully");
}

// Set up RLS policies
async function setupRLSPolicies(client: Client) {
  const rlsSQL = `
    -- Enable RLS on tables that need it
    ALTER TABLE IF EXISTS public.user_roles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS public.profiles ENABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS public.hrm_tasks ENABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS public.hrm_personal_reminders ENABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS public.cycle_settings ENABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS public.period_logs ENABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS public.symptom_logs ENABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS public.reminders ENABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS public.chat_interactions ENABLE ROW LEVEL SECURITY;
    ALTER TABLE IF EXISTS public.orders ENABLE ROW LEVEL SECURITY;
    
    -- Create RLS policies
    -- For profiles: users can view and update only their own profiles
    CREATE POLICY IF NOT EXISTS "Users can view their own profile" 
      ON public.profiles FOR SELECT 
      USING (auth.uid() = id);
      
    CREATE POLICY IF NOT EXISTS "Users can update their own profile" 
      ON public.profiles FOR UPDATE 
      USING (auth.uid() = id);
      
    -- For hrm_personal_reminders: admins can only manage their own reminders
    CREATE POLICY IF NOT EXISTS "Admins can manage their own reminders" 
      ON public.hrm_personal_reminders 
      USING (auth.uid() = admin_id);
      
    -- For cycle_settings: users can only manage their own cycle settings
    CREATE POLICY IF NOT EXISTS "Users can manage their own cycle settings" 
      ON public.cycle_settings 
      USING (auth.uid() = user_id);
      
    -- For period_logs: users can only manage their own period logs
    CREATE POLICY IF NOT EXISTS "Users can manage their own period logs" 
      ON public.period_logs 
      USING (auth.uid() = user_id);
      
    -- For symptom_logs: users can only manage their own symptom logs
    CREATE POLICY IF NOT EXISTS "Users can manage their own symptom logs" 
      ON public.symptom_logs 
      USING (auth.uid() = user_id);
      
    -- For reminders: users can only manage their own reminders
    CREATE POLICY IF NOT EXISTS "Users can manage their own reminders" 
      ON public.reminders 
      USING (auth.uid() = user_id);
      
    -- For chat_interactions: users can only view their own chat history
    CREATE POLICY IF NOT EXISTS "Users can view their own chat history" 
      ON public.chat_interactions 
      USING (auth.uid() = user_id OR user_id IS NULL);
      
    -- For orders: users can only view their own orders
    CREATE POLICY IF NOT EXISTS "Users can view their own orders" 
      ON public.orders FOR SELECT 
      USING (auth.uid() = user_id OR user_id IS NULL);
  `;
  
  await client.queryArray(rlsSQL);
  console.log("RLS policies set up successfully");
}

// Insert initial data
async function insertInitialData(client: Client) {
  const initialDataSQL = `
    -- Insert default site settings if not exists
    INSERT INTO public.site_settings (id, site_title, meta_description, default_language, enable_registration, enable_search_indexing, created_at, updated_at)
    VALUES ('default', 'Elloria', 'Premium feminine care products', 'en', true, true, NOW(), NOW())
    ON CONFLICT (id) DO NOTHING;
    
    -- Insert default shop settings if not exists
    INSERT INTO public.shop_settings (id, default_currency, enable_guest_checkout, created_at, updated_at)
    VALUES (uuid_generate_v4(), 'USD', true, NOW(), NOW())
    ON CONFLICT DO NOTHING;
    
    -- Insert default blog settings if not exists
    INSERT INTO public.blog_settings (id, created_at, updated_at)
    VALUES (uuid_generate_v4(), NOW(), NOW())
    ON CONFLICT DO NOTHING;
    
    -- Insert default SEO settings if not exists
    INSERT INTO public.seo_settings (id, default_title_template, default_meta_description, created_at, updated_at)
    VALUES (gen_random_uuid(), '{page} | Elloria', 'Premium feminine care products by Elloria', NOW(), NOW())
    ON CONFLICT DO NOTHING;
  `;
  
  await client.queryArray(initialDataSQL);
  console.log("Initial data inserted successfully");
}

