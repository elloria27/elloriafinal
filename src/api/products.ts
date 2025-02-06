import { Product } from "@/types/product";
import { initialProducts } from "@/data/initialProducts";

export const fetchProductById = async (id?: string): Promise<Product | null> => {
  console.log('Fetching product by id:', id);
  
  if (!id) return null;
  
  // For now, we'll use the initial products data
  const product = initialProducts.find(p => p.id === id || p.slug === id);
  console.log('Found product:', product);
  
  return product || null;
};