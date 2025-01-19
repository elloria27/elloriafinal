import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-b from-secondary/10 to-white">
      <div className="container px-4 py-16 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1 text-center lg:text-left">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold mb-6"
          >
            Experience Comfort, <br />
            <span className="text-primary">Confidence</span>, and <br />
            <span className="text-secondary">Sustainability</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-600 mb-8"
          >
            Ultra-thin protection made with eco-friendly materials, 
            designed for your comfort and the planet's future.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white mr-4">
              Shop Now
            </Button>
            <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
              Learn More
            </Button>
          </motion.div>
        </div>
        <motion.div 
          className="flex-1"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img 
            src="/lovable-uploads/5064d341-66ba-411d-8a91-8781d383f256.png"
            alt="Elloria Products"
            className="w-full max-w-[500px] mx-auto animate-float"
          />
        </motion.div>
      </div>
    </section>
  );
};