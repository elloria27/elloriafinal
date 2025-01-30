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
      content_block_type: string
      post_status: "draft" | "published"
      supported_currency: "USD" | "EUR" | "GBP"
      supported_language: "en" | "es" | "fr"
      user_role: "admin" | "client"
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
  name: string;
  price: number;
  estimated_days: string;
};

export type ShippingMethods = {
  [country: string]: ShippingMethod[];
};
