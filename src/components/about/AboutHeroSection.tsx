import { motion } from "framer-motion";

interface AboutHeroSectionProps {
  content?: {
    title?: string;
    subtitle?: string;
    backgroundImage?: string;
  };
}

export const AboutHeroSection = ({ content = {} }: AboutHeroSectionProps) => {
  const {
    title = "Our Story",
    subtitle = "Founded with a vision to revolutionize feminine care through sustainable innovation, Elloria began its journey to create products that care for both women and our planet.",
    backgroundImage = "/lovable-uploads/ba8d9a77-42de-4ec9-8666-53e795a2673c.png"
  } = content;

  return (
    <section className="relative h-[90vh] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-accent-purple/30 to-accent-peach/30" />
      <div 
        className="absolute inset-0 bg-cover bg-center md:bg-fixed bg-scroll"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      />
      <div className="absolute inset-0 bg-black/20" />
      <div className="relative h-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container px-4 text-center"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {title}
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {subtitle}
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};