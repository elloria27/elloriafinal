import { Json } from './database.types'

export interface ShopSettingTable {
  Row: {
    id: string
    default_currency: SupportedCurrency
    enable_guest_checkout: boolean | null
    min_order_amount: number | null
    max_order_amount: number | null
    shipping_countries: string[] | null
    tax_rate: number | null
    created_at: string
    updated_at: string
    payment_methods: Json | null
    stripe_settings: Json | null
    shipping_methods: Json | null
    tax_settings: Json | null
  }
  Insert: {
    id?: string
    default_currency?: SupportedCurrency
    enable_guest_checkout?: boolean | null
    min_order_amount?: number | null
    max_order_amount?: number | null
    shipping_countries?: string[] | null
    tax_rate?: number | null
    created_at?: string
    updated_at?: string
    payment_methods?: Json | null
    stripe_settings?: Json | null
    shipping_methods?: Json | null
    tax_settings?: Json | null
  }
  Update: {
    id?: string
    default_currency?: SupportedCurrency
    enable_guest_checkout?: boolean | null
    min_order_amount?: number | null
    max_order_amount?: number | null
    shipping_countries?: string[] | null
    tax_rate?: number | null
    created_at?: string
    updated_at?: string
    payment_methods?: Json | null
    stripe_settings?: Json | null
    shipping_methods?: Json | null
    tax_settings?: Json | null
  }
  Relationships: []
}

export type SupportedCurrency = 'USD' | 'EUR' | 'UAH' | 'CAD'

export interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  currency: string;
  estimatedDays: string;
}

export interface ShippingMethods {
  CA: ShippingMethod[];
  US: ShippingMethod[];
}

export interface StripeSettings {
  secret_key: string;
  publishable_key: string;
}

export interface PaymentMethods {
  stripe: boolean;
  cash_on_delivery: boolean;
}

export interface OrderTable {
  Row: {
    id: string
    user_id: string | null
    order_number: string
    total_amount: number
    status: string
    items: Json
    shipping_address: Json
    billing_address: Json
    created_at: string | null
    profile_id: string | null
    payment_method: string | null
    stripe_session_id: string | null
    applied_promo_code: Json | null
  }
  Insert: {
    id?: string
    user_id?: string | null
    order_number: string
    total_amount: number
    status: string
    items: Json
    shipping_address: Json
    billing_address: Json
    created_at?: string | null
    profile_id?: string | null
    payment_method?: string | null
    stripe_session_id?: string | null
    applied_promo_code?: Json | null
  }
  Update: {
    id?: string
    user_id?: string | null
    order_number?: string
    total_amount?: number
    status?: string
    items?: Json
    shipping_address?: Json
    billing_address?: Json
    created_at?: string | null
    profile_id?: string | null
    payment_method?: string | null
    stripe_session_id?: string | null
    applied_promo_code?: Json | null
  }
  Relationships: []
}