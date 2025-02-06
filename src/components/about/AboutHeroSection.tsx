import { motion } from "framer-motion";
import { AboutHeroContent } from "@/types/content-blocks";

interface AboutHeroSectionProps {
  content?: AboutHeroContent;
}

export const AboutHeroSection = ({ content = {} }: AboutHeroSectionProps) => {
  const {
    title = "Our Story",
    subtitle = "Founded with a vision to revolutionize feminine care through sustainable innovation, Elloria began its journey to create products that care for both women and our planet.",
    backgroundImage = "/lovable-uploads/7a6b700f-4122-4c0b-ae5b-519bbf08e94a.png"
  } = content;

  return (
    <section className="relative h-screen">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      >
        <div className="absolute inset-0 bg-black/30" />
      </div>
      <div className="relative h-full flex items-center justify-center">
        <div className="container px-4 text-center">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {title}
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {subtitle}
          </motion.p>
        </div>
      </div>
    </section>
  );
};