
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Settings } from "lucide-react";

// Define interface for content props
interface HeroContent {
  title?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

interface HomeHeroProps {
  content?: HeroContent;
}

export const HomeHero = ({ content }: HomeHeroProps = {}) => {
  // Default values if content is not provided
  const {
    title = "Elloria: Premium Feminine Care for Modern Women",
    description = "Discover our range of innovative, comfortable, and eco-friendly feminine hygiene products designed with your wellbeing in mind.",
    primaryButtonText = "Explore Products",
    primaryButtonLink = "/shop",
    secondaryButtonText = "Setup Wizard",
    secondaryButtonLink = "/setup"
  } = content || {};

  return (
    <div className="relative overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center py-20 lg:py-32">
          <motion.h1 
            className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {title}
          </motion.h1>
          <motion.p 
            className="mt-6 text-lg leading-8 text-gray-600"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {description}
          </motion.p>
          <motion.div 
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-y-6 gap-x-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button className="w-full sm:w-auto" size="lg" asChild>
              <Link to={primaryButtonLink}>
                {primaryButtonText} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" className="w-full sm:w-auto" size="lg" asChild>
              <Link to={secondaryButtonLink}>
                <Settings className="mr-2 h-4 w-4" />
                {secondaryButtonText}
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
