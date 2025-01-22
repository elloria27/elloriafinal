import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LanguageSelector } from "./LanguageSelector";
import { CurrencySelector } from "./CurrencySelector";
import { UserMenu } from "./UserMenu";

export const MobileMenu = () => {
  const menuItems = [
    { name: "Shop", path: "/shop" },
    { name: "Features", path: "#features" },
    { name: "Sustainability", path: "/sustainability" },
    { name: "About Us", path: "/about" },
    { name: "Blog", path: "#blog" }
  ];

  return (
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
        className="w-[300px] sm:w-[400px] bg-white/80 backdrop-blur-xl flex flex-col"
      >
        <SheetHeader>
          <SheetTitle className="text-left font-extralight tracking-[0.2em] text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ELLORIA
          </SheetTitle>
        </SheetHeader>
        
        <div className="flex-1">
          <div className="flex flex-col space-y-6 mt-12">
            {menuItems.map((item) => (
              <motion.div key={item.name}>
                {item.path.startsWith("#") ? (
                  <motion.a
                    href={item.path}
                    className="text-lg text-gray-600 hover:text-primary transition-colors py-2 tracking-wider font-light block"
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.name}
                  </motion.a>
                ) : (
                  <Link to={item.path}>
                    <motion.span
                      className="text-lg text-gray-600 hover:text-primary transition-colors py-2 tracking-wider font-light block cursor-pointer"
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {item.name}
                    </motion.span>
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-6 border-t">
          <div className="flex items-center justify-center space-x-6">
            <UserMenu />
            <LanguageSelector />
            <CurrencySelector />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};