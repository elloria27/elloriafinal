
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

/**
 * Hook to protect routes that require authentication
 * @param redirectTo Path to redirect to if user is not authenticated
 * @returns loading state
 */
export const useAuthProtection = (redirectTo: string = '/login') => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        toast.error('Пожалуйста, войдите в систему для доступа к этой странице');
        navigate(redirectTo);
      }
      setIsChecking(false);
    }
  }, [user, loading, navigate, redirectTo]);

  return { isChecking: loading || isChecking };
};
