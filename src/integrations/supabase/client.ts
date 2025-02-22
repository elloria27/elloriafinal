
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://your-project.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "your-anon-key";

export const isSupabaseConfigured = 
  SUPABASE_URL !== "https://your-project.supabase.co" && 
  SUPABASE_PUBLISHABLE_KEY !== "your-anon-key";

// Only create the client if the configuration is valid
export const supabase = isSupabaseConfigured ? 
  createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY) : 
  null;

export const initializeSupabase = (url: string, key: string) => {
  return createClient<Database>(url, key);
};
