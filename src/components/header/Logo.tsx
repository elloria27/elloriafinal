import { motion } from "framer-motion";

export const Logo = () => {
  return (
    <motion.a 
      href="/" 
      className="h-8"
      whileHover={{ scale: 1.02 }}
    >
      <img 
        src="/lovable-uploads/08d815c8-551d-4278-813a-fe884abd443d.png" 
        alt="Elloria" 
        className="h-full w-auto"
      />
    </motion.a>
  );
};