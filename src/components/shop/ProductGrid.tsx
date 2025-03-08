
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Product } from "@/types/product";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductsApi } from "@/hooks/useProductsApi";
import { useProductSubscription } from "@/hooks/useProductSubscription";

interface ProductGridProps {
  initialProducts?: Product[];
}

export const ProductGrid = ({ initialProducts }: ProductGridProps) => {
  const [products, setProducts] = useState<Product[]>(initialProducts || []);
  const { products: apiProducts, loading, error } = useProductsApi();

  // Use Supabase subscription for real-time updates during migration
  useProductSubscription((newProducts) => {
    // Only update if we're showing API-fetched products (not filtered ones)
    if (!initialProducts) {
      setProducts(newProducts);
    }
  });

  useEffect(() => {
    // If no initialProducts were passed (no filtering active), use the API products
    if (!initialProducts && apiProducts.length > 0) {
      setProducts(apiProducts);
    }
  }, [apiProducts, initialProducts]);

  if (loading && products.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="border rounded-lg p-4 flex flex-col gap-3">
            <Skeleton className="h-48 w-full rounded-md" />
            <Skeleton className="h-6 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full mt-auto" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">
          Failed to load products. Please try again later.
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No products match your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
      {products.map((product) => (
        <Link key={product.id} to={`/products/${product.slug}`}>
          <motion.div
            whileHover={{ y: -4 }}
            className="border rounded-lg p-4 h-full flex flex-col hover:shadow-md transition-shadow duration-200 bg-white"
          >
            <div className="aspect-square rounded-md overflow-hidden mb-4">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
            <p className="text-gray-500 mb-4 line-clamp-2">
              {product.description}
            </p>
            <p className="mt-auto text-lg font-bold">
              ${product.price.toFixed(2)}
            </p>
          </motion.div>
        </Link>
      ))}
    </div>
  );
}
