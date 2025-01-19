import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
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
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100"
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-16 px-4">
            <motion.a 
              href="/" 
              className="text-2xl font-light tracking-wider"
              whileHover={{ scale: 1.02 }}
            >
              ELLORIA
            </motion.a>

            <nav className="hidden md:flex items-center space-x-8">
              {["Products", "Features", "Sustainability", "Blog"].map((item) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-600 hover:text-primary transition-colors text-sm tracking-wide"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {item}
                </motion.a>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden md:flex hover:bg-primary/5"
              >
                Sign In
              </Button>
              <Button 
                size="sm" 
                className="hidden md:flex bg-gradient-to-r from-primary to-primary/90 hover:opacity-90"
              >
                Shop Now
              </Button>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle className="text-left font-light tracking-wider">
                      ELLORIA
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col space-y-4 mt-8">
                    {["Products", "Features", "Sustainability", "Blog", "Sign In", "Shop Now"].map((item) => (
                      <motion.a
                        key={item}
                        href={`#${item.toLowerCase().replace(" ", "-")}`}
                        className="text-lg text-gray-600 hover:text-primary transition-colors py-2"
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
        </div>
      </motion.header>
      <div className="h-16" /> {/* Spacer for fixed header */}
    </>
  );
};