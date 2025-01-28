import { motion } from "framer-motion";
import { ContactFAQContent } from "@/types/content-blocks";

interface ContactFAQProps {
  content?: ContactFAQContent;
}

export const ContactFAQ = ({ content }: ContactFAQProps) => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold mb-8 text-center">{content?.title || "Frequently Asked Questions"}</h2>
          
          <div className="space-y-6">
            {content?.faqs?.map((faq, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};