
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Default fallback values that will be used if environment variables are not set
const FALLBACK_URL = "https://placeholder-url.supabase.co";
const FALLBACK_KEY = "placeholder-anon-key";

// Get Supabase URL and key from environment variables or local storage
const getSupabaseUrl = (): string => {
  // Check local storage first (for development and installation process)
  const storedUrl = localStorage.getItem("supabase_url");
  if (storedUrl) return storedUrl;
  
  // Then check import.meta.env (for production)
  return import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL;
};

const getSupabaseAnonKey = (): string => {
  // Check local storage first (for development and installation process)
  const storedKey = localStorage.getItem("supabase_anon_key");
  if (storedKey) return storedKey;
  
  // Then check import.meta.env (for production)
  return import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_KEY;
};

export const supabase = createClient<Database>(
  getSupabaseUrl(),
  getSupabaseAnonKey(),
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
    },
  }
);
