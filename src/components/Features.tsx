import { motion } from "framer-motion";
import { Shrink, Shield, Droplets, Leaf, Heart } from "lucide-react";

interface Feature {
  icon: string;
  title: string;
  description: string;
  detail?: string;
}

interface FeaturesContent {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: Feature[];
}

interface FeaturesProps {
  content: FeaturesContent;
}

const iconMap: { [key: string]: any } = {
  Shrink,
  Shield,
  Droplets,
  Leaf,
  Heart
};

export const Features = ({ content }: FeaturesProps) => {
  const features = content.features || [];

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold mb-6"
          >
            {content.title || "Our Features"}
          </motion.h2>
          {content.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-600"
            >
              {content.subtitle}
            </motion.p>
          )}
          {content.description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-600"
            >
              {content.description}
            </motion.p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const IconComponent = iconMap[feature.icon] || Leaf;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <IconComponent className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
                {feature.detail && (
                  <p className="mt-2 text-sm text-gray-500">{feature.detail}</p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};