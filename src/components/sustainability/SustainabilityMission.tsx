import { motion } from "framer-motion";
import { Leaf, PackageCheck, Globe } from "lucide-react";
import { SustainabilityMissionContent } from "@/types/sustainability";

interface SustainabilityMissionProps {
  content: SustainabilityMissionContent;
}

export const SustainabilityMission = ({ content }: SustainabilityMissionProps) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Leaf':
        return <Leaf className="w-8 h-8" />;
      case 'PackageCheck':
        return <PackageCheck className="w-8 h-8" />;
      case 'Globe':
        return <Globe className="w-8 h-8" />;
      default:
        return null;
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-4xl font-bold mb-6">{content.title}</h2>
          <p className="text-gray-600 mb-12">{content.description}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="text-primary mb-4">
                {getIcon(stat.icon)}
              </div>
              <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
              <h3 className="text-xl font-semibold mb-3">{stat.label}</h3>
              <p className="text-gray-600">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};