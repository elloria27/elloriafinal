import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const products = [
  {
    id: 1,
    name: "Ultra-Thin 290mm",
    description: "Perfect for light to medium flow days",
    image: "/lovable-uploads/0df96e81-8434-4436-b873-45aa9c6814cf.png"
  },
  {
    id: 2,
    name: "Maxi Pads 350mm",
    description: "Ideal for medium to heavy flow days",
    image: "/lovable-uploads/5064d341-66ba-411d-8a91-8781d383f256.png"
  },
  {
    id: 3,
    name: "Overnight 425mm",
    description: "Maximum protection for peaceful nights",
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
    <section className="py-20 bg-white">
      <div className="container px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          Our Products
        </motion.h2>
        <div className="relative max-w-4xl mx-auto">
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10"
            onClick={nextSlide}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="overflow-hidden relative h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="w-full md:w-1/2">
                    <img
                      src={products[currentIndex].image}
                      alt={products[currentIndex].name}
                      className="w-full max-w-[300px] mx-auto"
                    />
                  </div>
                  <div className="w-full md:w-1/2 text-center md:text-left">
                    <h3 className="text-2xl font-bold mb-4">{products[currentIndex].name}</h3>
                    <p className="text-gray-600 mb-6">{products[currentIndex].description}</p>
                    <Button className="bg-primary hover:bg-primary/90 text-white">
                      Learn More
                    </Button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};