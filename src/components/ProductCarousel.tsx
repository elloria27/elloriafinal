
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Input } from "@/components/ui/input";
import { ShoppingCart, ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useProductSubscription } from "@/hooks/useProductSubscription";
import { Product } from "@/types/product";
import { initialProducts } from "@/data/initialProducts";
import { ProductCarouselContent } from "@/types/content-blocks";

interface ProductCarouselProps {
  content?: ProductCarouselContent;
}

const defaultContent = {
  title: "Our Products",
  subtitle: "Designed with comfort and confidence in mind",
  description: ""
};

export const ProductCarousel = ({ content }: ProductCarouselProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [quantities, setQuantities] = useState<{ [key: string]: number }>(
    Object.fromEntries(initialProducts.map(p => [p.id, 1]))
  );
  const [animatingProduct, setAnimatingProduct] = useState<string | null>(null);

  const handleProductsUpdate = useCallback((updatedProducts: Product[]) => {
    console.log('Updating products in carousel:', updatedProducts);
    setProducts(updatedProducts);
    setQuantities(prev => ({
      ...prev,
      ...Object.fromEntries(updatedProducts.map(p => [p.id, 1]))
    }));
  }, []);

  useProductSubscription(handleProductsUpdate);

  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const handleQuantityChange = (productId: string, value: string) => {
    console.log("Quantity changed:", productId, value);
    const quantity = parseInt(value) || 1;
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, Math.min(99, quantity))
    }));
  };

  const handleAddToCart = async (product: typeof products[0]) => {
    console.log("Adding to cart:", product);
    setAnimatingProduct(product.id);
    
    const cartItem = {
      id: product.id,
      name: product.name,
      description: product.description,
      image: product.image,
      price: product.price,
      quantity: quantities[product.id]
    };
    
    addItem(cartItem);
    toast.success("Added to cart successfully!");
    setTimeout(() => setAnimatingProduct(null), 1000);
  };

  const handleCustomBuyClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Use content from props if available, otherwise use default content
  const finalContent = {
    title: content?.title || defaultContent.title,
    subtitle: content?.subtitle || defaultContent.subtitle,
    description: content?.description || defaultContent.description
  };

  console.log('ProductCarousel content:', content);
  console.log('Final content being used:', finalContent);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen py-32 bg-gradient-to-b from-accent-purple/5 via-white to-accent-peach/5"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent-purple/10 via-transparent to-transparent opacity-30" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20 px-4"
      >
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {finalContent.title}
          </span>
        </h2>
        <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
          {finalContent.subtitle}
        </p>
        {finalContent.description && (
          <p className="text-gray-600 text-lg max-w-3xl mx-auto mt-4 leading-relaxed">
            {finalContent.description}
          </p>
        )}
      </motion.div>

      <motion.div 
        style={{ y, opacity }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4"
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="group relative"
          >
            <div className="relative rounded-[2rem] overflow-hidden bg-white p-8 shadow-lg hover:shadow-xl transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/20 via-accent-peach/10 to-accent-green/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="relative z-10"
              >
                <div className="relative mb-8 aspect-square">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/30 via-accent-peach/20 to-accent-green/20 rounded-full blur-3xl" />
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="relative"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain relative z-10 transform group-hover:scale-105 transition-transform duration-500"
                    />
                    {animatingProduct === product.id && (
                      <motion.div
                        initial={{ scale: 1, x: 0, y: 0, opacity: 1 }}
                        animate={{
                          scale: 0.5,
                          x: window.innerWidth / 2,
                          y: -window.innerHeight / 2,
                          opacity: 0
                        }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                        className="absolute top-0 left-0 w-full h-full"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain"
                        />
                      </motion.div>
                    )}
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {product.name}
                    </h3>
                    
                    <p className="text-xl font-semibold text-primary">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>

                  <p className="text-gray-600 line-clamp-3 text-sm">
                    {product.description}
                  </p>

                  <div className="space-y-6 pt-4">
                    {!product.custom_buy_button?.enabled && (
                      <div className="flex items-center justify-center gap-4">
                        <label className="text-sm text-gray-600">Quantity:</label>
                        <Input
                          type="number"
                          min="1"
                          max="99"
                          value={quantities[product.id]}
                          onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                          className="w-20 text-center rounded-xl border-accent-purple/20"
                        />
                      </div>
                    )}

                    <div className="flex flex-col gap-3">
                      {product.custom_buy_button?.enabled && product.custom_buy_button?.url ? (
                        <Button 
                          onClick={() => handleCustomBuyClick(product.custom_buy_button!.url)}
                          className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <ExternalLink className="mr-2 h-5 w-5" />
                          Buy Now
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => handleAddToCart(product)}
                          disabled={animatingProduct === product.id}
                          className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                        >
                          <ShoppingCart className="mr-2 h-5 w-5" />
                          Add to Cart
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        asChild
                        className="w-full bg-white hover:bg-primary/5 text-primary border-2 border-primary/20 hover:border-primary/40 py-2 text-lg rounded-xl transition-all duration-300 group"
                      >
                        <Link to={`/products/${product.slug}`}>
                          Learn More
                          <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
