import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { StoreBrands } from "@/components/StoreBrands";
import { Sustainability } from "@/components/Sustainability";
import { ProductCarousel } from "@/components/ProductCarousel";
import { CompetitorComparison } from "@/components/CompetitorComparison";
import { Testimonials } from "@/components/Testimonials";
import { BlogPreview } from "@/components/BlogPreview";
import { Newsletter } from "@/components/Newsletter";
import { Header } from "@/components/Header";
import { ElevatingEssentials } from "@/components/ElevatingEssentials";
import { GameChanger } from "@/components/GameChanger";
import { motion } from "framer-motion";

const Index = () => {
  const heroContent = {
    title: "Redefining Comfort, Confidence, and Sustainability",
    subtitle: "Experience ultra-thin, eco-friendly feminine care made for modern women.",
    videoUrl: "https://elloria.ca/Video_290mm.mp4"
  };

  const featuresContent = {
    title: "Elevating Everyday Essentials",
    subtitle: "Experience the perfect harmony of comfort and sustainability with Elloria's innovative feminine care products.",
    features: [
      {
        icon: "Shrink",
        title: "Ultra-thin Design",
        description: "Advanced technology compressed into an ultra-thin profile for maximum discretion and comfort"
      },
      {
        icon: "Shield",
        title: "Hypoallergenic Materials",
        description: "Gentle, skin-friendly materials designed for sensitive skin and ultimate comfort"
      },
      {
        icon: "Droplets",
        title: "High Absorption",
        description: "Superior absorption technology keeps you confident and protected throughout your day"
      },
      {
        icon: "Leaf",
        title: "Recyclable Components",
        description: "Eco-conscious materials that minimize environmental impact without compromising performance"
      }
    ]
  };

  return (
    <>
      <Header />
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen overflow-hidden pt-16"
      >
        <Hero content={heroContent} />
        <ElevatingEssentials />
        <GameChanger />
        <Features content={featuresContent} />
        <StoreBrands />
        <Sustainability />
        <ProductCarousel />
        <CompetitorComparison />
        <Testimonials />
        <BlogPreview />
        <Newsletter />
      </motion.main>
    </>
  );
};

export default Index;