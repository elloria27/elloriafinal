import { motion } from "framer-motion";
import { Leaf, Sparkles, Heart } from "lucide-react";
import { AboutMissionContent } from "@/types/content-blocks";

interface AboutMissionProps {
  content?: AboutMissionContent;
}

const defaultValues = [
  {
    icon: <Leaf className="w-8 h-8" />,
    title: "Sustainability",
    description: "72% recyclable materials and eco-friendly production processes that protect our planet.",
    color: "bg-accent-green"
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "Innovation",
    description: "Advanced absorption technology for unmatched comfort and protection.",
    color: "bg-accent-purple"
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Empowerment",
    description: "Dedicated to improving women's lives and health globally through better care.",
    color: "bg-accent-peach"
  }
];

export const AboutMission = ({ content }: AboutMissionProps) => {
  console.log("AboutMission content received:", content);

  const finalContent = {
    title: content?.title || "Our Mission & Values",
    subtitle: content?.subtitle || "We're committed to creating innovative solutions that prioritize both women's comfort and environmental sustainability.",
    description: content?.description || "",
    values: content?.values ? content.values.map((value, index) => ({
      ...value,
      icon: defaultValues[index]?.icon || <Leaf className="w-8 h-8" />,
      color: defaultValues[index]?.color || "bg-accent-green"
    })) : defaultValues
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-accent-purple/10">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">{finalContent.title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {finalContent.subtitle}
          </p>
          {finalContent.description && (
            <p className="text-gray-600 max-w-2xl mx-auto mt-4">
              {finalContent.description}
            </p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {finalContent.values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`${value.color}/20 p-8 rounded-2xl hover:shadow-xl transition-all duration-300`}
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="text-primary mb-6"
              >
                {value.icon}
              </motion.div>
              <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};