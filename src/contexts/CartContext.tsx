import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/contexts/CartContext";
import { PromoCode } from '@/types/promo-code';
import { toast } from 'sonner';

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  activePromoCode: PromoCode | null;
  applyPromoCode: (code: string) => Promise<void>;
  removePromoCode: () => void;
  calculateDiscount: (promoCode: PromoCode, subtotal: number) => number;
  getDiscountDisplay: (promoCode: PromoCode) => string;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const savedItems = localStorage.getItem('cartItems');
    return savedItems ? JSON.parse(savedItems) : [];
  });
  
  const [activePromoCode, setActivePromoCode] = useState<PromoCode | null>(() => {
    const savedPromoCode = localStorage.getItem('activePromoCode');
    return savedPromoCode ? { code: savedPromoCode, type: 'percentage', value: 10 } : null;
  });

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(items));
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      }
      return [...prevItems, item];
    });
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  const applyPromoCode = async (code: string) => {
    try {
      const { data: promoCode, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', code)
        .eq('is_active', true)
        .single();

      if (error) throw error;

      if (!promoCode) {
        toast.error('Invalid promo code');
        return;
      }

      const now = new Date();
      if (promoCode.start_date && new Date(promoCode.start_date) > now) {
        toast.error('This promo code is not active yet');
        return;
      }

      if (promoCode.end_date && new Date(promoCode.end_date) < now) {
        toast.error('This promo code has expired');
        return;
      }

      if (promoCode.max_uses && promoCode.uses_count >= promoCode.max_uses) {
        toast.error('This promo code has reached its usage limit');
        return;
      }

      setActivePromoCode(promoCode);
      localStorage.setItem('activePromoCode', promoCode.code);
      toast.success('Promo code applied successfully');
    } catch (error) {
      console.error('Error applying promo code:', error);
      toast.error('Failed to apply promo code');
    }
  };

  const removePromoCode = () => {
    setActivePromoCode(null);
    localStorage.removeItem('activePromoCode');
    toast.success('Promo code removed');
  };

  const calculateDiscount = (promoCode: PromoCode, subtotal: number) => {
    if (!promoCode) return 0;
    return promoCode.type === 'percentage' ? (subtotal * promoCode.value) / 100 : promoCode.value;
  };

  const getDiscountDisplay = (promoCode: PromoCode) => {
    return promoCode.type === 'percentage' ? `${promoCode.value}%` : `$${promoCode.value.toFixed(2)}`;
  };

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      subtotal,
      activePromoCode,
      applyPromoCode,
      removePromoCode,
      calculateDiscount,
      getDiscountDisplay
    }}>
      {children}
    </CartContext.Provider>
  );
};
