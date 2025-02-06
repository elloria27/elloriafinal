import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ProductGallery } from "@/components/ProductGallery";
import { Share2, ShoppingCart, Star, Heart, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { parseProduct } from "@/utils/supabase-helpers";
import { Features } from "@/components/Features";
import { Header } from "@/components/Header";
import { SEOHead } from "@/components/SEOHead";
import { useSEO } from "@/hooks/useSEO";

const ProductDetailContent = () => {
  const { seoData } = useSEO();
  
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();
  const addToCartButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        console.log('Fetching product with slug:', slug);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) {
          console.error('Error fetching product:', error);
          setLoading(false);
          return;
        }

        if (data) {
          const parsedProduct = parseProduct(data);
          console.log('Parsed product:', parsedProduct);
          setProduct(parsedProduct);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };

    setLoading(true);
    fetchProduct();
  }, [slug]);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product?.name || "",
        text: product?.description || "",
        url: window.location.href,
      });
    } catch (error) {
      console.error("Error sharing:", error);
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Success",
        description: "Link copied to clipboard!",
      });
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      ...product,
      quantity,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/" className="text-primary hover:underline">Return to home</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={seoData?.meta_title || `${product.name} - Eco Curve Interact`}
        description={seoData?.meta_description || product.description}
        keywords={seoData?.meta_keywords || undefined}
        canonicalUrl={seoData?.canonical_url || undefined}
        ogTitle={seoData?.og_title || product.name}
        ogDescription={seoData?.og_description || product.description}
        ogImage={seoData?.og_image || product.image}
      />
      
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Header />
      <main className="pt-32">
        <section className="pb-16 px-4">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                {product.name}
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                {product.description}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <ProductGallery 
                media={product.media || []} 
                productName={product.name} 
              />
            </motion.div>
          </div>
        </section>

        <section className="py-24 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <Features content={{
              features: product.why_choose_features || [],
              title: "Why Choose Our Product",
              subtitle: "Discover what makes our product special"
            }} />
          </div>
        </section>

        <section className="py-24 px-4 bg-gradient-to-br from-accent-purple/20 to-accent-peach/20">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="space-y-4">
                  <h2 className="text-4xl font-bold">Ready to Experience the Difference?</h2>
                  <p className="text-xl text-gray-600">{product.description}</p>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-6 h-6 text-yellow-400 fill-current" />
                    ))}
                    <span className="ml-2 text-gray-600">(128 reviews)</span>
                  </div>
                  <p className="text-3xl font-bold text-primary">${product.price.toFixed(2)}</p>
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
                    ref={addToCartButtonRef}
                    size="lg"
                    onClick={handleAddToCart}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white"
                  >
                    <ShoppingCart className="mr-2" />
                    Add to Cart
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => setIsLiked(!isLiked)}
                    className={isLiked ? 'text-red-500 border-red-500' : ''}
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80"
                >
                  <Share2 className="h-5 w-5" />
                  Share this product
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="relative aspect-square rounded-3xl overflow-hidden bg-white shadow-2xl"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-contain p-8"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-white/20 pointer-events-none" />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-24 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.h2 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-3xl font-bold text-center mb-16"
            >
              Product Specifications
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Object.entries(product.specifications).map(([key, value], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gray-50 p-6 rounded-xl"
                >
                  <dt className="text-sm text-gray-500 mb-2 capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">{value}</dd>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
    </>
  );
};

const ProductDetail = () => {
  return <ProductDetailContent />;
};

export default ProductDetail;
