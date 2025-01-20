import { motion } from "framer-motion";

export const Logo = () => {
  return (
    <motion.a 
      href="/" 
      className="text-3xl font-extralight tracking-[0.2em] bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent"
      whileHover={{ scale: 1.02 }}
    >
      ELLORIA
    </motion.a>
  );
};