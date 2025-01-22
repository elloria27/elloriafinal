import { ArrowLeft, ShoppingBag, Trash2 } from "lucide-react";
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
    const handleOpen = () => {
      console.log('Open cart event received');
      setIsOpen(true);
    };

    window.addEventListener('openCart', handleOpen);
    return () => window.removeEventListener('openCart', handleOpen);
  }, []);

  const handleClose = () => {
    console.log('Closing cart');
    setIsOpen(false);
  };

  const handleCheckout = () => {
    console.log("Initiating checkout process");
    handleClose();
    setTimeout(() => {
      navigate("/checkout", { replace: true });
    }, 300);
  };

  const handleRemoveItem = (itemId: string) => {
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

  return (
    <Sheet 
      open={isOpen} 
      onOpenChange={setIsOpen}
    >
      <SheetContent 
        side="bottom" 
        className="h-[85vh] p-0 flex flex-col rounded-t-3xl"
      >
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
            <div className="h-full flex flex-col items-center justify-center text-center py-8 text-gray-500">
              <ShoppingBag className="h-12 w-12 mb-4 stroke-[1.5]" />
              <p className="text-lg font-medium mb-2">Your cart is empty</p>
              <p className="text-sm text-gray-400">
                Add items to your cart to start shopping
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onRemove={handleRemoveItem}
                    onUpdateQuantity={updateQuantity}
                    formatPrice={formatPrice}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t bg-white px-4 py-4 space-y-4">
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
              className="w-full h-12 text-base rounded-xl"
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