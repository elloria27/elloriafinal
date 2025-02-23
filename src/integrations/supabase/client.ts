
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

let SUPABASE_URL = "https://euexcsqvsbkxiwdieepu.supabase.co";
let SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1ZXhjc3F2c2JreGl3ZGllZXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1OTE0ODYsImV4cCI6MjA1MzE2NzQ4Nn0.SA8nsT8fEf2Igd91FNUNFYxT0WQb9qmYblrxxE7eV4U";

export let supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

export function initializeSupabase(url: string, key: string) {
  SUPABASE_URL = url;
  SUPABASE_PUBLISHABLE_KEY = key;
  supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  return supabase;
}
