import { motion } from "framer-motion";
import { SustainabilityHeroContent } from "@/types/sustainability";

interface SustainabilityHeroProps {
  content: SustainabilityHeroContent;
}

export const SustainabilityHero = ({ content }: SustainabilityHeroProps) => {
  return (
    <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center bg-gradient-to-b from-accent-green/30 to-white overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src={content.background_image}
          alt="Nature background"
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container relative z-10 text-center px-4"
      >
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          <span className="bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
            {content.title}
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
          {content.description}
        </p>
      </motion.div>
    </section>
  );
};