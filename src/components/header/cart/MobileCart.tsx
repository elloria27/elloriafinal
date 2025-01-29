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
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Tag, X } from "lucide-react";

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
  const [showPromoInput, setShowPromoInput] = useState(false);

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
    setShowPromoInput(false);
  };

  const handleCheckout = () => {
    console.log("Starting checkout process");
    setIsOpen(false);
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
    setIsOpen(false);
  };

  const handleApplyPromoCode = () => {
    if (promoCode.trim()) {
      console.log("Applying promo code:", promoCode);
      applyPromoCode(promoCode.trim());
      setPromoCode("");
      setShowPromoInput(false);
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
        side="right" 
        className="w-full sm:max-w-md h-full p-0 flex flex-col bg-gradient-to-br from-white via-white to-gray-50"
      >
        <CartHeader 
          onClose={handleClose}
          onClear={handleClearCart}
          hasItems={items.length > 0}
        />

        <AnimatePresence mode="wait">
          {items.length === 0 ? (
            <EmptyCart onClose={handleClose} />
          ) : (
            <motion.div 
              className="flex flex-col h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
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

              <div className="border-t border-gray-100 bg-white p-4 space-y-4">
                {!showPromoInput && !activePromoCode && (
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-primary hover:text-primary hover:bg-primary/5"
                    onClick={() => setShowPromoInput(true)}
                  >
                    <Tag className="mr-2 h-4 w-4" />
                    Add promo code
                  </Button>
                )}

                <AnimatePresence mode="wait">
                  {showPromoInput && !activePromoCode && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-2"
                    >
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter promo code"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          className="flex-1"
                        />
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setShowPromoInput(false)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button 
                        className="w-full bg-primary/10 text-primary hover:bg-primary/20"
                        onClick={handleApplyPromoCode}
                        disabled={!promoCode.trim()}
                      >
                        Apply Code
                      </Button>
                    </motion.div>
                  )}

                  {activePromoCode && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center justify-between bg-primary/5 p-3 rounded-lg"
                    >
                      <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-primary" />
                        <span className="text-sm font-medium text-primary">
                          {activePromoCode.code} ({activePromoCode.discount}% OFF)
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removePromoCode}
                        className="h-8 w-8 p-0 hover:bg-primary/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  
                  {activePromoCode && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Discount</span>
                      <span className="text-primary font-medium">
                        -{formatPrice((subtotal * activePromoCode.discount) / 100)}
                      </span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>
                </div>

                <Button 
                  className="w-full h-14 text-base font-medium bg-primary hover:bg-primary/90"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout ({formatPrice(total)})
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </SheetContent>
    </Sheet>
  );
};