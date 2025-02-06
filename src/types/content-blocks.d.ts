export interface BaseBlockContent {
  [key: string]: string | number | boolean | null | Json;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
  detail?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  processing_fee: number;
  icon_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DeliveryMethod {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  base_price: number;
  estimated_days?: string;
  regions?: string[];
  created_at?: string;
  updated_at?: string;
}