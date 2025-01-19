import { motion } from "framer-motion";

const brands = [
  { name: "Amazon", logo: "/lovable-uploads/amazon.png" },
  { name: "Walmart", logo: "/lovable-uploads/walmart.png" },
  { name: "Costco", logo: "/lovable-uploads/costco.png" },
  { name: "Elloria", logo: "/lovable-uploads/elloria.png" }
];

export const StoreBrands = () => {
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
          Available At
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="w-32 h-32 flex items-center justify-center p-4 rounded-lg bg-accent-purple/5 hover:bg-accent-purple/10 transition-colors"
            >
              <img
                src={brand.logo}
                alt={`${brand.name} logo`}
                className="w-full h-full object-contain"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};