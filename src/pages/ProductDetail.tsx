import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { products } from "@/components/ProductCarousel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Share2, ShoppingCart, ChevronRight, Star, Heart } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-b from-accent-purple/5 to-accent-peach/5">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <motion.nav 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center text-sm text-gray-500"
          >
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link to="/" className="hover:text-primary transition-colors">
              Products
            </Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-gray-900">{product.name}</span>
          </motion.nav>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="relative">
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-br from-accent-purple/20 via-accent-peach/10 to-accent-green/10 rounded-3xl p-8"
                >
                  <Carousel className="w-full max-w-xl mx-auto">
                    <CarouselContent>
                      {productImages.map((image, index) => (
                        <CarouselItem key={index}>
                          <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="relative aspect-square rounded-xl overflow-hidden bg-white"
                          >
                            <img
                              src={image}
                              alt={`${product.name} view ${index + 1}`}
                              className="absolute inset-0 w-full h-full object-contain transform hover:scale-105 transition-transform duration-300"
                            />
                          </motion.div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="bg-white/80 backdrop-blur-sm" />
                    <CarouselNext className="bg-white/80 backdrop-blur-sm" />
                  </Carousel>
                </motion.div>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex gap-4 overflow-x-auto pb-4"
              >
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-300 ${
                      selectedImage === index
                        ? "ring-2 ring-primary scale-95"
                        : "ring-1 ring-gray-200 hover:ring-primary/50"
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </button>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="space-y-4">
                <motion.h1 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
                >
                  {product.name}
                </motion.h1>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    (128 customer reviews)
                  </span>
                </div>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-3xl font-bold text-primary"
                >
                  ${product.price.toFixed(2)}
                </motion.p>
              </div>

              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-gray-600 leading-relaxed text-lg"
              >
                {product.description}
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                <h3 className="text-xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Key Features
                </h3>
                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-secondary" />
                      <span className="text-gray-700">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="space-y-6 pt-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-32">
                    <Input
                      type="number"
                      min="1"
                      max="99"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(Math.max(1, Math.min(99, Number(e.target.value))))
                      }
                      className="text-center"
                    />
                  </div>
                  <Button
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleShare}
                    className="px-6"
                  >
                    <Share2 className="h-5 w-5" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setIsLiked(!isLiked)}
                    className={`px-6 ${isLiked ? 'text-red-500' : ''}`}
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                  </Button>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="border-t pt-6 mt-8"
              >
                <h3 className="text-xl font-semibold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Specifications
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value], index) => (
                    <motion.div 
                      key={key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1 + index * 0.1 }}
                      className="space-y-1"
                    >
                      <dt className="text-sm text-gray-500 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </dt>
                      <dd className="font-medium text-gray-900">{value}</dd>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-24"
          >
            <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              You might also like
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {products
                .filter((p) => p.id !== product.id)
                .map((relatedProduct, index) => (
                  <motion.div
                    key={relatedProduct.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4 + index * 0.2 }}
                    className="group relative"
                  >
                    <Link
                      to={`/product/${relatedProduct.id}`}
                      className="block relative aspect-square rounded-xl overflow-hidden bg-gradient-to-br from-accent-purple/20 via-accent-peach/10 to-accent-green/10 p-4 mb-4"
                    >
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className="absolute inset-0 w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    <h3 className="text-lg font-semibold mb-2">
                      <Link
                        to={`/product/${relatedProduct.id}`}
                        className="hover:text-primary transition-colors"
                      >
                        {relatedProduct.name}
                      </Link>
                    </h3>
                    <p className="text-primary font-bold">
                      ${relatedProduct.price.toFixed(2)}
                    </p>
                  </motion.div>
                ))}
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProductDetail;