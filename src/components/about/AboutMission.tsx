import { motion } from "framer-motion";
import { Leaf, Sparkles, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MissionContent } from "@/types/content-blocks";

interface AboutMissionProps {
  content?: MissionContent;
}

const defaultValues = [
  {
    icon: "Leaf",
    title: "Sustainability",
    description: "72% recyclable materials and eco-friendly production processes that protect our planet.",
    color: "bg-accent-green"
  },
  {
    icon: "Sparkles",
    title: "Innovation",
    description: "Advanced absorption technology for unmatched comfort and protection.",
    color: "bg-accent-purple"
  },
  {
    icon: "Heart",
    title: "Empowerment",
    description: "Dedicated to improving women's lives and health globally through better care.",
    color: "bg-accent-peach"
  }
];

export const AboutMission = ({ content: propContent }: AboutMissionProps) => {
  const [content, setContent] = useState<MissionContent | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data: blocks, error } = await supabase
          .from('content_blocks')
          .select('*')
          .eq('type', 'about_mission')
          .single();

        if (error) {
          console.error("Error fetching mission content:", error);
          return;
        }

        console.log("Fetched mission block:", blocks);

        const blockContent = blocks?.content as MissionContent;
        
        if (blockContent) {
          setContent({
            title: blockContent.title || "Our Mission & Values",
            subtitle: blockContent.subtitle || "We're committed to creating innovative solutions that prioritize both women's comfort and environmental sustainability.",
            values: blockContent.values || defaultValues
          });
        }
      } catch (error) {
        console.error("Error in fetchContent:", error);
      }
    };

    if (propContent) {
      setContent(propContent);
    } else {
      fetchContent();
    }
  }, [propContent]);

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "Leaf":
        return <Leaf className="w-8 h-8" />;
      case "Sparkles":
        return <Sparkles className="w-8 h-8" />;
      case "Heart":
        return <Heart className="w-8 h-8" />;
      default:
        return <Leaf className="w-8 h-8" />;
    }
  };

  const displayContent = content || {
    title: "Our Mission & Values",
    subtitle: "We're committed to creating innovative solutions that prioritize both women's comfort and environmental sustainability.",
    values: defaultValues
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
          <h2 className="text-4xl font-bold mb-4">{displayContent.title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {displayContent.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayContent.values.map((value, index) => (
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
                {renderIcon(value.icon)}
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