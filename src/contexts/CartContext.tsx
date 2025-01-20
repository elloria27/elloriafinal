import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export type CartItem = {
  id: number;
  name: string;
  description: string;
  image: string;
  quantity: number;
  price: number;
};

type PromoCode = {
  code: string;
  discount: number; // percentage discount
};

// Sample promo codes (in a real app, these would come from a backend)
const VALID_PROMO_CODES: PromoCode[] = [
  { code: 'WELCOME10', discount: 10 },
  { code: 'SAVE20', discount: 20 },
];

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  applyPromoCode: (code: string) => void;
  removePromoCode: () => void;
  activePromoCode: PromoCode | null;
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'elloria_cart';
const CART_EXPIRY_DAYS = 7;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      const { items, expiryDate } = JSON.parse(savedCart);
      if (new Date().getTime() < expiryDate) {
        return items;
      }
    }
    return [];
  });

  const [activePromoCode, setActivePromoCode] = useState<PromoCode | null>(null);

  useEffect(() => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + CART_EXPIRY_DAYS);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({
      items,
      expiryDate: expiryDate.getTime()
    }));
  }, [items]);

  const addItem = (newItem: CartItem) => {
    setItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === newItem.id);
      
      if (existingItem) {
        return currentItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      
      return [...currentItems, newItem];
    });

    toast.success('Item added to cart', {
      description: `${newItem.quantity}x ${newItem.name} has been added to your cart`,
    });
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity < 1) return;
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, Math.min(99, quantity)) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));
    toast.success('Item removed from cart');
  };

  const clearCart = () => {
    setItems([]);
    setActivePromoCode(null);
    localStorage.removeItem(CART_STORAGE_KEY);
    toast.success('Cart cleared');
  };

  const applyPromoCode = (code: string) => {
    const promoCode = VALID_PROMO_CODES.find(
      promo => promo.code.toLowerCase() === code.toLowerCase()
    );

    if (promoCode) {
      setActivePromoCode(promoCode);
      toast.success('Promo code applied successfully!');
    } else {
      toast.error('Invalid promo code');
    }
  };

  const removePromoCode = () => {
    setActivePromoCode(null);
    toast.success('Promo code removed');
  };

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = activePromoCode ? (subtotal * activePromoCode.discount) / 100 : 0;
  const total = subtotal - discountAmount;
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
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
      activePromoCode
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};