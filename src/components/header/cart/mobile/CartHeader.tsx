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
    <SheetHeader className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b px-4 py-4">
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <SheetTitle className="text-xl font-medium flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="p-0 hover:bg-transparent -ml-2"
            onClick={onClose}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          Your Cart
        </SheetTitle>
        {hasItems && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-gray-500 hover:text-red-500 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </motion.div>
    </SheetHeader>
  );
};