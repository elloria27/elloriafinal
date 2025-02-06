import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Product } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";
import { parseProduct } from "@/utils/supabase-helpers";

export const RecentProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { addItem } = useCart();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log('Fetching recent products...');
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(3);

        if (error) throw error;
        
        // Parse the products using the helper function
        const parsedProducts = data.map(parseProduct);
        console.log('Fetched recent products:', parsedProducts);
        setProducts(parsedProducts);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load recent products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
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

  if (isLoading) {
    return (
      <div className="py-12 text-center">
        <div className="animate-pulse">Loading products...</div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured Products
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our most popular products
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
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
                  <Button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white"
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    asChild
                    className="flex-1 border-primary/20 hover:border-primary/40 text-primary"
                  >
                    <Link to={`/products/${product.slug}`}>
                      View Details
                    </Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};