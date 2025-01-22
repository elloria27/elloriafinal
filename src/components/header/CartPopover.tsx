import { ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { DesktopCart } from "./cart/DesktopCart";
import { MobileCart } from "./cart/MobileCart";
import { useMediaQuery } from "@/hooks/use-mobile";

export const CartPopover = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { totalItems, isCartAnimating } = useCart();

  return (
    <div className="relative">
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
          onClick={(e) => {
            e.stopPropagation();
            const event = new CustomEvent('toggleCart');
            window.dispatchEvent(event);
          }}
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
      
      {isMobile ? <MobileCart /> : <DesktopCart />}
    </div>
  );
};