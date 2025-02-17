
import { supabase } from './client';

interface MigrationError {
  table: string;
  error: any;
}

export async function migrateDatabase(): Promise<{ success: boolean; errors: MigrationError[] }> {
  const errors: MigrationError[] = [];
  console.log('Starting database migration...');

  try {
    // First, ensure all required tables exist
    await ensureRequiredTables(errors);
    
    // Then create initial admin user if none exists
    await createInitialAdmin();

    console.log('Migration completed successfully');
    return { success: errors.length === 0, errors };
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: false, errors: [...errors, { table: 'general', error }] };
  }
}

async function ensureRequiredTables(errors: MigrationError[]) {
  try {
    // Create profiles table
    const { error: profilesError } = await supabase.query(`
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
    `);
    
    if (profilesError) errors.push({ table: 'profiles', error: profilesError });

    // Create user_roles table
    const { error: rolesError } = await supabase.query(`
      CREATE TYPE IF NOT EXISTS public.user_role AS ENUM ('admin', 'client', 'moderator');
      
      CREATE TABLE IF NOT EXISTS public.user_roles (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
        role user_role DEFAULT 'client',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
      );
    `);
    
    if (rolesError) errors.push({ table: 'user_roles', error: rolesError });

    // Add handle_new_user function and trigger
    const { error: triggerError } = await supabase.query(`
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
    `);
    
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
