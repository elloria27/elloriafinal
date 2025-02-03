import { motion } from "framer-motion";
import { SustainabilityFAQContent } from "@/types/sustainability";

interface SustainabilityFAQProps {
  content: SustainabilityFAQContent;
}

export const SustainabilityFAQ = ({ content }: SustainabilityFAQProps) => {
  return (
    <section className="py-20 bg-white">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6">{content.title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {content.description}
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {content.faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="mb-6"
            >
              <h3 className="text-xl font-semibold mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};