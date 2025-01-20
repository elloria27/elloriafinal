import { motion } from "framer-motion";

export const AnnouncementBar = () => {
  return (
    <motion.div
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 text-gray-700"
    >
      <div className="container mx-auto">
        <p className="py-2 text-sm font-light tracking-wider text-center">
          🌟 Free shipping on orders over $50 | Use code WELCOME20 for 20% off your first order
        </p>
      </div>
    </motion.div>
  );
};