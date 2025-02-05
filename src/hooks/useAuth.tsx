import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return {
    isLoading,
    signOut,
  };
};