import { motion } from "framer-motion";
import { Leaf, Recycle, TreePine } from "lucide-react";
import { SustainabilityContent } from "@/types/content-blocks";

interface AboutSustainabilityProps {
  content?: SustainabilityContent;
}

export const AboutSustainability = ({ content }: AboutSustainabilityProps) => {
  console.log("AboutSustainability content received:", content);

  const defaultStats = [
    {
      icon: "Leaf",
      value: "72%",
      label: "Recyclable Materials",
      description: "Our products are made with eco-friendly, biodegradable materials"
    },
    {
      icon: "Recycle",
      value: "85%",
      label: "Packaging Reduction",
      description: "Minimized packaging waste through innovative design"
    },
    {
      icon: "TreePine",
      value: "50K+",
      label: "Trees Planted",
      description: "Contributing to global reforestation efforts"
    }
  ];

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "Leaf":
        return <Leaf className="w-8 h-8" />;
      case "Recycle":
        return <Recycle className="w-8 h-8" />;
      case "TreePine":
        return <TreePine className="w-8 h-8" />;
      default:
        return <Leaf className="w-8 h-8" />;
    }
  };

  // Ensure stats are properly formatted and logged
  const processedStats = content?.stats && Array.isArray(content.stats) && content.stats.length > 0
    ? content.stats.map(stat => ({
        icon: stat.icon || "Leaf",
        value: stat.value || "0",
        label: stat.label || "Stat",
        description: stat.description || "Description"
      }))
    : defaultStats;

  console.log("Content received in AboutSustainability:", content);
  console.log("Processed stats:", processedStats);

  return (
    <section className="py-20 bg-gradient-to-b from-white to-accent-purple/5">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">
            {content?.title || "Our Commitment to Sustainability"}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {content?.description || 
              "We believe in creating products that care for both you and our planet. Our sustainable practices are at the core of everything we do."}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {processedStats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="text-primary mb-6">{renderIcon(stat.icon)}</div>
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