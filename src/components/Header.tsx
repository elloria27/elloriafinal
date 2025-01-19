import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Menu } from "lucide-react";
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
        className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100/20"
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-20 px-4">
            <motion.a 
              href="/" 
              className="text-3xl font-extralight tracking-[0.2em] bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent"
              whileHover={{ scale: 1.02 }}
            >
              ELLORIA
            </motion.a>

            <nav className="hidden md:flex items-center space-x-12">
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

            <div className="flex items-center space-x-6">
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden md:flex hover:bg-primary/5 tracking-wide font-light"
              >
                Sign In
              </Button>
              <Button 
                size="sm" 
                className="hidden md:flex bg-gradient-to-r from-primary via-primary/90 to-primary hover:opacity-90 tracking-wide font-light"
              >
                Shop Now
              </Button>

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
                    {["Products", "Features", "Sustainability", "Blog", "Sign In", "Shop Now"].map((item) => (
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
        </div>
      </motion.header>
      <div className="h-20" /> {/* Spacer for fixed header */}
    </>
  );
};