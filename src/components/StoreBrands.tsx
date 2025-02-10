
import { motion } from "framer-motion";
import { StoreBrandsContent } from "@/types/content-blocks";
import { Json } from "@/integrations/supabase/types";
import { Store } from "lucide-react";

interface StoreBrandsProps {
  content?: StoreBrandsContent;
}

interface Feature {
  title: string;
  description: string;
  detail?: string;
}

export const StoreBrands = ({ content }: StoreBrandsProps) => {
  const defaultContent = {
    title: "Available At",
    subtitle: "Find Elloria products at your favorite retailers",
    brands: [
      { 
        name: "Amazon", 
        logo: "/lovable-uploads/da91a565-7449-472f-a6c3-d6ca71354ab2.png",
        link: "https://www.amazon.ca/s?k=Elloria&ref=bl_dp_s_web_0"
      },
      { 
        name: "Walmart", 
        logo: "/lovable-uploads/3a22d618-c6eb-407b-a8fa-1bb90446c617.png",
        link: "https://www.walmart.ca/en/c/brand/elloria?facet=fulfillment_method%3APickup"
      },
      { 
        name: "Costco", 
        logo: "/lovable-uploads/57fdc254-25ea-4a73-8128-c819f574f1fc.png",
        link: "#"
      },
      { 
        name: "Elloria", 
        logo: "/lovable-uploads/dd7c3f8c-2402-4319-a219-d3ea48e52847.png",
        link: "https://elloria.ca/"
      }
    ]
  };

  const transformFeaturesToBrands = (features: Json[]) => {
    return features.map(feature => {
      const featureObj = feature as unknown as Feature;
      return {
        name: featureObj.title || '',
        logo: featureObj.description || '',
        link: featureObj.detail || '#'
      };
    });
  };

  const finalContent = {
    title: content?.title || defaultContent.title,
    subtitle: content?.subtitle || defaultContent.subtitle,
    brands: Array.isArray(content?.features) 
      ? transformFeaturesToBrands(content.features) 
      : defaultContent.brands
  };

  // Animation variants for container
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Animation variants for cards
  const cardVariants = {
    hidden: { 
      opacity: 0,
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    },
    hover: {
      scale: 1.05,
      rotate: [0, -2, 2, -2, 0],
      transition: {
        rotate: {
          repeat: Infinity,
          duration: 2,
          ease: "linear"
        }
      }
    }
  };

  return (
    <section className="relative w-full py-24 md:py-32 overflow-hidden">
      {/* Background with gradient and pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-accent-purple/5 to-white">
        <div className="absolute inset-0 opacity-[0.03] pattern-grid-lg dark:opacity-[0.02]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-24"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center mb-6 px-4 py-2 rounded-full bg-primary/5 text-primary"
          >
            <Store className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Retail Partners</span>
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {finalContent.title}
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto">
            {finalContent.subtitle}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 items-center justify-items-center"
        >
          {finalContent.brands.map((brand, index) => (
            <motion.a
              key={brand.name || index}
              href={brand.link}
              target="_blank"
              rel="noopener noreferrer"
              variants={cardVariants}
              whileHover="hover"
              className="w-full aspect-square max-w-[180px] md:max-w-[220px] group"
            >
              <div className="h-full w-full rounded-2xl bg-white p-6 md:p-8 flex items-center justify-center 
                             shadow-lg hover:shadow-xl transition-all duration-300 
                             border border-gray-100 hover:border-primary/20
                             relative overflow-hidden">
                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Logo image */}
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  className="w-full h-full object-contain relative z-10 
                           transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
