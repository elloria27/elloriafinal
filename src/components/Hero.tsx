import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { HeroContent } from "@/types/content-blocks";

interface HeroProps {
  content: HeroContent;
}

export const Hero = ({ content }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/30 via-accent-peach/20 to-accent-green/20 z-0" />
      
      {content.backgroundImage && (
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-50"
          style={{ backgroundImage: `url(${content.backgroundImage})` }}
        />
      )}
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {content.title}
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            {content.subtitle}
          </p>
          
          {content.primaryButtonText && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8">
                <Link to={content.primaryButtonLink || "/shop"}>
                  {content.primaryButtonText}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              {content.secondaryButtonText && (
                <Button 
                  asChild
                  size="lg"
                  variant="outline"
                  className="text-lg px-8"
                >
                  <Link to={content.secondaryButtonLink || "/about"}>
                    {content.secondaryButtonText}
                  </Link>
                </Button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};