import { motion } from "framer-motion";

const brands = [
  { name: "Amazon", logo: "/lovable-uploads/amazon.png" },
  { name: "Walmart", logo: "/lovable-uploads/walmart.png" },
  { name: "Costco", logo: "/lovable-uploads/costco.png" },
  { name: "Elloria", logo: "/lovable-uploads/elloria.png" }
];

export const StoreBrands = () => {
  return (
    <section className="w-full py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Available At</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Find Elloria products at your favorite retailers
          </p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="w-40 h-40 flex items-center justify-center p-6 rounded-2xl bg-accent-purple/5 hover:bg-accent-purple/10 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
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