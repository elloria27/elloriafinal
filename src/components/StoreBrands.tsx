import { motion } from "framer-motion";
import { StoreBrandsContent } from "@/types/content-blocks";

interface StoreBrandsProps {
  content?: StoreBrandsContent;
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

  // Transform features from admin panel format to brands format
  const transformFeaturesToBrands = (features: any[] = []) => {
    return features.map(feature => ({
      name: feature.title || '',
      logo: feature.description || '', // Logo URL is stored in description field
      link: feature.detail || '#' // Link is stored in detail field
    }));
  };

  const finalContent = {
    title: content?.title || defaultContent.title,
    subtitle: content?.subtitle || defaultContent.subtitle,
    brands: content?.features ? transformFeaturesToBrands(content.features) : defaultContent.brands
  };

  return (
    <section className="w-full py-32 bg-gradient-to-b from-white to-accent-purple/5">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {finalContent.title}
          </h2>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto">
            {finalContent.subtitle}
          </p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 items-center justify-items-center">
          {finalContent.brands.map((brand, index) => (
            <motion.a
              key={brand.name || index}
              href={brand.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                rotate: [-1, 1, -1],
                transition: { rotate: { repeat: Infinity, duration: 2 } }
              }}
              className="w-48 h-48 flex items-center justify-center p-8 rounded-3xl bg-white hover:bg-accent-purple/5 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl border border-gray-100"
            >
              <img
                src={brand.logo}
                alt={`${brand.name} logo`}
                className="w-full h-full object-contain"
              />
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};