import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { products } from '@/components/ProductCarousel';

interface ProductNodeData {
  productId: string;
}

export const ProductNode = memo(({ data }: { data: ProductNodeData }) => {
  const product = products.find(p => p.id === data.productId);

  if (!product) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg w-[200px]">
      <Handle type="target" position={Position.Top} />
      <img src={product.image} alt={product.name} className="w-full h-32 object-contain mb-2" />
      <h3 className="text-sm font-semibold">{product.name}</h3>
      <p className="text-xs text-gray-600 truncate">{product.description}</p>
      <p className="text-sm font-bold mt-2">${product.price}</p>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

ProductNode.displayName = 'ProductNode';