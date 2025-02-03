import { motion } from "framer-motion";
import { SustainabilityCTAContent } from "@/types/sustainability";

interface SustainabilityCTAProps {
  content: SustainabilityCTAContent;
}

export const SustainabilityCTA = ({ content }: SustainabilityCTAProps) => {
  return (
    <section className="py-20 bg-gradient-to-b from-accent-green/10 to-white">
      <div className="container px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-4xl font-bold mb-6">{content.title}</h2>
          <p className="text-gray-600 mb-8">{content.description}</p>
          <a
            href={content.button_link}
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full hover:bg-primary/90 transition-colors"
          >
            {content.button_text}
          </a>
        </motion.div>
      </div>
    </section>
  );
};