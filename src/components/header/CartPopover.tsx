import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { DesktopCart } from "./cart/DesktopCart";
import { MobileCart } from "./cart/MobileCart";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useState } from "react";

export const CartPopover = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { totalItems, isCartAnimating } = useCart();
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  const handleCartClick = () => {
    if (isMobile) {
      console.log("Opening mobile cart");
      setIsMobileCartOpen(true);
    }
  };

  const CartIcon = () => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      animate={isCartAnimating ? {
        scale: [1, 1.2, 1],
        rotate: [0, 10, -10, 10, -10, 0],
        transition: { duration: 0.5 }
      } : {}}
      className="relative cursor-pointer"
    >
      <ShoppingCart 
        className="h-5 w-5 text-gray-600 hover:text-primary transition-colors" 
      />
      {totalItems > 0 && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
        >
          {totalItems}
        </motion.div>
      )}
    </motion.div>
  );

  return (
    <div className="relative">
      {isMobile ? (
        <>
          <div onClick={handleCartClick}>
            <CartIcon />
          </div>
          <MobileCart 
            isOpen={isMobileCartOpen} 
            onClose={() => setIsMobileCartOpen(false)} 
          />
        </>
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <button className="cursor-pointer">
              <CartIcon />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-96 p-0" align="end" sideOffset={8}>
            <DesktopCart />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};