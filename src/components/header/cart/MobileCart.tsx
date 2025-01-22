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
        className="h-[90vh] p-0 flex flex-col rounded-t-[20px] shadow-2xl"
      >
        <SheetHeader className="sticky top-0 z-50 bg-white border-b px-4 py-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-medium flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="p-0 hover:bg-transparent -ml-2"
                onClick={handleClose}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              Your Cart
            </SheetTitle>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearCart}
                className="text-gray-500 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </SheetHeader>

        <motion.div 
          className="flex-1 overflow-y-auto px-4 py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {items.length === 0 ? (
            <motion.div 
              className="h-full flex flex-col items-center justify-center text-center py-8 text-gray-500"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <ShoppingBag className="h-16 w-16 mb-4 stroke-[1.5] text-gray-400" />
              <p className="text-lg font-medium mb-2 text-gray-700">Your cart is empty</p>
              <p className="text-sm text-gray-500 mb-6">
                Looks like you haven't added any items yet
              </p>
              <Button 
                variant="outline" 
                onClick={handleClose}
                className="rounded-full px-6"
              >
                Continue Shopping
              </Button>
            </motion.div>
          ) : (
            <div className="space-y-4">
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
        </motion.div>

        {items.length > 0 && (
          <motion.div 
            className="border-t bg-white px-4 py-4 space-y-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
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
              className="w-full h-12 text-base rounded-full font-medium"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
          </motion.div>
        )}
      </SheetContent>
    </Sheet>
  );
};