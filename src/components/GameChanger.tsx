import { motion } from "framer-motion";
import { Droplets, Leaf, Heart } from "lucide-react";
import { GameChangerContent, FeatureItem } from "@/types/content-blocks";

interface GameChangerProps {
  content?: GameChangerContent;
}

export const GameChanger = ({ content }: GameChangerProps) => {
  const defaultFeatures: FeatureItem[] = [
    {
      icon: "Droplets",
      title: "Superior Absorption",
      description: "Up to 600ml absorption capacity for overnight protection",
      detail: "Advanced multi-layer core technology ensures quick absorption and complete leak protection"
    },
    {
      icon: "Leaf",
      title: "Eco-Friendly Materials",
      description: "72% recyclable materials for a greener planet",
      detail: "Sustainable sourcing and biodegradable components reduce environmental impact"
    },
    {
      icon: "Heart",
      title: "Ultimate Comfort",
      description: "Soft, breathable backsheet for irritation-free comfort",
      detail: "Dermatologically tested materials ensure gentle care for sensitive skin"
    }
  ];

  const features = content?.features || defaultFeatures;
  
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Droplets":
        return <Droplets className="w-12 h-12" />;
      case "Leaf":
        return <Leaf className="w-12 h-12" />;
      case "Heart":
        return <Heart className="w-12 h-12" />;
      default:
        return <Droplets className="w-12 h-12" />;
    }
  };

  return (
    <section className="py-24 bg-primary text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTYiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgNTYgMTAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxnIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiLz48L2c+PC9zdmc+')] opacity-10" />
      
      <div className="container px-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {content?.title || "Why Elloria Pads Are a"}{" "}
            <span className="text-secondary">
              {content?.subtitle || "Game-Changer"}
            </span>
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            {content?.description || "Experience the perfect blend of innovation and comfort with features that set us apart"}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="relative group"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 h-full transform transition-all duration-300 group-hover:translate-y-[-8px] group-hover:bg-white/20">
                <motion.div 
                  initial={{ scale: 1 }}
                  whileHover={{ 
                    scale: 1.15,
                    filter: "drop-shadow(0 0 8px rgba(255, 189, 200, 0.6))"
                  }}
                  transition={{ 
                    type: "spring",
                    stiffness: 300,
                    damping: 15
                  }}
                  className="mb-6 text-secondary relative"
                >
                  {getIcon(feature.icon)}
                </motion.div>
                
                <h3 className="text-2xl font-semibold mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-white/80 mb-4">
                  {feature.description}
                </p>
                
                <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-300">
                  <p className="text-white text-sm pt-4 border-t border-white/20">
                    {feature.detail}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};