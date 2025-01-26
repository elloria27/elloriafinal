import { FeaturesProps } from "@/types/content-blocks";
import { motion } from "framer-motion";
import { Droplets, Shield, Heart, Package, Leaf, Recycle } from "lucide-react";

const iconMap: { [key: string]: any } = {
  Droplets,
  Shield,
  Heart,
  Package,
  Leaf,
  Recycle
};

export const Features = ({ content }: FeaturesProps) => {
  const defaultFeatures = [
    {
      icon: "Droplets",
      title: "Superior Absorption",
      description: "Advanced technology for complete protection and confidence"
    },
    {
      icon: "Shield",
      title: "Ultra Protection",
      description: "Innovative design for maximum security and comfort"
    },
    {
      icon: "Heart",
      title: "Gentle Care",
      description: "Hypoallergenic materials for sensitive skin"
    },
    {
      icon: "Package",
      title: "Smart Packaging",
      description: "Convenient and discreet packaging design"
    },
    {
      icon: "Leaf",
      title: "Eco-Friendly",
      description: "Sustainable materials that care for our planet"
    },
    {
      icon: "Recycle",
      title: "Recyclable",
      description: "Responsible disposal options for a better future"
    }
  ];

  const features = content?.features || defaultFeatures;

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
            {content?.title || "Why Choose Elloria?"}
          </h2>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto">
            {content?.subtitle || "Experience the perfect blend of comfort, protection, and sustainability"}
          </p>
          {content?.description && (
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mt-4">
              {content.description}
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon] || Droplets;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                  className="mb-6"
                >
                  <div className="w-16 h-16 bg-primary/5 rounded-2xl flex items-center justify-center transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                </motion.div>
                <h3 className="text-2xl font-semibold mb-4 text-gray-800">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            )}
          )}
        </div>
      </div>
    </section>
  );
};