import { ArrowLeft, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { CartItem } from "./mobile/CartItem";
import { CartSummary } from "./mobile/CartSummary";
import { toast } from "sonner";

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

  useEffect(() => {
    const handleToggleCart = () => {
      console.log('Toggle cart event received');
      setIsOpen(prev => !prev);
    };

    window.addEventListener('toggleCart', handleToggleCart);
    return () => window.removeEventListener('toggleCart', handleToggleCart);
  }, []);

  const handleCheckout = () => {
    console.log("Initiating checkout process");
    setIsOpen(false);
    setTimeout(() => {
      navigate("/checkout", { replace: true });
    }, 300);
  };

  const handleRemoveItem = (itemId: number) => {
    console.log("Removing item:", itemId);
    removeItem(itemId);
    toast.success("Item removed from cart");
  };

  const handleClearCart = () => {
    console.log("Clearing entire cart");
    clearCart();
    toast.success("Cart cleared");
  };

  const handleApplyPromoCode = () => {
    if (promoCode.trim()) {
      console.log("Applying promo code:", promoCode);
      applyPromoCode(promoCode.trim());
      setPromoCode("");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleClose = () => {
    console.log('Closing cart');
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="bottom" className="h-[85vh] p-0 flex flex-col">
        <SheetHeader className="sticky top-0 z-50 bg-white border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-semibold flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-0 hover:bg-transparent"
                onClick={handleClose}
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              Shopping Cart
            </SheetTitle>
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
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-3">
          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                  >
                    <CartItem
                      item={item}
                      onRemove={handleRemoveItem}
                      onUpdateQuantity={updateQuantity}
                      formatPrice={formatPrice}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t bg-white px-4 py-4 space-y-3">
            <CartSummary
              subtotal={subtotal}
              total={total}
              promoCode={promoCode}
              activePromoCode={activePromoCode}
              onPromoCodeChange={setPromoCode}
              onApplyPromoCode={handleApplyPromoCode}
              onRemovePromoCode={removePromoCode}
              formatPrice={formatPrice}
            />

            <Button 
              className="w-full h-11 text-base"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};