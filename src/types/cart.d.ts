import { PromoCode } from './promo-code';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  total: number;
  totalItems: number;
  isCartAnimating: boolean;
  activePromoCode: PromoCode | null;
  applyPromoCode: (code: string) => Promise<void>;
  removePromoCode: () => void;
  calculateDiscount: (promoCode: PromoCode, subtotal: number) => number;
  getDiscountDisplay: (promoCode: PromoCode) => string;
}