import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface EmptyCartProps {
  onClose: () => void;
}

export const EmptyCart = ({ onClose }: EmptyCartProps) => {
  return (
    <motion.div 
      className="h-full flex flex-col items-center justify-center text-center py-8 text-gray-500"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <ShoppingBag className="h-16 w-16 mb-4 stroke-[1.5] text-gray-400" />
      <p className="text-lg font-medium mb-2 text-gray-700">Your cart is empty</p>
      <p className="text-sm text-gray-500 mb-6">
        Looks like you haven't added any items yet
      </p>
      <Button 
        variant="outline" 
        onClick={onClose}
        className="rounded-full px-6"
      >
        Continue Shopping
      </Button>
    </motion.div>
  );
};