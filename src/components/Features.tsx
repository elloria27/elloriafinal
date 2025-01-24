import { motion } from "framer-motion";
import { Droplet, Leaf, Heart, Package, Shield, Recycle } from "lucide-react";
import { LucideIcon } from "lucide-react";

// Define the type for a single feature
interface Feature {
  icon: string;
  title: string;
  description: string;
}

// Define the props interface
interface FeaturesProps {
  features?: Feature[];
}

// Map of icon names to components
const iconMap: { [key: string]: LucideIcon } = {
  droplet: Droplet,
  leaf: Leaf,
  heart: Heart,
  package: Package,
  shield: Shield,
  recycle: Recycle
};

const defaultFeatures = [
  {
    icon: "droplet",
    title: "Superior Absorption",
    description: "Advanced technology for complete protection and confidence"
  },
  {
    icon: "shield",
    title: "Ultra Protection",
    description: "Innovative design for maximum security and comfort"
  },
  {
    icon: "heart",
    title: "Gentle Care",
    description: "Hypoallergenic materials for sensitive skin"
  },
  {
    icon: "package",
    title: "Smart Packaging",
    description: "Convenient and discreet packaging design"
  },
  {
    icon: "leaf",
    title: "Eco-Friendly",
    description: "Sustainable materials that care for our planet"
  },
  {
    icon: "recycle",
    title: "Recyclable",
    description: "Responsible disposal options for a better future"
  }
];

export const Features = ({ features = defaultFeatures }: FeaturesProps) => {
  return (
    <section className="py-32 bg-gradient-to-b from-white via-accent-purple/5 to-white">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Why Choose Elloria?
          </h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            Experience the perfect blend of comfort, protection, and sustainability
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon.toLowerCase()] || Package;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white p-10 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div className="text-primary mb-8 bg-primary/5 w-20 h-20 rounded-2xl flex items-center justify-center transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                  <IconComponent className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};