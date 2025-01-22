import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartItem as CartItemType } from "@/contexts/CartContext";

interface CartItemProps {
  item: CartItemType;
  onRemove: (id: number) => void;
  onUpdateQuantity: (id: number, quantity: number) => void;
  formatPrice: (price: number) => string;
}

export const CartItem = ({ item, onRemove, onUpdateQuantity, formatPrice }: CartItemProps) => {
  console.log("Rendering cart item:", item.id);
  
  return (
    <div className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-100">
      <img
        src={item.image}
        alt={item.name}
        className="w-20 h-20 object-contain rounded-md bg-white"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <h5 className="font-medium text-base truncate flex-1">{item.name}</h5>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              console.log("Remove button clicked for item:", item.id);
              onRemove(item.id);
            }}
            className="text-gray-400 hover:text-red-500 p-2 h-auto"
          >
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
        
        <p className="text-primary font-medium text-lg mt-1">
          {formatPrice(item.price)}
        </p>
        
        <div className="flex items-center gap-3 mt-3">
          <Button
            variant="outline"
            size="sm"
            className="h-10 w-10 rounded-full"
            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          
          <span className="text-base w-8 text-center font-medium">
            {item.quantity}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            className="h-10 w-10 rounded-full"
            onClick={() => onUpdateQuantity(item.id, Math.min(99, item.quantity + 1))}
            disabled={item.quantity >= 99}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};