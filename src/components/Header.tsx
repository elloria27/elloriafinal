import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, User, Globe, DollarSign } from "lucide-react";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Fixed container for both promo strip and header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        {/* Promotional Strip */}
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

        {/* Main Header */}
        <motion.header 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          className="bg-white/70 backdrop-blur-xl border-b border-gray-100/20"
        >
          <div className="container mx-auto">
            <div className="flex items-center justify-between h-20 px-4">
              {/* Logo */}
              <motion.a 
                href="/" 
                className="text-3xl font-extralight tracking-[0.2em] bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent"
                whileHover={{ scale: 1.02 }}
              >
                ELLORIA
              </motion.a>

              {/* Main Navigation */}
              <nav className="hidden md:flex items-center space-x-12 ml-auto mr-8">
                {["Products", "Features", "Sustainability", "Blog"].map((item) => (
                  <motion.a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-gray-600 hover:text-primary transition-colors text-sm tracking-[0.15em] uppercase font-light"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item}
                  </motion.a>
                ))}
              </nav>

              {/* Right Side Icons */}
              <div className="hidden md:flex items-center space-x-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  <User className="h-5 w-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  <Globe className="h-5 w-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  <DollarSign className="h-5 w-5" />
                </motion.button>
              </div>

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="md:hidden hover:bg-primary/5"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  side="right" 
                  className="w-[300px] sm:w-[400px] bg-white/80 backdrop-blur-xl"
                >
                  <SheetHeader>
                    <SheetTitle className="text-left font-extralight tracking-[0.2em] text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      ELLORIA
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col space-y-6 mt-12">
                    {["Products", "Features", "Sustainability", "Blog", "Account", "Language", "Currency"].map((item) => (
                      <motion.a
                        key={item}
                        href={`#${item.toLowerCase().replace(" ", "-")}`}
                        className="text-lg text-gray-600 hover:text-primary transition-colors py-2 tracking-wider font-light"
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {item}
                      </motion.a>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </motion.header>
      </div>
      {/* Spacer to prevent content from hiding behind fixed header */}
      <div className="h-32" /> {/* Height matches promo strip + header height */}
    </>
  );
};