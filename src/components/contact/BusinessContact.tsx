import { motion } from "framer-motion";

export const BusinessContact = () => {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Business Inquiries</h2>
          <p className="text-lg mb-6">
            For any business inquiries, please reach out to us using the contact form or email us directly.
          </p>
          <a href="mailto:business@example.com" className="inline-block bg-primary text-white py-2 px-4 rounded">
            Contact Us
          </a>
        </motion.div>
      </div>
    </section>
  );
};
