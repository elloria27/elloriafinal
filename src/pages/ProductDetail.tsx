import { useParams } from "react-router-dom";
import { ProductGallery } from "@/components/ProductGallery";
import { Features } from "@/components/Features";
import { GameChanger } from "@/components/GameChanger";
import { CompetitorComparison } from "@/components/CompetitorComparison";
import { Testimonials } from "@/components/Testimonials";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { parseProduct } from "@/utils/supabase-helpers";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart } from "lucide-react";

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

  return (
    <div className="min-h-screen pt-[96px] md:pt-[120px]">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <ProductGallery media={product.media || []} productName={product.name} />
          
          <div className="flex flex-col gap-6">
            <h1 className="text-4xl font-bold">{product.name}</h1>
            <p className="text-gray-600">{product.description}</p>
            
            <div className="text-3xl font-bold">
              ${product.price.toFixed(2)}
            </div>

            <div className="flex flex-col gap-4">
              <Button className="w-full" size="lg">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button variant="outline" className="w-full" size="lg">
                <Heart className="mr-2 h-5 w-5" />
                Add to Wishlist
              </Button>
            </div>

            {product.specifications && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Specifications</h3>
                <dl className="space-y-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key}>
                      <dt className="font-medium text-gray-600">{key}</dt>
                      <dd className="mt-1">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>

        <Features />
        <GameChanger />
        <CompetitorComparison />
        <Testimonials />
      </div>
    </div>
  );
};

export default ProductDetail;