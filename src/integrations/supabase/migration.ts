
import { supabase } from './client';
import { toast } from "sonner";

interface MigrationError {
  table: string;
  error: any;
}

async function isDatabaseEmpty(): Promise<boolean> {
  try {
    // Try to get user_roles table as it's one of our core tables
    const { data: userRoles, error: userRolesError } = await supabase
      .from('user_roles')
      .select('id')
      .limit(1);

    // If we get an error about the table not existing, database needs setup
    if (userRolesError && userRolesError.message.includes('does not exist')) {
      return true;
    }

    // If we can query the table but it's empty, we still need setup
    if (!userRolesError && (!userRoles || userRoles.length === 0)) {
      // Double check profiles table as well
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      if (profilesError && profilesError.message.includes('does not exist')) {
        return true;
      }

      return !profiles || profiles.length === 0;
    }

    // If we get here, the database has data
    return false;
  } catch (error) {
    console.error('Error checking database:', error);
    return false; // Assume database is not empty on error to prevent data loss
  }
}

export async function migrateDatabase(): Promise<{ success: boolean; errors: MigrationError[] }> {
  const errors: MigrationError[] = [];
  
  try {
    // Check if database needs installation
    const needsInstallation = await isDatabaseEmpty();
    
    if (!needsInstallation) {
      console.log('Database already initialized, skipping installation');
      return { success: true, errors: [] };
    }

    // Show installation message
    toast.loading("Please wait, system installation in progress...", {
      duration: Infinity,
      id: "installation-toast"
    });

    // First, ensure all required tables exist
    await ensureRequiredTables(errors);
    
    // Then create initial admin user if none exists
    await createInitialAdmin();

    // Dismiss loading toast and show success
    toast.dismiss("installation-toast");
    toast.success("System installation completed successfully!", {
      description: "Admin credentials - Email: admin@example.com, Password: Admin123!@#",
      duration: 10000
    });

    return { success: errors.length === 0, errors };
  } catch (error) {
    // Dismiss loading toast and show error
    toast.dismiss("installation-toast");
    toast.error("Installation failed. Please check console for details.");
    console.error('Migration failed:', error);
    return { success: false, errors: [...errors, { table: 'general', error }] };
  }
}

async function ensureRequiredTables(errors: MigrationError[]) {
  try {
    // Create types first
    const { error: typesError } = await supabase.rpc('create_types', {
      sql: `
        DO $$ BEGIN
          CREATE TYPE IF NOT EXISTS public.user_role AS ENUM ('admin', 'client', 'moderator');
          CREATE TYPE IF NOT EXISTS public.post_status AS ENUM ('draft', 'published', 'archived');
          CREATE TYPE IF NOT EXISTS public.form_status AS ENUM ('new', 'in_progress', 'completed', 'cancelled');
          CREATE TYPE IF NOT EXISTS public.component_status AS ENUM ('draft', 'published', 'archived');
          CREATE TYPE IF NOT EXISTS public.page_view_type AS ENUM ('page_view', 'file_view', 'product_view');
          CREATE TYPE IF NOT EXISTS public.task_status AS ENUM ('todo', 'in_progress', 'completed', 'blocked');
          CREATE TYPE IF NOT EXISTS public.task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
          CREATE TYPE IF NOT EXISTS public.task_category AS ENUM ('development', 'design', 'marketing', 'other');
          CREATE TYPE IF NOT EXISTS public.expense_status AS ENUM ('pending', 'approved', 'rejected');
          CREATE TYPE IF NOT EXISTS public.payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
          CREATE TYPE IF NOT EXISTS public.invoice_status AS ENUM ('draft', 'pending', 'paid', 'overdue', 'cancelled');
          CREATE TYPE IF NOT EXISTS public.reminder_recurrence AS ENUM ('none', 'daily', 'weekly', 'monthly');
          CREATE TYPE IF NOT EXISTS public.referral_status AS ENUM ('pending', 'completed', 'cancelled');
          CREATE TYPE IF NOT EXISTS public.supported_currency AS ENUM ('USD', 'EUR', 'GBP', 'CAD');
          CREATE TYPE IF NOT EXISTS public.supported_language AS ENUM ('en', 'es', 'fr', 'de');
        END $$;
      `
    });
    
    if (typesError) errors.push({ table: 'types', error: typesError });

    // Create profiles table
    const { error: profilesError } = await supabase.rpc('create_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.profiles (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          full_name TEXT,
          email TEXT,
          phone_number TEXT,
          address TEXT,
          country TEXT,
          region TEXT,
          currency TEXT DEFAULT 'USD',
          language TEXT DEFAULT 'en',
          marketing_emails BOOLEAN DEFAULT false,
          email_notifications BOOLEAN DEFAULT false,
          completed_initial_setup BOOLEAN DEFAULT false,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
          selected_delivery_method UUID
        );
      `
    });
    
    if (profilesError) errors.push({ table: 'profiles', error: profilesError });

    // Create user_roles table
    const { error: rolesError } = await supabase.rpc('create_table', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.user_roles (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          role user_role DEFAULT 'client',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
        );
      `
    });
    
    if (rolesError) errors.push({ table: 'user_roles', error: rolesError });

    // Create handle_new_user function and trigger
    const { error: triggerError } = await supabase.rpc('create_trigger', {
      sql: `
        CREATE OR REPLACE FUNCTION public.handle_new_user()
        RETURNS trigger
        LANGUAGE plpgsql
        SECURITY DEFINER
        SET search_path = public
        AS $function$
        BEGIN
          INSERT INTO public.profiles (id, email, full_name)
          VALUES (
            NEW.id,
            NEW.email,
            COALESCE(NEW.raw_user_meta_data->>'full_name', '')
          );
          
          INSERT INTO public.user_roles (user_id, role)
          VALUES (NEW.id, 'client');
          
          RETURN NEW;
        END;
        $function$;

        DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
        
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
      `
    });
    
    if (triggerError) errors.push({ table: 'triggers', error: triggerError });

  } catch (error) {
    errors.push({ table: 'migration', error });
  }
}

async function createInitialAdmin() {
  try {
    // Check if any admin exists
    const { data: existingAdmin, error: checkError } = await supabase
      .from('user_roles')
      .select('user_id')
      .eq('role', 'admin')
      .limit(1);

    if (checkError) throw checkError;

    // If no admin exists, create one
    if (!existingAdmin || existingAdmin.length === 0) {
      const adminEmail = 'admin@example.com';
      const adminPassword = 'Admin123!@#'; // This should be changed on first login

      // Create admin user in auth.users
      const { data: authUser, error: createError } = await supabase.auth.signUp({
        email: adminEmail,
        password: adminPassword,
        options: {
          data: {
            full_name: 'System Administrator'
          }
        }
      });

      if (createError) throw createError;

      if (authUser.user) {
        // Update the user_role to admin
        const { error: roleError } = await supabase
          .from('user_roles')
          .update({ role: 'admin' })
          .eq('user_id', authUser.user.id);

        if (roleError) throw roleError;

        console.log('Initial admin user created successfully');
      }
    }
  } catch (error) {
    console.error('Error creating initial admin:', error);
    throw error;
  }
}
