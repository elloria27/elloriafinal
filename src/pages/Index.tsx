import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { ProductCarousel } from "@/components/ProductCarousel";
import { StoreBrands } from "@/components/StoreBrands";
import { GameChanger } from "@/components/GameChanger";
import { Sustainability } from "@/components/Sustainability";
import { CompetitorComparison } from "@/components/CompetitorComparison";
import { Testimonials } from "@/components/Testimonials";
import { Newsletter } from "@/components/Newsletter";

const Index = () => {
  return (
    <div className="flex flex-col gap-16 md:gap-32">
      <Hero />
      <Features />
      <ProductCarousel />
      <StoreBrands />
      <GameChanger />
      <Sustainability />
      <CompetitorComparison />
      <Testimonials />
      <Newsletter />
    </div>
  );
};

export default Index;