export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      orders: {
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
      }
      shop_settings: {
        Row: {
          id: string
          default_currency: string
          enable_guest_checkout: boolean
          min_order_amount: number
          max_order_amount: number | null
          shipping_countries: string[]
          tax_rate: number
          created_at: string
          updated_at: string
          payment_methods: Json
          stripe_settings: Json
          shipping_methods: Json
          tax_settings: Json
        }
        Insert: {
          id?: string
          default_currency: string
          enable_guest_checkout?: boolean
          min_order_amount?: number
          max_order_amount?: number | null
          shipping_countries?: string[]
          tax_rate?: number
          created_at: string
          updated_at: string
          payment_methods?: Json
          stripe_settings?: Json
          shipping_methods?: Json
          tax_settings?: Json
        }
        Update: {
          id?: string
          default_currency?: string
          enable_guest_checkout?: boolean
          min_order_amount?: number
          max_order_amount?: number | null
          shipping_countries?: string[]
          tax_rate?: number
          created_at?: string
          updated_at?: string
          payment_methods?: Json
          stripe_settings?: Json
          shipping_methods?: Json
          tax_settings?: Json
        }
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone_number: string | null
          address: string | null
          country: string | null
          region: string | null
          email_notifications: boolean
          marketing_emails: boolean
          language: string
          currency: string
          updated_at: string | null
          email: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          phone_number?: string | null
          address?: string | null
          country?: string | null
          region?: string | null
          email_notifications?: boolean
          marketing_emails?: boolean
          language?: string
          currency?: string
          updated_at?: string | null
          email?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          phone_number?: string | null
          address?: string | null
          country?: string | null
          region?: string | null
          email_notifications?: boolean
          marketing_emails?: boolean
          language?: string
          currency?: string
          updated_at?: string | null
          email?: string | null
        }
      }
      pages: {
        Row: {
          id: string;
          slug: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          slug: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      content_blocks: {
        Row: {
          id: string;
          type: string;
          content: Json;
          order_index: number;
          page_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          type: string;
          content: Json;
          order_index: number;
          page_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          type?: string;
          content?: Json;
          order_index?: number;
          page_id?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      site_settings: {
        Row: {
          id: string;
          homepage_slug: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          homepage_slug: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          homepage_slug?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      supported_currency: "USD" | "EUR" | "GBP" | "CAD"
      supported_language: "en" | "es" | "fr" | "uk"
    }
  }
}

export type PaymentMethods = {
  stripe: boolean;
  cash_on_delivery: boolean;
};

export type StripeSettings = {
  secret_key: string;
  publishable_key: string;
};

export type ShippingMethod = {
  id: string;
  name: string;
  price: number;
  currency: string;
  estimated_days: string;
};

export type ShippingMethods = {
  [country: string]: ShippingMethod[];
};

export type Tables = Database['public']['Tables']
