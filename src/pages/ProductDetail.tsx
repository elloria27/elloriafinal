import { useParams } from "react-router-dom";
import { ProductGallery } from "@/components/ProductGallery";
import { Features } from "@/components/Features";
import { GameChanger } from "@/components/GameChanger";
import { CompetitorComparison } from "@/components/CompetitorComparison";
import { Testimonials } from "@/components/Testimonials";
import { ElevatingEssentials } from "@/components/ElevatingEssentials";
import { Sustainability } from "@/components/Sustainability";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { parseProduct } from "@/utils/supabase-helpers";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Share2, ArrowDown } from "lucide-react";
import { motion } from "framer-motion";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        
        const parsedProduct = parseProduct(data);
        setProduct(parsedProduct);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-accent-purple/20 via-white to-white pt-[96px] md:pt-[120px]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {product.name}
              </h1>
              <p className="text-gray-600 text-lg md:text-xl">
                {product.description}
              </p>
              <div className="text-3xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="flex-1">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg" className="flex-1">
                  <Heart className="mr-2 h-5 w-5" />
                  Add to Wishlist
                </Button>
                <Button 
                  variant="ghost" 
                  size="lg"
                  onClick={handleShare}
                  className="w-14 px-0"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative"
            >
              <ProductGallery media={product.media || []} productName={product.name} />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center"
          >
            <p className="text-gray-600 mb-2">Discover More</p>
            <ArrowDown className="w-6 h-6 mx-auto animate-bounce text-primary" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <ElevatingEssentials />

      {/* Game Changer Section */}
      <GameChanger />

      {/* Competitor Comparison */}
      <CompetitorComparison />

      {/* Sustainability Section */}
      <Sustainability />

      {/* Testimonials */}
      <Testimonials />

      {/* Specifications Section */}
      {product.specifications && (
        <section className="py-24 bg-gradient-to-b from-white via-accent-purple/5 to-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                Product Specifications
              </h2>
              <div className="grid gap-6">
                {Object.entries(product.specifications).map(([key, value], index) => (
                  <motion.div
                    key={key}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <h3 className="font-medium text-gray-600 mb-2">{key}</h3>
                    <p className="text-gray-800">{value}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;