import { ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { motion } from "framer-motion";

interface CartHeaderProps {
  onClose: () => void;
  onClear: () => void;
  hasItems: boolean;
}

export const CartHeader = ({ onClose, onClear, hasItems }: CartHeaderProps) => {
  return (
    <SheetHeader className="sticky top-0 z-50 bg-white border-b px-4 py-4">
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onClose}
          className="hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <SheetTitle className="absolute left-1/2 -translate-x-1/2 text-lg font-medium">
          Your Cart
        </SheetTitle>

        {hasItems && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            className="text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </motion.div>
    </SheetHeader>
  );
};