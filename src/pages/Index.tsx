import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { StoreBrands } from "@/components/StoreBrands";
import { Sustainability } from "@/components/Sustainability";
import { ProductCarousel } from "@/components/ProductCarousel";
import { Testimonials } from "@/components/Testimonials";
import { BlogPreview } from "@/components/BlogPreview";
import { Newsletter } from "@/components/Newsletter";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <StoreBrands />
      <Sustainability />
      <ProductCarousel />
      <Testimonials />
      <BlogPreview />
      <Newsletter />
    </main>
  );
};

export default Index;