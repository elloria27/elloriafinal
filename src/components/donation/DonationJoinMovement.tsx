import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export const DonationJoinMovement = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-accent-purple/10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="mb-8 text-primary">
            <Heart className="w-16 h-16 mx-auto" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Our Movement Today
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Together, we can make a lasting impact on women's health and dignity.
            Your support helps us reach more communities and change more lives.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors"
            onClick={() => {
              const form = document.querySelector("#donation-form");
              form?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Make a Difference Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};