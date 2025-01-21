import { ShoppingCart, X, Minus, Plus, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useCart } from "@/contexts/CartContext";
import type { CartItem } from "@/contexts/CartContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from "@/hooks/use-mobile";

export const CartPopover = () => {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { 
    items, 
    totalItems, 
    removeItem, 
    updateQuantity, 
    clearCart,
    subtotal,
    total,
    applyPromoCode,
    removePromoCode,
    activePromoCode,
    isCartAnimating
  } = useCart();

  const [promoCode, setPromoCode] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleApplyPromoCode = () => {
    if (promoCode.trim()) {
      applyPromoCode(promoCode.trim());
      setPromoCode("");
    }
  };

  const handleCheckout = () => {
    console.log("Navigating to checkout page");
    setIsOpen(false);
    navigate("/checkout");
  };

  const formatPrice = (price: number) => {
    if (typeof price !== 'number' || isNaN(price)) {
      return '$0.00';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const renderCartItem = (item: CartItem) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-start gap-3 bg-gray-50 p-3 rounded-lg"
    >
      <img
        src={item.image}
        alt={item.name}
        className="w-16 h-16 object-contain rounded-md bg-white"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h5 className="font-medium text-sm truncate">{item.name}</h5>
          <button
            onClick={() => removeItem(item.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="text-primary font-medium mt-1">
          {formatPrice(item.price)}
        </p>
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="text-sm w-8 text-center">{item.quantity}</span>
          <Button
            variant="outline"
            size="sm"
            className="h-7 w-7 p-0"
            onClick={() => updateQuantity(item.id, Math.min(99, item.quantity + 1))}
            disabled={item.quantity >= 99}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.05 }}
          animate={isCartAnimating ? {
            scale: [1, 1.2, 1],
            rotate: [0, 10, -10, 10, -10, 0],
            transition: { duration: 0.5 }
          } : {}}
          className="relative cursor-pointer"
        >
          <ShoppingCart className="h-5 w-5 text-gray-600 hover:text-primary transition-colors" />
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
      </PopoverTrigger>
      <PopoverContent 
        className={`bg-white shadow-lg border border-gray-100 ${
          isMobile ? 'w-[calc(100vw-32px)] max-h-[80vh] overflow-y-auto' : 'w-96'
        }`}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between sticky top-0 bg-white z-10 py-2">
            <h4 className="text-lg font-medium">Shopping Cart</h4>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearCart}
                className="text-gray-500 hover:text-red-500"
              >
                Clear Cart
              </Button>
            )}
          </div>

          {items.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 max-h-[40vh] overflow-y-auto">
                <AnimatePresence>
                  {items.map(renderCartItem)}
                </AnimatePresence>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={handleApplyPromoCode}
                    className="whitespace-nowrap"
                  >
                    <Tag className="mr-2 h-4 w-4" />
                    Apply
                  </Button>
                </div>

                {activePromoCode && (
                  <div className="flex items-center justify-between bg-primary/5 p-2 rounded-md">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-primary" />
                      <span className="text-sm text-primary font-medium">
                        {activePromoCode.code} ({activePromoCode.discount}% OFF)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removePromoCode}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span>{formatPrice(subtotal || 0)}</span>
                  </div>
                  {activePromoCode && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Discount</span>
                      <span className="text-primary">
                        -{formatPrice((subtotal * activePromoCode.discount) / 100)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>{formatPrice(total || 0)}</span>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full" 
                onClick={handleCheckout}
                disabled={items.length === 0}
              >
                Proceed to Checkout
              </Button>
            </>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
