export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface ShippingAddress {
  address: string;
  region: string;
  country: string;
  phone: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface OrderProfile {
  full_name?: string;
  email?: string;
}

export interface OrderData {
  id: string;
  user_id?: string;
  profile_id?: string;
  order_number: string;
  total_amount: number;
  status: OrderStatus;
  shipping_address: ShippingAddress;
  billing_address: ShippingAddress;
  items: OrderItem[];
  created_at: string;
  profile?: OrderProfile;
}