
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const CatalogPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Cover Slide */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-elloria-pink">
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center z-10 px-4"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-montserrat text-4xl md:text-6xl text-elloria-blue mb-4"
          >
            Discover the Future of Comfort & Protection
          </motion.h1>
          
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="font-lora text-xl md:text-2xl text-elloria-blue/80 mb-8"
          >
            Ultra-thin. Breathable. Reliable.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
          >
            <Button
              variant="default"
              size="lg"
              className="bg-elloria-gold hover:bg-elloria-gold/90 text-white font-poppins"
            >
              Start Exploring
            </Button>
          </motion.div>
        </motion.div>

        {/* Floating petals animation */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-white/20 rounded-full"
              animate={{
                x: ["0%", "100%", "0%"],
                y: ["0%", "50%", "0%"],
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="w-8 h-8 text-elloria-blue/60" />
        </motion.div>
      </section>

      {/* About Slide */}
      <section className="min-h-screen bg-white py-20">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="font-montserrat text-3xl md:text-5xl text-elloria-blue mb-4">
              Designed for You. Inspired by Comfort.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Premium Materials",
                description: "Hypoallergenic technology for sensitive skin"
              },
              {
                title: "Trusted Worldwide",
                description: "Thousands of satisfied customers globally"
              },
              {
                title: "Widely Available",
                description: "Find us on Amazon, Walmart & more"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-elloria-lilac/30 p-8 rounded-lg text-center"
              >
                <h3 className="font-poppins text-xl text-elloria-blue mb-4">
                  {feature.title}
                </h3>
                <p className="font-lora text-elloria-blue/80">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional slides will be added here */}
    </div>
  );
};

export default CatalogPage;
