import { Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { PromoCode } from "@/contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";

interface CartSummaryProps {
  subtotal: number;
  total: number;
  promoCode: string;
  activePromoCode: PromoCode | null;
  onPromoCodeChange: (code: string) => void;
  onApplyPromoCode: () => void;
  onRemovePromoCode: () => void;
  formatPrice: (price: number) => string;
}

export const CartSummary = ({
  subtotal,
  total,
  promoCode,
  activePromoCode,
  onPromoCodeChange,
  onApplyPromoCode,
  onRemovePromoCode,
  formatPrice,
}: CartSummaryProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {!activePromoCode && (
        <div className="flex items-center gap-2">
          <Input
            placeholder="Enter promo code"
            value={promoCode}
            onChange={(e) => onPromoCodeChange(e.target.value)}
            className="flex-1 rounded-xl bg-white/80 border-gray-200"
          />
          <Button 
            variant="outline"
            onClick={onApplyPromoCode}
            disabled={!promoCode.trim()}
            className="whitespace-nowrap rounded-xl border-gray-200 bg-white hover:bg-primary hover:text-white"
          >
            <Tag className="mr-2 h-4 w-4" />
            Apply
          </Button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {activePromoCode && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-between bg-primary/5 p-4 rounded-xl"
          >
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-medium">
                {activePromoCode.code} ({activePromoCode.discount}% OFF)
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemovePromoCode}
              className="h-8 w-8 p-0 hover:bg-primary/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4 bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-gray-100/50">
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
        
        <Separator className="my-2" />
        
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span className="text-primary">{formatPrice(total)}</span>
        </div>
      </div>
    </motion.div>
  );
};