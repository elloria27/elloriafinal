import { motion } from "framer-motion";
import { Leaf, Recycle, Percent } from "lucide-react";

const stats = [
  {
    icon: <Recycle className="w-8 h-8" />,
    title: "72% Recyclable",
    description: "Materials used in our products"
  },
  {
    icon: <Percent className="w-8 h-8" />,
    title: "25% Reduction",
    description: "In packaging waste"
  },
  {
    icon: <Leaf className="w-8 h-8" />,
    title: "Eco-Friendly",
    description: "Production processes"
  }
];

export const Sustainability = () => {
  return (
    <section className="py-20 bg-accent-green/10">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our Commitment to Sustainability
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're dedicated to reducing our environmental impact while providing premium products.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <div className="text-primary mb-4">{stat.icon}</div>
              <h3 className="text-2xl font-bold mb-2">{stat.title}</h3>
              <p className="text-gray-600">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};