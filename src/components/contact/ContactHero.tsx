import { motion } from "framer-motion";

export interface ContactHeroContent {
  title?: string;
  subtitle?: string;
}

interface ContactHeroProps {
  content: ContactHeroContent;
}

export const ContactHero = ({ content }: ContactHeroProps) => {
  const { 
    title = "We'd Love to Hear From You!", 
    subtitle = "Whether you have questions, feedback, or collaboration ideas, we're here for you." 
  } = content;

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
            {title}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>
      </div>
    </section>
  );
};