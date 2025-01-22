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
  
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Remove button clicked for item:", item.id);
    onRemove(item.id);
  };

  const handleQuantityChange = (e: React.MouseEvent, newQuantity: number) => {
    e.stopPropagation();
    onUpdateQuantity(item.id, newQuantity);
  };
  
  return (
    <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-100">
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 object-contain rounded-md bg-white"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h5 className="font-medium text-sm truncate">{item.name}</h5>
            <p className="text-primary font-medium text-base">
              {formatPrice(item.price)}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            className="text-gray-400 hover:text-red-500 p-1 h-auto"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 rounded-full p-0"
            onClick={(e) => handleQuantityChange(e, Math.max(1, item.quantity - 1))}
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
            className="h-8 w-8 rounded-full p-0"
            onClick={(e) => handleQuantityChange(e, Math.min(99, item.quantity + 1))}
            disabled={item.quantity >= 99}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};