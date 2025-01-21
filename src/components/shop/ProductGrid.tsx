import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { products } from "@/components/ProductCarousel";

export const ProductGrid = () => {
  const { addItem } = useCart();

  const handleAddToCart = (product: typeof products[0]) => {
    addItem({
      ...product,
      quantity: 1,
    });
    toast.success(`Added ${product.name} to cart`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group relative"
        >
          <div className="relative rounded-2xl overflow-hidden bg-white p-6 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/20 via-accent-peach/10 to-accent-green/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <Link to={`/product/${product.id}`} className="block relative">
              <div className="relative mb-6 aspect-square">
                <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/30 via-accent-peach/20 to-accent-green/20 rounded-full blur-3xl" />
                <motion.img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain relative z-10 transform group-hover:scale-105 transition-transform duration-500"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="space-y-2 mb-4">
                <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {product.name}
                </h3>
                <p className="text-lg font-semibold text-primary">
                  ${product.price.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {product.description}
                </p>
              </div>
            </Link>

            <div className="flex gap-2">
              <Button
                onClick={() => handleAddToCart(product)}
                className="flex-1 bg-primary hover:bg-primary/90"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex-1 border-primary/20 hover:border-primary/40 text-primary"
              >
                <Link to={`/product/${product.id}`}>
                  View Details
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};