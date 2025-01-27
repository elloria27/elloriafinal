import { motion } from "framer-motion";
import { Leaf, Recycle, TreePine } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SustainabilityContent } from "@/types/content-blocks";
import { Json } from "@/integrations/supabase/types";

interface AboutSustainabilityProps {
  content?: SustainabilityContent;
}

export ({ content: propContent }: AboutSustainabilityProps) => {
  const [content, setContent] = useState<SustainabilityContent | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data: blocks, error } = await supabase
          .from('content_blocks')
          .select('*')
          .eq('type', 'about_sustainability')
          .single();

        if (error) {
          console.error("Error fetching sustainability content:", error);
          return;
        }

        console.log("Fetched sustainability block:", blocks);

        // Safely type check and cast the content
        const blockContent = blocks?.content as { stats?: unknown[] };
        
        if (blockContent) {
          setContent({
            title: (blockContent as any).title || "Our Commitment to Sustainability",
            description: (blockContent as any).description || 
              "We believe in creating products that care for both you and our planet. Our sustainable practices are at the core of everything we do.",
            stats: blockContent.stats?.map((stat: any) => ({
              icon: stat.icon || "Leaf",
              value: stat.value || "0",
              label: stat.label || "Stat",
              description: stat.description || "Description"
            })) || defaultStats
          });
        }
      } catch (error) {
        console.error("Error in fetchContent:", error);
      }
    };

    // If content is provided via props, use that instead of fetching
    if (propContent) {
      setContent(propContent);
    } else {
      fetchContent();
    }
  }, [propContent]);

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

  // Use content from state, falling back to default values
  const displayContent = content || {
    title: "Our Commitment to Sustainability",
    description: "We believe in creating products that care for both you and our planet. Our sustainable practices are at the core of everything we do.",
    stats: defaultStats
  };

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
            {displayContent.title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {displayContent.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayContent.stats.map((stat, index) => (
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