import { motion } from "framer-motion";
import { SustainabilityContent } from "@/types/content-blocks";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface SustainabilityCTAProps {
  content: SustainabilityContent;
}

export const SustainabilityCTA = ({ content }: SustainabilityCTAProps) => {
  return (
    <section className="py-16 bg-gradient-to-b from-green-50 to-white">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {content.title}
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {content.description}
          </p>
          <Link to={content.buttonLink || '#'}>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              {content.buttonText || 'Learn More'}
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};