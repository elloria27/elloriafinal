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
  const heroContent = {
    title: "Redefining Comfort, Confidence, and Sustainability",
    subtitle: "Experience ultra-thin, eco-friendly feminine care made for modern women.",
    videoUrl: "https://elloria.ca/Video_290mm.mp4"
  };

  return (
    <div className="flex flex-col gap-16 md:gap-32">
      <Hero content={heroContent} />
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