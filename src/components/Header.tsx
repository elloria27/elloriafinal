import { motion } from "framer-motion";
import { Logo } from "./header/Logo";
import { Navigation } from "./header/Navigation";
import { UserMenu } from "./header/UserMenu";
import { LanguageSelector } from "./header/LanguageSelector";
import { CurrencySelector } from "./header/CurrencySelector";
import { CartPopover } from "./header/CartPopover";
import { MobileMenu } from "./header/MobileMenu";

export const Header = () => {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100"
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-14 md:h-20 px-4">
          <Logo />
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
    </motion.header>
  );
};