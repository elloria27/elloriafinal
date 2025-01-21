import { motion } from "framer-motion";
import { Leaf, Recycle, TreePine } from "lucide-react";

const stats = [
  {
    icon: <Leaf className="w-8 h-8" />,
    value: "72%",
    label: "Recyclable Materials",
    description: "Our products are made with eco-friendly, biodegradable materials"
  },
  {
    icon: <Recycle className="w-8 h-8" />,
    value: "85%",
    label: "Packaging Reduction",
    description: "Minimized packaging waste through innovative design"
  },
  {
    icon: <TreePine className="w-8 h-8" />,
    value: "50K+",
    label: "Trees Planted",
    description: "Contributing to global reforestation efforts"
  }
];

export const AboutSustainability = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-accent-purple/5">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Our Commitment to Sustainability</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We believe in creating products that care for both you and our planet. 
            Our sustainable practices are at the core of everything we do.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="text-primary mb-6">{stat.icon}</div>
              <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <h3 className="text-xl font-semibold mb-3">{stat.label}</h3>
              <p className="text-gray-600">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};