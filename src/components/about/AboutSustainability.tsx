import { motion } from "framer-motion";
import { Leaf, Recycle, TreePine } from "lucide-react";
import { AboutSustainabilityContent } from "@/types/content-blocks";

interface AboutSustainabilityProps {
  content?: AboutSustainabilityContent;
}

export const AboutSustainability = ({ content = {} }: AboutSustainabilityProps) => {
  console.log("AboutSustainability content received:", content);
  
  const {
    title = "Our Commitment to Sustainability",
    description = "We believe in creating products that care for both you and our planet. Our sustainable practices are at the core of everything we do.",
    stats = [
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
    ]
  } = content;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Leaf":
        return <Leaf className="w-8 h-8 text-primary" />;
      case "Recycle":
        return <Recycle className="w-8 h-8 text-primary" />;
      case "TreePine":
        return <TreePine className="w-8 h-8 text-primary" />;
      default:
        return <Leaf className="w-8 h-8 text-primary" />;
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">{title}</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-white p-8 rounded-xl shadow-lg"
            >
              <div className="flex justify-center mb-6">
                {getIcon(stat.icon)}
              </div>
              <h3 className="text-4xl font-bold text-primary mb-2">{stat.value}</h3>
              <h4 className="text-xl font-semibold mb-4">{stat.label}</h4>
              <p className="text-gray-600">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};