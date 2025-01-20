import { motion, AnimatePresence } from "framer-motion";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { AnnouncementBar } from "./header/AnnouncementBar";
import { Logo } from "./header/Logo";
import { Navigation } from "./header/Navigation";
import { UserMenu } from "./header/UserMenu";
import { LanguageSelector } from "./header/LanguageSelector";
import { CurrencySelector } from "./header/CurrencySelector";
import { CartPopover } from "./header/CartPopover";
import { MobileMenu } from "./header/MobileMenu";

export const Header = () => {
  const scrollDirection = useScrollDirection();

  return (
    <AnimatePresence>
      {scrollDirection === "up" && (
        <motion.div 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          exit={{ y: -100 }}
          transition={{ duration: 0.3 }}
          className="fixed top-0 left-0 right-0 z-50"
        >
          <AnnouncementBar />
          <motion.header 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="bg-white/70 backdrop-blur-xl border-b border-gray-100/20"
          >
            <div className="container mx-auto">
              <div className="flex items-center justify-between h-20 px-4">
                <Logo />
                <Navigation />
                
                {/* Right Side Icons */}
                <div className="hidden md:flex items-center space-x-6">
                  <UserMenu />
                  <LanguageSelector />
                  <CurrencySelector />
                  <CartPopover />
                </div>

                <MobileMenu />
              </div>
            </div>
          </motion.header>
        </motion.div>
      )}
    </AnimatePresence>
  );
};