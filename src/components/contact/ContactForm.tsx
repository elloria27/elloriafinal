import { motion } from "framer-motion";
import { ContactFormContent } from "@/types/content-blocks";

interface ContactFormProps {
  content?: ContactFormContent;
}

export const ContactForm = ({ content }: ContactFormProps) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-3xl font-bold mb-4">{content?.title || "Get in Touch"}</h2>
          <p className="text-gray-600 mb-8">{content?.description || "We'd love to hear from you. Send us a message and we'll respond as soon as possible."}</p>
          
          <form>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" id="name" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" id="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" required />
            </div>
            <div className="mb-4">
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
              <textarea id="message" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" rows={4} required></textarea>
            </div>
            <button type="submit" className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary-dark">Send Message</button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};
