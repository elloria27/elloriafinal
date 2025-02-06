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
      profiles: {
        Row: {
          id: string
          full_name: string | null
          email: string | null
          phone_number: string | null
          address: string | null
          country: string | null
          region: string | null
          language: string | null
          currency: string | null
          email_notifications: boolean | null
          marketing_emails: boolean | null
          completed_initial_setup: boolean | null
          selected_delivery_method: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          email?: string | null
          phone_number?: string | null
          address?: string | null
          country?: string | null
          region?: string | null
          language?: string | null
          currency?: string | null
          email_notifications?: boolean | null
          marketing_emails?: boolean | null
          completed_initial_setup?: boolean | null
          selected_delivery_method?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          email?: string | null
          phone_number?: string | null
          address?: string | null
          country?: string | null
          region?: string | null
          language?: string | null
          currency?: string | null
          email_notifications?: boolean | null
          marketing_emails?: boolean | null
          completed_initial_setup?: boolean | null
          selected_delivery_method?: string | null
          updated_at?: string | null
        }
      }
      pages: {
        Row: {
          id: string
          title: string
          slug: string
          is_published: boolean
          show_in_header: boolean
          show_in_footer: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          is_published?: boolean
          show_in_header?: boolean
          show_in_footer?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          is_published?: boolean
          show_in_header?: boolean
          show_in_footer?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      page_components: {
        Row: {
          id: string
          page_id: string
          type: string
          content: Json
          order_index: number
          settings: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          page_id: string
          type: string
          content: Json
          order_index: number
          settings?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          page_id?: string
          type?: string
          content?: Json
          order_index?: number
          settings?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      site_settings: {
        Row: {
          id: string
          site_title: string
          default_language: Database['public']['Enums']['supported_language']
          enable_registration: boolean
          enable_search_indexing: boolean
          meta_description: string | null
          meta_keywords: string | null
          custom_scripts: Json[]
          created_at: string
          updated_at: string
          homepage_slug: string
        }
        Insert: {
          id?: string
          site_title: string
          default_language: Database['public']['Enums']['supported_language']
          enable_registration?: boolean
          enable_search_indexing?: boolean
          meta_description?: string | null
          meta_keywords?: string | null
          custom_scripts?: Json[]
          created_at?: string
          updated_at?: string
          homepage_slug?: string
        }
        Update: {
          id?: string
          site_title?: string
          default_language?: Database['public']['Enums']['supported_language']
          enable_registration?: boolean
          enable_search_indexing?: boolean
          meta_description?: string | null
          meta_keywords?: string | null
          custom_scripts?: Json[]
          created_at?: string
          updated_at?: string
          homepage_slug?: string
        }
      }
      shop_settings: {
        Row: {
          id: string
          default_currency: Database['public']['Enums']['supported_currency']
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          default_currency: Database['public']['Enums']['supported_currency']
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          default_currency?: Database['public']['Enums']['supported_currency']
          created_at?: string
          updated_at?: string
        }
      }
    }
    Enums: {
      supported_language: 'en' | 'fr' | 'uk'
      supported_currency: 'USD' | 'EUR' | 'UAH' | 'CAD'
    }
  }
}

export type Tables = Database['public']['Tables']
export type Enums = Database['public']['Enums']