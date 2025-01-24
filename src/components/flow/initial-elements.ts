import { Node, Edge } from '@xyflow/react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/types/product';
import { parseSpecifications } from '@/utils/supabase-helpers';

const fetchProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase
    .from('products')
    .select('*');

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data.map(p => ({
    ...p,
    specifications: parseSpecifications(p.specifications)
  }));
};

export const getInitialElements = async (): Promise<{ nodes: Node[], edges: Edge[] }> => {
  const products = await fetchProducts();
  
  const nodes: Node[] = [
    {
      id: 'annotation-1',
      type: 'annotation',
      position: { x: 0, y: 0 },
      data: {
        level: 1,
        label: 'Our Product Flow',
        arrowStyle: {
          right: 0,
          bottom: 0,
          transform: 'translate(-30px,10px) rotate(-80deg)',
        },
      },
    },
    ...products.map((product, index) => ({
      id: `product-${product.id}`,
      type: 'product',
      position: { x: index * 250, y: 200 },
      data: { productId: product.id },
    })),
  ];

  const edges: Edge[] = products.slice(0, -1).map((_, index) => ({
    id: `e${index}`,
    source: `product-${products[index].id}`,
    target: `product-${products[index + 1].id}`,
    animated: true,
  }));

  return { nodes, edges };
};