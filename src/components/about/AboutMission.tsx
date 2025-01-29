import { motion } from "framer-motion";
import { AboutMissionContent } from "@/types/content-blocks";
import { Leaf, Star, Heart } from "lucide-react";

interface AboutMissionProps {
  content?: AboutMissionContent;
}

export const AboutMission = ({ content = {} }: AboutMissionProps) => {
  const defaultValues = [
    {
      icon: 'Leaf',
      title: "Sustainability",
      description: "72% recyclable materials and eco-friendly production processes that protect our planet."
    },
    {
      icon: 'Star',
      title: "Innovation",
      description: "Advanced absorption technology for unmatched comfort and protection."
    },
    {
      icon: 'Heart',
      title: "Empowerment",
      description: "Dedicated to improving women's lives and health globally through better care."
    }
  ];

  const values = content?.values || defaultValues;

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Leaf':
        return <Leaf className="w-8 h-8" />;
      case 'Star':
        return <Star className="w-8 h-8" />;
      case 'Heart':
        return <Heart className="w-8 h-8" />;
      default:
        return <Heart className="w-8 h-8" />;
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">{content?.title || "Our Mission & Values"}</h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            {content?.description || "We're committed to creating innovative solutions that prioritize both women's comfort and environmental sustainability."}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="text-center"
            >
              <div className="flex justify-center mb-6">
                <div className="text-primary">
                  {getIconComponent(value.icon)}
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};