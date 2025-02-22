
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { CartItem, CartContextType } from '@/types/cart';
import { PromoCode } from '@/types/promo-code';
import { toast } from 'sonner';

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
    if (!savedPromoCode) return null;
    
    // We'll fetch the full promo code details from the database
    const fetchPromoCode = async () => {
      if (!supabase) return null;
      
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .eq('code', savedPromoCode)
        .single();
      
      if (error || !data) {
        localStorage.removeItem('activePromoCode');
        return null;
      }
      
      return data;
    };
    
    // Initialize with basic data, will be updated after fetch
    fetchPromoCode().then(code => {
      if (code) setActivePromoCode(code);
    });
    
    return null;
  });

  const [isCartAnimating, setIsCartAnimating] = useState(false);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(items));
  }, [items]);

  // Listen for cart clear messages
  useEffect(() => {
    console.log('Setting up cart clear listener');
    
    // Only set up realtime subscription if supabase is configured
    let channel: any;
    
    if (supabase) {
      channel = supabase
        .channel('cart_clear')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'broadcast',
            filter: `type=eq.CLEAR_CART`,
          },
          (payload) => {
            console.log('Received cart clear message:', payload);
            clearCart();
            toast.success("Thank you for your purchase! Your cart has been cleared.");
          }
        )
        .subscribe();
    }

    return () => {
      if (channel && supabase) {
        console.log('Cleaning up cart clear listener');
        supabase.removeChannel(channel);
      }
    };
  }, []);

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
    setIsCartAnimating(true);
    setTimeout(() => setIsCartAnimating(false), 500);
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
    console.log('Clearing cart');
    setItems([]);
    setActivePromoCode(null);
    localStorage.removeItem('activePromoCode');
    localStorage.removeItem('cartItems');
    toast.success('Cart has been cleared');
  };

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const applyPromoCode = async (code: string) => {
    try {
      if (!supabase) {
        toast.error('System is not configured yet');
        return;
      }

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

  const discountAmount = activePromoCode ? calculateDiscount(activePromoCode, subtotal) : 0;
  const total = subtotal - discountAmount;

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      subtotal,
      total,
      totalItems,
      isCartAnimating,
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
