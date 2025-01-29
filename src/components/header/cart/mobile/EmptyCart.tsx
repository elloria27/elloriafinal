import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface EmptyCartProps {
  onClose: () => void;
}

export const EmptyCart = ({ onClose }: EmptyCartProps) => {
  return (
    <motion.div 
      className="h-full flex flex-col items-center justify-center text-center p-8"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-6">
        <ShoppingBag className="h-10 w-10 text-primary" />
      </div>
      <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
      <p className="text-gray-500 mb-8 max-w-[250px]">
        Looks like you haven't added any items to your cart yet
      </p>
      <Button 
        variant="outline" 
        onClick={onClose}
        className="min-w-[200px] h-12"
      >
        Continue Shopping
      </Button>
    </motion.div>
  );
};