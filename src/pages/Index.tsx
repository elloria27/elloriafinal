import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { StoreBrands } from "@/components/StoreBrands";
import { Sustainability } from "@/components/Sustainability";
import { ProductCarousel } from "@/components/ProductCarousel";
import { CompetitorComparison } from "@/components/CompetitorComparison";
import { Testimonials } from "@/components/Testimonials";
import { BlogPreview } from "@/components/BlogPreview";
import { Newsletter } from "@/components/Newsletter";
import { GameChanger } from "@/components/GameChanger";

const Index = () => {
  return (
    <main className="flex-grow">
      <Hero content={{
        title: "Redefining Comfort, Confidence, and Sustainability",
        subtitle: "Experience ultra-thin, eco-friendly feminine care made for modern women.",
        videoUrl: "https://elloria.ca/Video_290mm.mp4"
      }} />
      <Features content={{
        title: "Why Choose Elloria?",
        subtitle: "Experience the perfect blend of comfort, protection, and sustainability"
      }} />
      <GameChanger />
      <StoreBrands />
      <Sustainability />
      <ProductCarousel />
      <CompetitorComparison />
      <Testimonials />
      <BlogPreview />
      <Newsletter />
    </main>
  );
};

export default Index;