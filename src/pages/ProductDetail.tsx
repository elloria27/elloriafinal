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
    <div className="min-h-screen pt-[96px] md:pt-[120px]"> {/* Increased padding-top for better spacing */}
      <ProductGallery media={product.media || []} productName={product.name} />
      <Features />
      <GameChanger />
      <CompetitorComparison />
      <Testimonials />
    </div>
  );
};

export default ProductDetail;