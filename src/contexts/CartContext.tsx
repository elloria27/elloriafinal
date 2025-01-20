import React, { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';

export type CartItem = {
  id: number;
  name: string;
  description: string;
  image: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

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
    setItems(currentItems =>
      currentItems.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setItems(currentItems => currentItems.filter(item => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ 
      items, 
      addItem, 
      removeItem, 
      updateQuantity,
      clearCart, 
      totalItems 
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