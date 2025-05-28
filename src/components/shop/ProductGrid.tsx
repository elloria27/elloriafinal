import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingCart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { useState, useCallback } from "react";
import { Product } from "@/types/product";
import { useProductSubscription } from "@/hooks/useProductSubscription";

interface ProductGridProps {
  initialProducts: Product[];
}

export const ProductGrid = ({ initialProducts }: ProductGridProps) => {
  const { addItem } = useCart();
  const [products, setProducts] = useState(initialProducts);
  console.log("ProductGrid rendered with products:", products);

  const handleProductsUpdate = useCallback((updatedProducts: Product[]) => {
    console.log('Updating products in grid:', updatedProducts);
    setProducts(updatedProducts);
  }, []);

  useProductSubscription(handleProductsUpdate);

  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Adding to cart from ProductGrid:", product);
    
    try {
      const cartItem = {
        id: product.id,
        name: product.name,
        description: product.description,
        image: product.image,
        price: product.price,
        quantity: 1,
      };
      
      addItem(cartItem);
      toast.success(`Added ${product.name} to cart`);
    } catch (error) {
      console.error("Error adding item to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

  const handleCustomBuyClick = (e: React.MouseEvent, url: string) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Opening custom buy URL:", url);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product, index) => {
        console.log("Product custom_buy_button:", product.custom_buy_button);
        return (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group relative"
          >
            <div className="relative rounded-2xl overflow-hidden bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/20 via-accent-peach/10 to-accent-green/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="relative mb-6 aspect-square">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/30 via-accent-peach/20 to-accent-green/20 rounded-full blur-3xl" />
                  <Link to={`/products/${product.slug}`}>
                    <motion.img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain relative z-10 transform group-hover:scale-105 transition-transform duration-500"
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </div>

                <div className="space-y-2 mb-4">
                  <Link to={`/products/${product.slug}`}>
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-lg font-semibold text-primary">
                    ${product.price.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {product.description}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 relative z-20">
                {product.custom_buy_button?.enabled && product.custom_buy_button?.url ? (
                  <Button
                    onClick={(e) => handleCustomBuyClick(e, product.custom_buy_button!.url)}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Buy Now
                  </Button>
                ) : (
                  <Button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                )}
                <Button
                  variant="outline"
                  asChild
                  className="flex-1 border-primary/20 hover:border-primary/40 text-primary"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Link to={`/products/${product.slug}`}>
                    View Details
                  </Link>
                </Button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
