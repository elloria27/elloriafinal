import { Node, Edge } from '@xyflow/react';
import { products } from '@/components/ProductCarousel';

export const initialNodes: Node[] = [
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

export const initialEdges: Edge[] = products.slice(0, -1).map((_, index) => ({
  id: `e${index}`,
  source: `product-${products[index].id}`,
  target: `product-${products[index + 1].id}`,
  animated: true,
}));