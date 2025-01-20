import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen bg-gradient-to-b from-white via-accent-purple/5 to-white py-32 overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="text-center mb-20"
      >
        <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Our Products
        </h2>
        <p className="text-gray-600 text-xl max-w-2xl mx-auto">
          Discover our range of premium products designed for your comfort
        </p>
      </motion.div>

      <motion.div 
        style={{ y, opacity }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4"
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="relative group"
          >
            <div className="relative rounded-3xl overflow-hidden bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/30 via-accent-peach/20 to-accent-green/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="relative z-10"
              >
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/30 via-accent-peach/20 to-accent-green/20 rounded-full blur-2xl" />
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-[300px] object-contain relative z-10"
                  />
                </div>

                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-6 h-24">
                  {product.description}
                </p>

                <div className="flex gap-4 justify-center">
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-white px-6 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Shop Now
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-2 border-primary text-primary hover:bg-primary/10 px-6 py-6 text-lg rounded-full transition-all duration-300"
                  >
                    Learn More
                  </Button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};