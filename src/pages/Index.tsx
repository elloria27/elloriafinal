import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { ProductCarousel } from "@/components/ProductCarousel";
import { Newsletter } from "@/components/Newsletter";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <ProductCarousel />
      <Newsletter />
    </main>
  );
};

export default Index;