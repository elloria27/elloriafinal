import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fwqrowedwayygdqjldgy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ3cXJvd2Vkd2F5eWdkcWpsZGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU5NDY4NzAsImV4cCI6MjAyMTUyMjg3MH0.qDPHvM6xkwYoLxKPDI0w6vQxFvgK3RxaYF2xZvZDTXY';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: localStorage,
    storageKey: 'supabase.auth.token',
    debug: true // This will help us see auth-related logs in the console
  }
});