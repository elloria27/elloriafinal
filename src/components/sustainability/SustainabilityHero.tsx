import { motion } from "framer-motion";
import { SustainabilityContent } from "@/types/content-blocks";
import { Button } from "@/components/ui/button";

interface SustainabilityHeroProps {
  content: SustainabilityContent;
}

export const SustainabilityHero = ({ content }: SustainabilityHeroProps) => {
  return (
    <section className="relative min-h-[600px] flex items-center">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        {content.backgroundImage && (
          <img 
            src={content.backgroundImage} 
            alt="Background" 
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-green-500/10 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="container px-4 relative z-10">
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
          {content.buttonText && (
            <Button 
              size="lg"
              className="bg-primary hover:bg-primary/90 text-white"
              onClick={() => window.location.href = content.buttonLink || '/shop'}
            >
              {content.buttonText}
            </Button>
          )}
        </motion.div>
      </div>
    </section>
  );
};