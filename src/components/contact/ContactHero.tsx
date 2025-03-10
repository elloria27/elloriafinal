import { motion } from "framer-motion";
import { ContactHeroContent } from "@/types/content-blocks";

interface ContactHeroProps {
  content: ContactHeroContent;
}

export const ContactHero = ({ content }: ContactHeroProps) => {
  return (
    <section className="relative bg-gradient-to-r from-primary/10 to-secondary/10 py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {content.title || "Contact Us"}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            {content.subtitle || "We'd love to hear from you"}
          </p>
        </motion.div>
      </div>
    </section>
  );
};