import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { CartItem } from "./mobile/CartItem";
import { CartSummary } from "./mobile/CartSummary";
import { CartHeader } from "./mobile/CartHeader";
import { EmptyCart } from "./mobile/EmptyCart";
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
      console.log('Opening mobile cart');
      setIsOpen(true);
    };

    window.addEventListener('openCart', handleOpen);
    return () => {
      console.log('Cleaning up mobile cart event listener');
      window.removeEventListener('openCart', handleOpen);
    };
  }, []);

  const handleClose = () => {
    console.log('Closing mobile cart');
    setIsOpen(false);
  };

  const handleCheckout = () => {
    console.log("Starting checkout process");
    setIsOpen(false); // Ensure cart closes before navigation
    setTimeout(() => {
      navigate("/checkout", { replace: true });
    }, 300);
  };

  const handleRemoveItem = (itemId: string) => {
    console.log("Removing item from cart:", itemId);
    removeItem(itemId);
    toast.success("Item removed from cart");
  };

  const handleClearCart = () => {
    console.log("Clearing entire cart");
    clearCart();
    toast.success("Cart cleared");
    setIsOpen(false); // Close cart after clearing
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
      modal={true}
    >
      <SheetContent 
        side="bottom" 
        className="h-[90vh] p-0 flex flex-col rounded-t-[20px] shadow-2xl bg-white"
        onPointerDownOutside={(e) => {
          e.preventDefault();
          setIsOpen(false);
        }}
        onEscapeKeyDown={() => setIsOpen(false)}
      >
        <CartHeader 
          onClose={handleClose}
          onClear={handleClearCart}
          hasItems={items.length > 0}
        />

        <motion.div 
          className="flex-1 overflow-y-auto px-4 py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <AnimatePresence mode="popLayout">
            {items.length === 0 ? (
              <EmptyCart onClose={handleClose} />
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    onRemove={handleRemoveItem}
                    onUpdateQuantity={updateQuantity}
                    formatPrice={formatPrice}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
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
              className="w-full h-12 text-base rounded-full font-medium bg-primary hover:bg-primary/90"
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