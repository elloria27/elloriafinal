
import { supabase } from '@/integrations/supabase/client';
import { AuthUser } from '../auth/types';

export async function getProfileById(id: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, user_roles(role)')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(
  id: string,
  updates: {
    full_name?: string;
    phone_number?: string;
    address?: string;
    country?: string;
    region?: string;
    language?: string;
    currency?: string;
  }
) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function getFullUserProfile(id: string): Promise<AuthUser | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      user_roles!user_roles_user_id_fkey (
        role
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!data) return null;

  return {
    id: data.id,
    email: data.email,
    full_name: data.full_name,
    role: data.user_roles?.role || 'user'
  };
}
