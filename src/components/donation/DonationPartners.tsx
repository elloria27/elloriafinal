import { motion } from "framer-motion";

export const DonationPartners = () => {
  const partners = [
    "Local Women's Shelters",
    "Community Health Centers",
    "Educational Institutions",
    "Non-Profit Organizations"
  ];

  return (
    <section className="py-20 bg-accent-purple/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Partners in Change</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We work with trusted organizations to ensure your donations reach those who need them most.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-lg text-center"
            >
              <h3 className="text-xl font-semibold text-gray-900">{partner}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};