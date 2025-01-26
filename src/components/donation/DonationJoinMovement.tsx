import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

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
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Together, We Can Create Change
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join us in our mission to ensure every woman has access to essential care
            products. Your support makes a real difference in communities worldwide.
          </p>
          <Button
            onClick={() => {
              const form = document.querySelector("#donation-form");
              form?.scrollIntoView({ behavior: "smooth" });
            }}
            size="lg"
            className="bg-primary hover:bg-primary/90"
          >
            Donate Now and Make a Difference
          </Button>
        </motion.div>
      </div>
    </section>
  );
};