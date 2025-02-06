import { motion } from "framer-motion";
import { SustainabilityContent } from "@/types/content-blocks";

interface SustainabilityHeroProps {
  content: SustainabilityContent;
}

export const SustainabilityHero = ({ content }: SustainabilityHeroProps) => {
  return (
    <section className="relative py-20 bg-gradient-to-b from-green-50 to-white">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-green-600">
            {content.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8">
            {content.description}
          </p>
        </motion.div>
      </div>
    </section>
  );
};