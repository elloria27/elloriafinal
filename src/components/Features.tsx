import { motion } from "framer-motion";
import { Droplet, Leaf, Heart, Package, Shield, Recycle } from "lucide-react";

const features = [
  {
    icon: <Droplet className="w-8 h-8" />,
    title: "Superior Absorption",
    description: "Advanced technology for complete protection and confidence"
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Ultra Protection",
    description: "Innovative design for maximum security and comfort"
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Gentle Care",
    description: "Hypoallergenic materials for sensitive skin"
  },
  {
    icon: <Package className="w-8 h-8" />,
    title: "Smart Packaging",
    description: "Convenient and discreet packaging design"
  },
  {
    icon: <Leaf className="w-8 h-8" />,
    title: "Eco-Friendly",
    description: "Sustainable materials that care for our planet"
  },
  {
    icon: <Recycle className="w-8 h-8" />,
    title: "Recyclable",
    description: "Responsible disposal options for a better future"
  }
];

export const Features = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-white via-accent-purple/5 to-white">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Why Choose Elloria?
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Experience the perfect blend of comfort, protection, and sustainability
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="text-primary mb-6 bg-primary/5 w-16 h-16 rounded-xl flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};