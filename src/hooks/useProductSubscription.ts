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
          event: '*',
          schema: 'public',
          table: 'products'
        },
        async (payload) => {
          console.log('Product change detected:', payload);
          
          const { data: products, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });
            
          if (error) {
            console.error('Error fetching products:', error);
            return;
          }
          
          // Convert Supabase data to Product type
          const typedProducts: Product[] = products.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            image: p.image,
            price: p.price,
            features: p.features,
            specifications: {
              length: p.specifications.length || '',
              absorption: p.specifications.absorption || '',
              quantity: p.specifications.quantity || '',
              material: p.specifications.material || '',
              features: p.specifications.features || ''
            }
          }));
          
          console.log('Updated products list:', typedProducts);
          onUpdate(typedProducts);
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up product subscription');
      supabase.removeChannel(channel);
    };
  }, [onUpdate]);
};