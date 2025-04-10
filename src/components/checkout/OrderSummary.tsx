import { CartItem } from "@/types/cart";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { PromoCode } from '@/types/promo-code';

interface OrderSummaryProps {
  items: CartItem[];
  subtotalInCurrentCurrency: number;
  currencySymbol: string;
  taxes: {
    gst: number;
    pst: number;
    hst: number;
    region: string;
  };
  selectedShippingOption: {
    price: number;
    name: string;
  } | undefined;
  total: number;
  activePromoCode: PromoCode | null;
}

export const OrderSummary = ({
  items,
  subtotalInCurrentCurrency,
  currencySymbol,
  taxes,
  selectedShippingOption,
  activePromoCode
}: OrderSummaryProps) => {
  const [promoCode, setPromoCode] = useState("");
  const { applyPromoCode, removePromoCode, calculateDiscount, getDiscountDisplay } = useCart();

  // Load saved promo code from localStorage on component mount
  useEffect(() => {
    const savedPromoCode = localStorage.getItem('activePromoCode');
    if (savedPromoCode && !activePromoCode) {
      applyPromoCode(savedPromoCode);
    }
  }, []);

  const handlePromoCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim()) {
      applyPromoCode(promoCode.trim());
      localStorage.setItem('activePromoCode', promoCode.trim());
      setPromoCode("");
    }
  };

  // Calculate tax amounts based on original subtotal (BEFORE discount)
  const gstAmount = (taxes.gst / 100) * subtotalInCurrentCurrency;
  const pstAmount = taxes.region === "Manitoba" ? 0 : (taxes.pst / 100) * subtotalInCurrentCurrency;
  const hstAmount = (taxes.hst / 100) * subtotalInCurrentCurrency;
  
  // Calculate shipping cost
  const shippingCost = selectedShippingOption?.price || 0;

  // Calculate discount amount if promo code exists (only on subtotal)
  const discountAmount = activePromoCode ? calculateDiscount(activePromoCode, subtotalInCurrentCurrency) : 0;
  
  // Calculate subtotal after discount
  const subtotalAfterDiscount = subtotalInCurrentCurrency - discountAmount;

  // Calculate total (subtotal after discount + taxes + shipping)
  const total = subtotalAfterDiscount + gstAmount + pstAmount + hstAmount + shippingCost;

  return (
    <div className="bg-gray-50 p-6 rounded-lg space-y-4">
      <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
      
      {items.map((item) => (
        <div key={item.id} className="flex justify-between text-sm">
          <span>{item.quantity}x {item.name}</span>
          <span>{currencySymbol}{(item.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}

      <div className="border-t pt-4 mt-4">
        <div className="space-y-2 mb-4">
          <h3 className="font-medium">Promo Code</h3>
          {activePromoCode ? (
            <div className="flex justify-between items-center bg-accent-green p-2 rounded">
              <span className="text-sm">
                Code <strong>{activePromoCode.code}</strong> applied ({getDiscountDisplay(activePromoCode)} off)
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  removePromoCode();
                  localStorage.removeItem('activePromoCode');
                }}
                className="text-sm hover:bg-red-100"
              >
                Remove
              </Button>
            </div>
          ) : (
            <form onSubmit={handlePromoCodeSubmit} className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" variant="outline">Apply</Button>
            </form>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{currencySymbol}{subtotalInCurrentCurrency.toFixed(2)}</span>
          </div>
          
          {activePromoCode && (
            <div className="flex justify-between text-green-600">
              <span>Discount ({getDiscountDisplay(activePromoCode)})</span>
              <span>-{currencySymbol}{discountAmount.toFixed(2)}</span>
            </div>
          )}

          {taxes.gst > 0 && (
            <div className="flex justify-between">
              <span>GST ({taxes.gst}%)</span>
              <span>{currencySymbol}{gstAmount.toFixed(2)}</span>
            </div>
          )}

          {taxes.pst > 0 && taxes.region !== "Manitoba" && (
            <div className="flex justify-between">
              <span>PST ({taxes.pst}%)</span>
              <span>{currencySymbol}{pstAmount.toFixed(2)}</span>
            </div>
          )}

          {taxes.hst > 0 && (
            <div className="flex justify-between">
              <span>HST ({taxes.hst}%)</span>
              <span>{currencySymbol}{hstAmount.toFixed(2)}</span>
            </div>
          )}
          
          {selectedShippingOption && (
            <div className="flex justify-between">
              <span>Shipping ({selectedShippingOption.name})</span>
              <span>{currencySymbol}{selectedShippingOption.price.toFixed(2)}</span>
            </div>
          )}
          
          <div className="flex justify-between font-semibold text-lg pt-2 border-t">
            <span>Total</span>
            <span>{currencySymbol}{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};