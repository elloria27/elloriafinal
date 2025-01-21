import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { products } from "@/components/ProductCarousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Share2, ShoppingCart, ChevronRight, Star, Heart, Check, ArrowRight } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find((p) => p.id === Number(id));
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/" className="text-primary hover:underline">
            Return to home
          </Link>
        </motion.div>
      </div>
    );
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } catch (error) {
      console.error("Error sharing:", error);
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleAddToCart = () => {
    addItem({
      ...product,
      quantity,
    });
    toast.success("Added to cart!");
  };

  const productImages = [
    product.image,
    "/lovable-uploads/57fdc254-25ea-4a73-8128-c819f574f1fc.png",
    "/lovable-uploads/724f13b7-0a36-4896-b19a-e51981befdd3.png",
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Header />
      <main className="pt-16">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <motion.nav 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center text-sm text-gray-500 mb-8"
          >
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-gray-900">{product.name}</span>
          </motion.nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left Column - Product Images */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-2xl">
                <motion.img
                  key={selectedImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-contain p-8"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-white/20 pointer-events-none" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                {productImages.map((image, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-square rounded-2xl overflow-hidden bg-white ${
                      selectedImage === index
                        ? "ring-2 ring-primary shadow-lg"
                        : "ring-1 ring-gray-200"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} view ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-contain p-4"
                    />
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Right Column - Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:sticky lg:top-24 space-y-8"
            >
              <div className="space-y-4">
                <motion.span 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="inline-block px-4 py-2 rounded-full bg-accent-purple/20 text-primary font-medium"
                >
                  New Arrival
                </motion.span>
                
                <motion.h1 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl font-bold"
                >
                  {product.name}
                </motion.h1>

                <div className="flex items-center gap-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">(128 reviews)</span>
                </div>

                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-3xl font-bold text-primary"
                >
                  ${product.price.toFixed(2)}
                </motion.p>
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="prose prose-lg max-w-none text-gray-600"
              >
                <p>{product.description}</p>
              </motion.div>

              <div className="space-y-6 border-t border-gray-100 pt-8">
                <div className="grid grid-cols-2 gap-4">
                  {product.features.slice(0, 4).map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm"
                    >
                      <div className="flex-shrink-0">
                        <Check className="h-5 w-5 text-primary" />
                      </div>
                      <span className="text-sm text-gray-600">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-32">
                    <Input
                      type="number"
                      min="1"
                      max="99"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(99, Number(e.target.value))))}
                      className="text-center"
                    />
                  </div>
                  <Button
                    size="lg"
                    className="flex-1 bg-primary hover:bg-primary/90 text-white"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setIsLiked(!isLiked)}
                    className={`px-6 ${isLiked ? 'text-red-500 border-red-500' : ''}`}
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </div>

              <div className="space-y-4 border-t border-gray-100 pt-8">
                <h3 className="text-lg font-semibold">Product Specifications</h3>
                <div className="grid grid-cols-2 gap-y-4">
                  {Object.entries(product.specifications).map(([key, value], index) => (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="space-y-1"
                    >
                      <dt className="text-sm text-gray-500 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </dt>
                      <dd className="font-medium text-gray-900">{value}</dd>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                whileHover={{ x: 5 }}
                onClick={handleShare}
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
              >
                <Share2 className="h-5 w-5" />
                <span>Share this product</span>
                <ArrowRight className="h-4 w-4" />
              </motion.button>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;