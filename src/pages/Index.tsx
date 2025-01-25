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
  return (
    <>
      <Header />
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen overflow-hidden pt-16"
      >
        <Hero content={{}} />
        <ElevatingEssentials />
        <GameChanger />
        <Features content={{}} />
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