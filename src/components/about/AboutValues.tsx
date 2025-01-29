import { motion } from "framer-motion";
import { Heart, Leaf, Shield, Award } from "lucide-react";

const values = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Hypoallergenic Care",
    description: "Gentle on sensitive skin with premium materials"
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Trusted by Thousands",
    description: "Join our community of satisfied customers"
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: "Innovative Design",
    description: "Advanced technology for maximum comfort"
  },
  {
    icon: <Leaf className="w-8 h-8" />,
    title: "Sustainable Practices",
    description: "Eco-friendly materials and processes"
  }
];

export const AboutValues = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-white via-accent-purple/5 to-white">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Why Choose Elloria?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We combine innovation with care to create products that exceed expectations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-3xl transform -rotate-6 group-hover:rotate-0 transition-transform duration-300" />
              <div className="relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 transform -rotate-6 group-hover:rotate-0 transition-transform duration-300">
                  <div className="text-primary">{value.icon}</div>
                </div>
                <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};