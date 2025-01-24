import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export const BlogHero = () => {
  const scrollToInstagram = () => {
    const element = document.getElementById('instagram-feed');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-[80vh] overflow-hidden">
      <div 
        className="absolute inset-0 bg-[url('/lovable-uploads/ba8d9a77-42de-4ec9-8666-53e795a2673c.png')] bg-cover bg-center"
        style={{ backgroundAttachment: 'fixed' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative h-full flex flex-col items-center justify-center text-center text-white px-4"
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl">
          Stay Inspired with Elloria: News, Insights, and Stories
        </h1>
        <p className="text-lg md:text-xl mb-12 max-w-2xl">
          Explore the latest updates on feminine care, sustainability, and empowering women
        </p>
        <Button 
          onClick={scrollToInstagram}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-white group"
        >
          Start Exploring
          <ArrowDown className="ml-2 w-4 h-4 group-hover:translate-y-1 transition-transform" />
        </Button>
      </motion.div>
    </section>
  );
};