import { motion } from "framer-motion";

export const ContactFAQ = () => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="text-xl font-semibold">What is your return policy?</h3>
              <p className="text-gray-600">Our return policy allows for returns within 30 days of purchase. Please ensure items are in original condition.</p>
            </div>
            <div className="border-b pb-4">
              <h3 className="text-xl font-semibold">How can I contact customer support?</h3>
              <p className="text-gray-600">You can reach our customer support team via email at support@example.com or by calling (123) 456-7890.</p>
            </div>
            <div className="border-b pb-4">
              <h3 className="text-xl font-semibold">Do you offer international shipping?</h3>
              <p className="text-gray-600">Yes, we offer international shipping to select countries. Please check our shipping policy for more details.</p>
            </div>
            <div className="border-b pb-4">
              <h3 className="text-xl font-semibold">Where can I find my order status?</h3>
              <p className="text-gray-600">You can track your order status through the link provided in your confirmation email or by logging into your account.</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
