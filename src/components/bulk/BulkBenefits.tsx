
import { motion } from "framer-motion";
import { BulkBenefitsContent } from "@/types/content-blocks";
import { Package, Shield, Clock } from "lucide-react";

const iconMap = {
  Package,
  Shield,
  Clock,
};

interface BulkBenefitsProps {
  content?: BulkBenefitsContent;
}

export const BulkBenefits = ({ content }: BulkBenefitsProps) => {
  if (!content) return null;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-light text-center mb-12"
        >
          {content.title || "Why Choose Bulk Orders?"}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.features?.map((feature, index) => {
            const IconComponent = feature.icon ? iconMap[feature.icon as keyof typeof iconMap] : Package;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
              >
                {IconComponent && (
                  <div className="mb-4">
                    <IconComponent className="h-8 w-8 text-primary" />
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
