import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';

export const useProductSubscription = (onUpdate: (products: Product[]) => void) => {
  useEffect(() => {
    console.log('Setting up product subscription');
    
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'products'
        },
        async (payload) => {
          console.log('Product change detected:', payload);
          
          // Fetch all products after any change
          const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });
            
          if (error) {
            console.error('Error fetching products:', error);
            return;
          }
          
          console.log('Updated products list:', products);
          onUpdate(products);
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up product subscription');
      supabase.removeChannel(channel);
    };
  }, [onUpdate]);
};