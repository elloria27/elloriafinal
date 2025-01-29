import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem as CartItemType } from "@/contexts/CartContext";
import { motion } from "framer-motion";

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  formatPrice: (price: number) => string;
}

export const CartItem = ({ item, onRemove, onUpdateQuantity, formatPrice }: CartItemProps) => {
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(item.id);
  };

  const handleQuantityChange = (e: React.MouseEvent, newQuantity: number) => {
    e.stopPropagation();
    if (newQuantity >= 1 && newQuantity <= 99) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-start gap-4 bg-white/50 backdrop-blur-sm p-4 rounded-2xl border border-gray-100"
    >
      <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-white/80">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-contain p-2"
        />
      </div>
      
      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-medium text-gray-900 leading-tight text-sm">
              {item.name}
            </h3>
            <p className="text-primary font-semibold mt-1 text-base">
              {formatPrice(item.price)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-gray-400 hover:text-red-500 -mt-1 p-1 h-auto"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 rounded-lg p-0 bg-white"
            onClick={(e) => handleQuantityChange(e, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          
          <span className="text-sm w-6 text-center font-medium">
            {item.quantity}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 rounded-lg p-0 bg-white"
            onClick={(e) => handleQuantityChange(e, item.quantity + 1)}
            disabled={item.quantity >= 99}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};