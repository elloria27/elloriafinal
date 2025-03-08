
import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { apiClient } from '@/utils/api-client';
import { supabase } from '@/integrations/supabase/client';
import { parseProduct } from '@/utils/supabase-helpers';

type UseProductsApiOptions = {
  fallbackToSupabase?: boolean;
};

/**
 * Hook to fetch products from the Express API with fallback to Supabase during migration
 */
export const useProductsApi = (options: UseProductsApiOptions = {}) => {
  const { fallbackToSupabase = true } = options;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // First try to fetch from Express.js API
        const data = await apiClient.getProducts();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('Error with Express API, falling back to Supabase:', err);
        
        // If Express API fails and fallback enabled, try Supabase
        if (fallbackToSupabase) {
          try {
            const { data, error: supabaseError } = await supabase
              .from('products')
              .select('*')
              .order('created_at', { ascending: false });
            
            if (supabaseError) throw supabaseError;
            
            // Map Supabase data to Product type using the parseProduct utility
            const parsedProducts = data.map(parseProduct);
            
            setProducts(parsedProducts);
            setError(null);
          } catch (fallbackErr: any) {
            console.error('Fallback also failed:', fallbackErr);
            setError(fallbackErr);
          }
        } else {
          setError(err as Error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [fallbackToSupabase]);

  return { products, loading, error };
};
