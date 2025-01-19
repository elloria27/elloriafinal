import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const products = [
  {
    id: 1,
    name: "Ultra-Thin 290mm",
    description: "Perfect for light to medium flow days. Features our innovative ultra-thin design for maximum comfort.",
    image: "/lovable-uploads/0df96e81-8434-4436-b873-45aa9c6814cf.png"
  },
  {
    id: 2,
    name: "Maxi Pads 350mm",
    description: "Ideal for medium to heavy flow days. Enhanced absorption technology for complete confidence.",
    image: "/lovable-uploads/5064d341-66ba-411d-8a91-8781d383f256.png"
  },
  {
    id: 3,
    name: "Overnight 425mm",
    description: "Maximum protection for peaceful nights. Up to 600ml capacity for ultimate security.",
    image: "/lovable-uploads/42c0dc8a-d937-4255-9c12-d484082d26e6.png"
  }
];

export const ProductCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  return (
    <section className="w-full bg-gradient-to-b from-white to-accent-purple/10">
      <div className="w-full px-4 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-5xl font-bold text-center mb-12"
        >
          Our Products
        </motion.h2>
        <div className="relative max-w-7xl mx-auto">
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 h-12 w-12 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white"
            onClick={nextSlide}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
          <div className="overflow-hidden relative min-h-[500px] md:min-h-[600px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="flex flex-col md:flex-row items-center gap-12 max-w-6xl mx-auto px-4">
                  <motion.div 
                    className="w-full md:w-1/2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <img
                      src={products[currentIndex].image}
                      alt={products[currentIndex].name}
                      className="w-full max-w-[400px] mx-auto hover:scale-105 transition-transform duration-300"
                    />
                  </motion.div>
                  <motion.div 
                    className="w-full md:w-1/2 text-center md:text-left"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h3 className="text-3xl md:text-4xl font-bold mb-6">{products[currentIndex].name}</h3>
                    <p className="text-gray-600 text-lg mb-8">{products[currentIndex].description}</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                      <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg">
                        Shop Now
                      </Button>
                      <Button variant="outline" className="border-primary text-primary hover:bg-primary/10 px-8 py-6 text-lg">
                        Learn More
                      </Button>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};