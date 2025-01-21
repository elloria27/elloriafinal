import { Menu } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export const MobileMenu = () => {
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
        className="w-[300px] sm:w-[400px] bg-white/80 backdrop-blur-xl"
      >
        <SheetHeader>
          <SheetTitle className="text-left font-extralight tracking-[0.2em] text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            ELLORIA
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col space-y-6 mt-12">
          {["Products", "Features", "Sustainability", "About Us", "Blog", "Account", "Language", "Currency"].map((item) => (
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
  );
};