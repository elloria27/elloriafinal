import { X, Minus, Plus, Tag, Trash2, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  DrawerClose,
} from "@/components/ui/drawer";

export const MobileCart = () => {
  const navigate = useNavigate();
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    clearCart,
    subtotal,
    total,
    applyPromoCode,
    removePromoCode,
    activePromoCode,
  } = useCart();

  const [promoCode, setPromoCode] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleCheckout = () => {
    console.log("Mobile checkout initiated");
    setIsOpen(false);
    setTimeout(() => {
      navigate("/checkout", { replace: true });
    }, 300);
  };

  const handleRemoveItem = (e: React.MouseEvent, itemId: number) => {
    e.stopPropagation(); // Stop event propagation
    console.log("Removing item:", itemId);
    removeItem(itemId);
  };

  const handleClearCart = (e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event propagation
    console.log("Clearing cart");
    clearCart();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const renderCartItem = (item: any) => (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="flex items-start gap-3 bg-white p-4 rounded-lg border border-gray-100"
    >
      <img
        src={item.image}
        alt={item.name}
        className="w-20 h-20 object-contain rounded-md bg-white"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <h5 className="font-medium text-base truncate flex-1">{item.name}</h5>
          <button
            onClick={(e) => handleRemoveItem(e, item.id)}
            className="text-gray-400 hover:text-red-500 transition-colors p-2"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
        <p className="text-primary font-medium text-lg mt-1">
          {formatPrice(item.price)}
        </p>
        <div className="flex items-center gap-3 mt-3">
          <Button
            variant="outline"
            size="sm"
            className="h-10 w-10 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              updateQuantity(item.id, Math.max(1, item.quantity - 1));
            }}
            disabled={item.quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-base w-8 text-center font-medium">{item.quantity}</span>
          <Button
            variant="outline"
            size="sm"
            className="h-10 w-10 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              updateQuantity(item.id, Math.min(99, item.quantity + 1));
            }}
            disabled={item.quantity >= 99}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <span className="sr-only">Open cart</span>
      </DrawerTrigger>
      <DrawerContent className="h-[85vh] p-0">
        <DrawerHeader className="sticky top-0 z-50 bg-white border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <DrawerTitle className="text-xl font-semibold flex items-center gap-2">
              <DrawerClose asChild>
                <Button variant="ghost" size="sm" className="p-0 hover:bg-transparent">
                  <ArrowLeft className="h-6 w-6" />
                </Button>
              </DrawerClose>
              Shopping Cart
            </DrawerTitle>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearCart}
                className="text-gray-500 hover:text-red-500"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            )}
          </div>
        </DrawerHeader>

        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto px-4 py-4">
            {items.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence>
                  {items.map(renderCartItem)}
                </AnimatePresence>
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t bg-white px-4 py-4 space-y-4">
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
                    onClick={() => {
                      if (promoCode.trim()) {
                        applyPromoCode(promoCode.trim());
                        setPromoCode("");
                      }
                    }}
                  >
                    <Tag className="mr-2 h-4 w-4" />
                    Apply
                  </Button>
                </div>

                {activePromoCode && (
                  <div className="flex items-center justify-between bg-primary/5 p-3 rounded-md">
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
                      className="h-8 w-8 p-0"
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
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold pt-2">
                    <span>Total</span>
                    <span>{formatPrice(total || 0)}</span>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full h-12 text-base"
                onClick={handleCheckout}
                disabled={items.length === 0}
              >
                Proceed to Checkout
              </Button>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};