import { motion } from "framer-motion";
import { Leaf, Recycle, Percent, Package, Factory } from "lucide-react";
import { SustainabilityContent } from "@/types/content-blocks";

interface SustainabilityProps {
  content?: SustainabilityContent;
}

export const Sustainability = ({ content }: SustainabilityProps) => {
  console.log("Sustainability content received:", content);
  
  const defaultContent: SustainabilityContent = {
    title: "Our Commitment to Sustainability",
    description: "We're dedicated to reducing our environmental impact while delivering premium products through innovative, sustainable practices.",
    stats: [
      {
        icon: "Recycle",
        title: "55% Recyclable",
        description: "Materials used in our products",
        color: "bg-accent-green"
      },
      {
        icon: "Package",
        title: "85% Reduction",
        description: "In packaging waste through innovative design",
        color: "bg-accent-purple"
      },
      {
        icon: "Factory",
        title: "Eco-Production",
        description: "Sustainable sourcing and manufacturing",
        color: "bg-accent-peach"
      }
    ],
    timelineItems: [
      "Sustainable Material Sourcing",
      "Eco-Friendly Manufacturing",
      "Recyclable Packaging",
      "Low-Impact Delivery"
    ]
  };

  const finalContent: SustainabilityContent = {
    ...defaultContent,
    ...(content || {})
  };
  
  console.log("Final content being used:", finalContent);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-accent-green/10 to-white">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-green-600">
            {finalContent.title}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
            {finalContent.description}
          </p>
        </motion.div>

        <div className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {(finalContent.stats || defaultContent.stats).map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                className={`${stat.color}/10 p-6 md:p-8 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 backdrop-blur-sm`}
              >
                <motion.div 
                  className="text-primary mb-4 md:mb-6"
                  whileHover={{ 
                    scale: 1.1,
                    filter: "brightness(1.2)",
                    transition: { duration: 0.2 }
                  }}
                >
                  {(() => {
                    switch (stat.icon) {
                      case "Recycle":
                        return <Recycle className="w-8 h-8 md:w-10 md:h-10" />;
                      case "Package":
                        return <Package className="w-8 h-8 md:w-10 md:h-10" />;
                      case "Factory":
                        return <Factory className="w-8 h-8 md:w-10 md:h-10" />;
                      default:
                        return <Leaf className="w-8 h-8 md:w-10 md:h-10" />;
                    }
                  })()}
                </motion.div>
                <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">{stat.title}</h3>
                <p className="text-gray-600 text-sm md:text-base">{stat.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-8">
            {(finalContent.timelineItems || defaultContent.timelineItems).map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <span className="text-gray-700 font-medium text-sm md:text-base">{item}</span>
                {index < (finalContent.timelineItems || defaultContent.timelineItems).length - 1 && (
                  <div className="hidden md:block w-12 h-0.5 bg-primary/20" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};