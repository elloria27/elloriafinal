import { FeaturesProps } from "@/types/content-blocks";
import { motion } from "framer-motion";
import { Shrink, Shield, Droplets, Leaf } from "lucide-react";

const iconMap: { [key: string]: any } = {
  Shrink,
  Shield,
  Droplets,
  Leaf
};

export const Features = ({ content }: FeaturesProps) => {
  const defaultFeatures = [
    {
      icon: "Shrink",
      title: "Ultra-thin Design",
      description: "Advanced technology compressed into an ultra-thin profile for maximum discretion and comfort"
    },
    {
      icon: "Shield",
      title: "Hypoallergenic Materials",
      description: "Gentle, skin-friendly materials designed for sensitive skin and ultimate comfort"
    },
    {
      icon: "Droplets",
      title: "High Absorption",
      description: "Superior absorption technology keeps you confident and protected throughout your day"
    },
    {
      icon: "Leaf",
      title: "Recyclable Components",
      description: "Eco-conscious materials that minimize environmental impact without compromising performance"
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
            {content?.title || "Elevating Everyday Essentials"}
          </h2>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto">
            {content?.subtitle || "Experience the perfect harmony of comfort and sustainability with Elloria's innovative feminine care products."}
          </p>
          {content?.description && (
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mt-4">
              {content.description}
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon] || Shrink;
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