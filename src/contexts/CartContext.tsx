'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { PromoCode } from '@/types/promo-code';

export type CartItem = {
  id: string;
  name: string;
  description: string;
  image: string;
  quantity: number;
  price: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  applyPromoCode: (code: string) => Promise<void>;
  removePromoCode: () => void;
  activePromoCode: PromoCode | null;
  total: number;
  isCartAnimating: boolean;
  calculateDiscount: (promoCode: PromoCode, subtotal: number) => number;
  getDiscountDisplay: (promoCode: PromoCode) => string;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'elloria_cart';
const CART_EXPIRY_DAYS = 7;

export function CartProvider({ children }: { children: React.ReactNode }) {
  console.log('CartProvider initialized'); // Debug log

  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        const { items, expiryDate } = JSON.parse(savedCart);
        console.log('Loaded saved cart:', items); // Debug log
        if (new Date().getTime() < expiryDate) {
          return items;
        }
      } catch (error) {
        console.error('Error parsing cart data:', error);
      }
    }
    return [];
  });

  const [activePromoCode, setActivePromoCode] = useState<PromoCode | null>(null);
  const [isCartAnimating, setIsCartAnimating] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + CART_EXPIRY_DAYS);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({
      items,
      expiryDate: expiryDate.getTime()
    }));
    console.log('Cart updated in localStorage:', items); // Debug log
  }, [items]);

  const addItem = (newItem: CartItem) => {
    console.log('Adding item to cart:', newItem);
    if (!newItem.price || isNaN(newItem.price)) {
      console.error('Invalid price for item:', newItem);
      return;
    }

    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === newItem.id);
      
      if (existingItem) {
        return currentItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: Math.min(99, item.quantity + newItem.quantity) }
            : item
        );
      }
      
      return [...currentItems, { ...newItem, quantity: Math.min(99, newItem.quantity) }];
    });

    setIsCartAnimating(true);
    setTimeout(() => setIsCartAnimating(false), 500);

    toast.success('Item added to cart', {
      description: `${newItem.quantity}x ${newItem.name} has been added to your cart`,
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    console.log('Updating quantity:', { id, quantity });
    if (quantity < 1 || quantity > 99) return;
    
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeItem = (id: string) => {
    console.log('Removing item:', id);
    setItems(currentItems => currentItems.filter(item => item.id !== id));
    toast.success('Item removed from cart');
  };

  const clearCart = () => {
    setItems([]);
    setActivePromoCode(null);
    localStorage.removeItem(CART_STORAGE_KEY);
    toast.success('Cart cleared');
  };

  const applyPromoCode = async (code: string) => {
    try {
      console.log('Applying promo code:', code);
      
      const { data: promoCode, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', code)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching promo code:', error);
        toast.error('Invalid promo code');
        return;
      }

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
        toast.error('This promo code has reached its maximum uses');
        return;
      }

      if (subtotal < promoCode.min_purchase_amount) {
        toast.error(`Minimum purchase amount of $${promoCode.min_purchase_amount} required`);
        return;
      }

      // Increment uses_count
      const { error: updateError } = await supabase
        .from('promo_codes')
        .update({ uses_count: promoCode.uses_count + 1 })
        .eq('id', promoCode.id);

      if (updateError) {
        console.error('Error updating promo code uses:', updateError);
        toast.error('Failed to apply promo code');
        return;
      }

      setActivePromoCode(promoCode);
      toast.success('Promo code applied successfully!');
    } catch (error) {
      console.error('Error applying promo code:', error);
      toast.error('Failed to apply promo code');
    }
  };

  const removePromoCode = () => {
    setActivePromoCode(null);
    toast.success('Promo code removed');
  };

  const calculateDiscount = (promoCode: PromoCode, subtotal: number) => {
    if (!promoCode) return 0;
    
    if (promoCode.type === 'percentage') {
      return (subtotal * promoCode.value) / 100;
    } else {
      return promoCode.value;
    }
  };

  const getDiscountDisplay = (promoCode: PromoCode) => {
    if (!promoCode) return '';
    return promoCode.type === 'percentage' ? `${promoCode.value}%` : `$${promoCode.value}`;
  };

  const subtotal = items.reduce((sum, item) => {
    const itemTotal = item.price * item.quantity;
    return isNaN(itemTotal) ? sum : sum + itemTotal;
  }, 0);

  const total = activePromoCode
    ? Math.max(0, subtotal - calculateDiscount(activePromoCode, subtotal))
    : subtotal;

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const value = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    subtotal,
    total,
    applyPromoCode,
    removePromoCode,
    activePromoCode,
    calculateDiscount,
    getDiscountDisplay,
    isCartAnimating
  };

  console.log('CartProvider rendering with value:', value); // Debug log

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    console.error('useCart must be used within a CartProvider'); // Debug log
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};