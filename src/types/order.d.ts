export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface ShippingAddress {
  address: string;
  region: string;
  country: string;
  phone: string;
}

export interface OrderData {
  id: string;
  user_id: string;
  profile_id: string;
  order_number: string;
  total_amount: number;
  status: OrderStatus;
  items: OrderItem[];
  shipping_address: ShippingAddress;
  billing_address: ShippingAddress;
  created_at: string | null;
  profile?: {
    full_name: string | null;
    email: string | null;
  };
}