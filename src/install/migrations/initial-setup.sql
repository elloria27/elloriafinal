
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

-- Create tables (ordered by dependencies)
-- ... All table creation SQL statements will go here
-- This is just the start, we'll need to add all table creation statements

