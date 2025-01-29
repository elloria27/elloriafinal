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
      className="group relative flex gap-4 bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-50">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex items-start justify-between">
            <h3 className="font-medium text-gray-900 leading-tight line-clamp-2">
              {item.name}
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              className="opacity-0 group-hover:opacity-100 transition-opacity -mr-2 -mt-2 h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-primary font-semibold">
            {formatPrice(item.price)}
          </p>
        </div>
        
        <div className="flex items-center gap-3 mt-2">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg border-gray-200"
            onClick={(e) => handleQuantityChange(e, item.quantity - 1)}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          
          <span className="w-8 text-center font-medium text-sm">
            {item.quantity}
          </span>
          
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-lg border-gray-200"
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