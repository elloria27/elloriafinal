// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://euexcsqvsbkxiwdieepu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1ZXhjc3F2c2JreGl3ZGllZXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1OTE0ODYsImV4cCI6MjA1MzE2NzQ4Nn0.SA8nsT8fEf2Igd91FNUNFYxT0WQb9qmYblrxxE7eV4U";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);