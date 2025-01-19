import { motion } from "framer-motion";
import { Leaf, Shield, Heart } from "lucide-react";

const features = [
  {
    icon: <Leaf className="w-8 h-8" />,
    title: "Eco-Friendly",
    description: "Made with sustainable materials that care for our planet"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Ultra Protection",
    description: "Advanced absorption technology for complete confidence"
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Comfort First",
    description: "Ultra-thin design for maximum comfort throughout your day"
  }
];

export const Features = () => {
  return (
    <section className="py-20 bg-accent-purple/10">
      <div className="container px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          Why Choose Elloria?
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="text-primary mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};