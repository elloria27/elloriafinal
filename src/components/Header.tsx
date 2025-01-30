import { motion } from "framer-motion";
import { Logo } from "./header/Logo";
import { Navigation } from "./header/Navigation";
import { UserMenu } from "./header/UserMenu";
import { LanguageSelector } from "./header/LanguageSelector";
import { CurrencySelector } from "./header/CurrencySelector";
import { CartPopover } from "./header/CartPopover";
import { MobileMenu } from "./header/MobileMenu";
import { useLocation } from "react-router-dom";

export const Header = () => {
  const location = useLocation();
  
  // Hide header on admin routes
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100"
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-14 md:h-20 px-4">
          <Logo />
          
          <div className="flex items-center justify-end flex-1 space-x-6">
            <Navigation />
            
            <div className="hidden md:flex items-center space-x-6">
              <UserMenu />
              <LanguageSelector />
              <CurrencySelector />
              <CartPopover />
            </div>

            <div className="md:hidden flex items-center gap-4">
              <CartPopover />
              <MobileMenu />
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};