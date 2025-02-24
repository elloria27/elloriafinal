
-- Elloria Database Schema
-- Generated on: 2024

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE flow_intensity AS ENUM ('light', 'medium', 'heavy');
CREATE TYPE task_category AS ENUM ('project', 'meeting', 'deadline', 'other');
CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'review', 'done');
CREATE TYPE notification_type AS ENUM ('assignment', 'mention', 'due_date', 'status_change');
CREATE TYPE component_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE content_block_type AS ENUM (
    'hero',
    'features',
    'testimonials',
    'product_gallery',
    'cta',
    'about',
    'contact',
    'newsletter',
    'blog_preview',
    'sustainability'
);
CREATE TYPE expense_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE expense_payment_method AS ENUM ('cash', 'credit_card', 'bank_transfer', 'other');
CREATE TYPE expense_category AS ENUM ('office_supplies', 'travel', 'utilities', 'marketing', 'other');
CREATE TYPE form_status AS ENUM ('new', 'in_progress', 'completed', 'cancelled');
CREATE TYPE form_type AS ENUM ('business', 'consultation', 'bulk_order');
CREATE TYPE invoice_status AS ENUM ('draft', 'pending', 'paid', 'overdue', 'cancelled');
CREATE TYPE page_view_type AS ENUM ('page_view', 'product_view', 'cart_view');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE post_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE promo_code_type AS ENUM ('percentage', 'fixed');
CREATE TYPE referral_status AS ENUM ('pending', 'completed', 'expired');
CREATE TYPE reminder_recurrence AS ENUM ('none', 'daily', 'weekly', 'monthly');
CREATE TYPE severity_level AS ENUM ('mild', 'moderate', 'severe');
CREATE TYPE supported_currency AS ENUM ('USD', 'CAD', 'EUR', 'GBP');
CREATE TYPE supported_language AS ENUM ('en', 'fr', 'es');
CREATE TYPE user_role AS ENUM ('admin', 'client', 'guest');

-- Create tables
CREATE TABLE blog_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    parent_id UUID,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE TABLE blog_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    user_id UUID,
    post_id UUID,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Continue with ALL other tables...

-- Create functions
CREATE OR REPLACE FUNCTION public.migrate_sustainability_content()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
    sustainability_page_id UUID;
BEGIN
    SELECT id INTO sustainability_page_id
    FROM pages
    WHERE slug = 'sustainability'
    LIMIT 1;

    IF sustainability_page_id IS NOT NULL THEN
        INSERT INTO sustainability_sections (
            page_id,
            section_type,
            content,
            order_index
        ) VALUES (
            sustainability_page_id,
            'sustainability_hero',
            '{
                "title": "Caring for Women, Caring for the Planet",
                "description": "Discover how Elloria is leading the way in sustainable feminine care",
                "background_image": "/lovable-uploads/033d3c83-3a91-4fee-a121-d5e700b8768d.png"
            }'::jsonb,
            0
        );
        -- ... continue with other sections
    END IF;
END;
$function$;

-- Continue with ALL other functions...

-- Create triggers
CREATE TRIGGER update_content_blocks_updated_at
    BEFORE UPDATE ON content_blocks
    FOR EACH ROW
    EXECUTE FUNCTION update_content_blocks_updated_at();

-- Continue with ALL other triggers...

-- Set up Row Level Security policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- Continue with all RLS policies...
