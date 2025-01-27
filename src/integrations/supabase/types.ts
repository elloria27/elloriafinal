export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      content_blocks: {
        Row: {
          id: string
          page_id: string | null
          type: BlockType
          content: Json
          order_index: number
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          page_id?: string | null
          type: BlockType
          content?: Json
          order_index: number
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          page_id?: string | null
          type?: BlockType
          content?: Json
          order_index?: number
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_blocks_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          }
        ]
      }
      orders: {
        Row: {
          id: string
          user_id: string
          order_number: string
          status: string
          total_amount: number
          items: Json
          shipping_address: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          order_number: string
          status?: string
          total_amount: number
          items: Json
          shipping_address: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          order_number?: string
          status?: string
          total_amount?: number
          items?: Json
          shipping_address?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      pages: {
        Row: {
          id: string
          title: string
          slug: string
          content: Json
          is_published: boolean
          show_in_header: boolean
          show_in_footer: boolean
          created_at: string
          updated_at: string
          page_template: string | null
          parent_id: string | null
          menu_order: number | null
          menu_type: string | null
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content?: Json
          is_published?: boolean
          show_in_header?: boolean
          show_in_footer?: boolean
          created_at?: string
          updated_at?: string
          page_template?: string | null
          parent_id?: string | null
          menu_order?: number | null
          menu_type?: string | null
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: Json
          is_published?: boolean
          show_in_header?: boolean
          show_in_footer?: boolean
          created_at?: string
          updated_at?: string
          page_template?: string | null
          parent_id?: string | null
          menu_order?: number | null
          menu_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          user_id: string
          first_name: string | null
          last_name: string | null
          email: string
          phone: string | null
          address: string | null
          city: string | null
          state: string | null
          country: string | null
          postal_code: string | null
          preferences: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          first_name?: string | null
          last_name?: string | null
          email: string
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          country?: string | null
          postal_code?: string | null
          preferences?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          first_name?: string | null
          last_name?: string | null
          email?: string
          phone?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          country?: string | null
          postal_code?: string | null
          preferences?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          product_id: string
          rating: number
          title: string | null
          content: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          product_id: string
          rating: number
          title?: string | null
          content?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          product_id?: string
          rating?: number
          title?: string | null
          content?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Enums: {
      supported_language: 'en' | 'fr' | 'uk'
      supported_currency: 'USD' | 'EUR' | 'UAH' | 'CAD'
      user_role: 'admin' | 'client'
      page_view_type: 'page_view' | 'scroll_depth' | 'click'
    }
  }
}

export type BlockType = 
  | "heading"
  | "text"
  | "image"
  | "video"
  | "button"
  | "hero"
  | "features"
  | "testimonials"
  | "newsletter"
  | "product_gallery"
  | "blog_preview"
  | "store_brands"
  | "sustainability"
  | "product_carousel"
  | "elevating_essentials"
  | "game_changer"
  | "competitor_comparison"
  | "about_hero_section"
  | "about_story"
  | "about_mission"
  | "about_sustainability"
  | "about_team"
  | "about_customer_impact"

export type Tables<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never
