
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "";
const SUPABASE_PUBLISHABLE_KEY = "";

// Import the supabase client like this:
// import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);

export const supabase = isSupabaseConfigured 
  ? createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
  : null;
