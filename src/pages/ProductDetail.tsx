import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Product } from "@/types/product";
import { fetchProductById } from "@/api/products";
import { Features } from "@/components/Features";
import { ProductCarousel } from "@/components/ProductCarousel";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const getProduct = async () => {
      const fetchedProduct = await fetchProductById(id);
      setProduct(fetchedProduct);
    };

    getProduct();
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-4xl font-bold">{product.name}</h1>
      <p className="text-lg">{product.description}</p>
      <ProductCarousel content={product.carouselContent} />
      <Features 
        features={[
          {
            icon: "Shield",
            title: "Superior Protection",
            description: "Innovative design for maximum security"
          },
          {
            icon: "Leaf",
            title: "Eco-Friendly",
            description: "Sustainable materials that care for our planet"
          },
          {
            icon: "Heart",
            title: "Comfort",
            description: "Designed for ultimate comfort"
          },
        ]}
        title="Product Features"
        subtitle="Discover what makes our products special"
      />
    </div>
  );
};

export default ProductDetail;
