import { motion } from "framer-motion";
import { TreePine, Recycle, Factory } from "lucide-react";
import { SustainabilityMaterialsContent } from "@/types/sustainability";

interface SustainabilityMaterialsProps {
  content: SustainabilityMaterialsContent;
}

export const SustainabilityMaterials = ({ content }: SustainabilityMaterialsProps) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'TreePine':
        return <TreePine className="w-6 h-6" />;
      case 'Recycle':
        return <Recycle className="w-6 h-6" />;
      case 'Factory':
        return <Factory className="w-6 h-6" />;
      default:
        return null;
    }
  };

  return (
    <section className="py-20 bg-accent-green/10">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6">{content.title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {content.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {content.materials.map((material, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              <div className="text-primary mb-4">
                {getIcon(material.icon)}
              </div>
              <h3 className="text-lg font-semibold mb-2">{material.title}</h3>
              <p className="text-gray-600">{material.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};