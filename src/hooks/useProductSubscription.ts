import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';
import { parseSpecifications } from '@/utils/supabase-helpers';

export const useProductSubscription = (
  onProductsUpdate: (products: Product[]) => void
) => {
  const fetchProducts = useCallback(async () => {
    console.log('Fetching products from Supabase');
    const { data, error } = await supabase
      .from('products')
      .select('*');

    if (error) {
      console.error('Error fetching products:', error);
      return;
    }

    const products = data.map(p => ({
      id: p.id,
      name: p.name,
      description: p.description,
      image: p.image,
      price: p.price,
      features: p.features,
      specifications: parseSpecifications(p.specifications),
      created_at: p.created_at,
      updated_at: p.updated_at
    }));

    console.log('Products fetched:', products);
    onProductsUpdate(products);
  }, [onProductsUpdate]);

  useEffect(() => {
    fetchProducts();

    const channel = supabase
      .channel('products-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        () => {
          console.log('Products table changed, refetching...');
          fetchProducts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchProducts]);
};