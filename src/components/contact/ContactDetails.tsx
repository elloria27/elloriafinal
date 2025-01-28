import { motion } from "framer-motion";

export const ContactDetails = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Contact Details</h2>
          <p className="text-lg text-gray-600">You can reach us at:</p>
          <div className="mt-4">
            <p className="text-gray-700">Email: <a href="mailto:info@example.com" className="text-blue-500">info@example.com</a></p>
            <p className="text-gray-700">Phone: <a href="tel:+1234567890" className="text-blue-500">+1 (234) 567-890</a></p>
            <p className="text-gray-700">Address: 123 Example St, City, Country</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
