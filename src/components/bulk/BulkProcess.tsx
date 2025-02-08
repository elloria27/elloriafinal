
import { motion } from "framer-motion";
import { BulkProcessContent } from "@/types/content-blocks";
import { ClipboardList, MessageSquare, Truck } from "lucide-react";

const iconMap = {
  ClipboardList,
  MessageSquare,
  Truck,
};

interface BulkProcessProps {
  content?: BulkProcessContent;
}

export const BulkProcess = ({ content }: BulkProcessProps) => {
  if (!content) return null;

  return (
    <section className="py-16 bg-accent-green/30">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-light text-center mb-12"
        >
          {content.title || "How It Works"}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.features?.map((step, index) => {
            const IconComponent = step.icon ? iconMap[step.icon as keyof typeof iconMap] : ClipboardList;

            return (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <IconComponent className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
