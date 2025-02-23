
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

let SUPABASE_URL = "";
let SUPABASE_PUBLISHABLE_KEY = "";

export let supabase = null;

try {
  if (SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY) {
    supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  }
} catch (error) {
  console.warn('Supabase client not initialized. Setup required.');
}

export function initializeSupabase(url: string, key: string) {
  SUPABASE_URL = url;
  SUPABASE_PUBLISHABLE_KEY = key;
  supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  return supabase;
}
