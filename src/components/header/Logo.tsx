
import { motion } from "framer-motion";
import { useLogo } from "@/hooks/use-logo";
import { useLocation } from "react-router-dom";

export const Logo = () => {
  const logoUrl = useLogo();
  const location = useLocation();

  // Don't show logo on setup page
  if (location.pathname === '/setup') {
    return null;
  }

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
