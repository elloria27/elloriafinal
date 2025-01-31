export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type ShippingAddress = {
  address: string;
  region: string;
  country: string;
  phone: string;
  first_name?: string;
  last_name?: string;
  email?: string;
};

export type OrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
};

export type OrderProfile = {
  full_name: string;
  email: string;
  phone_number?: string;
  address?: string;
};

export type AppliedPromoCode = {
  code: string;
  type: 'percentage' | 'fixed_amount';
  value: number;
};

export type OrderData = {
  id: string;
  user_id: string | null;
  profile_id: string | null;
  order_number: string;
  total_amount: number;
  status: OrderStatus;
  shipping_address: ShippingAddress;
  billing_address: ShippingAddress;
  items: OrderItem[];
  created_at: string;
  profile?: OrderProfile;
  payment_method?: string | null;
  shipping_cost: number;
  applied_promo_code?: AppliedPromoCode | null;
};