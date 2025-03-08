
// Модель замовлення, яка відповідає структурі в Supabase
export interface Order {
  id: string;
  order_number: string;
  user_id?: string;
  profile_id?: string;
  items: OrderItem[];
  shipping_address: Address;
  billing_address: Address;
  shipping_cost: number;
  gst: number;
  total_amount: number;
  status: OrderStatus;
  payment_method?: string;
  stripe_session_id?: string;
  applied_promo_code?: PromoCode;
  created_at?: string;
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface Address {
  first_name: string;
  last_name: string;
  address: string;
  city: string;
  region: string;
  postal_code: string;
  country: string;
  email: string;
  phone?: string;
}

export interface PromoCode {
  code: string;
  discount_amount: number;
  discount_type: 'percentage' | 'fixed';
}

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

// Функція для перетворення даних з бази даних у модель Order
export const parseOrder = (data: any): Order => {
  return {
    id: data.id,
    order_number: data.order_number,
    user_id: data.user_id,
    profile_id: data.profile_id,
    items: Array.isArray(data.items) ? data.items : [],
    shipping_address: data.shipping_address,
    billing_address: data.billing_address,
    shipping_cost: Number(data.shipping_cost || 0),
    gst: Number(data.gst || 0),
    total_amount: Number(data.total_amount),
    status: data.status,
    payment_method: data.payment_method,
    stripe_session_id: data.stripe_session_id,
    applied_promo_code: data.applied_promo_code,
    created_at: data.created_at
  };
};
