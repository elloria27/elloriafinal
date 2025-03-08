
import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '@/utils/api-client';

interface User {
  id: string;
  email: string;
  full_name?: string;
}

interface Session {
  access_token: string;
  expires_at: number;
  user: User;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if there's a session in localStorage
    const storedSession = localStorage.getItem('session');
    
    if (storedSession) {
      try {
        const parsedSession = JSON.parse(storedSession);
        // Check if session is expired
        if (parsedSession.expires_at > Date.now() / 1000) {
          setSession(parsedSession);
          setUser(parsedSession.user);
        } else {
          // Session expired, remove it
          localStorage.removeItem('session');
        }
      } catch (error) {
        console.error('Error parsing stored session:', error);
        localStorage.removeItem('session');
      }
    }
    
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const { session, user } = await apiClient.auth.login(email, password);
      
      setSession(session);
      setUser(user);
      
      // Store session in localStorage
      localStorage.setItem('session', JSON.stringify(session));
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    setLoading(true);
    setError(null);
    
    try {
      await apiClient.auth.register(email, password, fullName);
      // After registration, sign in the user
      await signIn(email, password);
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await apiClient.auth.logout();
      
      // Clear session and user
      setSession(null);
      setUser(null);
      
      // Remove session from localStorage
      localStorage.removeItem('session');
    } catch (error: any) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, error, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
