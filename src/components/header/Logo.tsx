
import { motion } from "framer-motion";
import { useLogo } from "@/hooks/use-logo";

export const Logo = () => {
  const logoUrl = useLogo();

  return (
    <motion.a 
      href="/" 
      className="h-6 md:h-8" // Reduced height for mobile, original size for desktop
      whileHover={{ scale: 1.02 }}
    >
      <img 
        src={logoUrl || "/lovable-uploads/08d815c8-551d-4278-813a-fe884abd443d.png"}
        alt="Elloria" 
        className="h-full w-auto"
      />
    </motion.a>
  );
};
