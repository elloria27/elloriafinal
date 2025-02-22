
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://your-project.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "your-anon-key";

export const isSupabaseConfigured = 
  SUPABASE_URL !== "https://your-project.supabase.co" && 
  SUPABASE_PUBLISHABLE_KEY !== "your-anon-key";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
