export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Order {
  id: string;
  user_id: string;
  profile_id: string;
  order_number: string;
  total_amount: number;
  status: string;
  items: OrderItem[];
  shipping_address: ShippingAddress;
  billing_address: ShippingAddress;
  created_at: string | null;
  profile?: {
    full_name: string | null;
    email: string | null;
  };
}