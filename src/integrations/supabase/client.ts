
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://amlirkbzqkbgbvrmgibf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtbGlya2J6cWtiZ2J2cm1naWJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5Nzg4MzAsImV4cCI6MjA1NjU1NDgzMH0.qsXKN4NNFNzc2YHSgvqPyEP3NIk0W4MRlOxOq7tZ3-8";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
