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
      blog_posts: {
        Row: {
          author_id: string | null
          content: string | null
          created_at: string | null
          excerpt: string | null
          featured_image: string | null
          id: string
          published_at: string | null
          status: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          applied_promo_code: Json | null
          billing_address: Json
          created_at: string | null
          id: string
          items: Json
          order_number: string
          payment_method: string | null
          profile_id: string | null
          shipping_address: Json
          status: string
          stripe_session_id: string | null
          total_amount: number
          user_id: string | null
        }
        Insert: {
          applied_promo_code?: Json | null
          billing_address: Json
          created_at?: string | null
          id?: string
          items: Json
          order_number: string
          payment_method?: string | null
          profile_id?: string | null
          shipping_address: Json
          status?: string
          stripe_session_id?: string | null
          total_amount: number
          user_id?: string | null
        }
        Update: {
          applied_promo_code?: Json | null
          billing_address?: Json
          created_at?: string | null
          id?: string
          items?: Json
          order_number?: string
          payment_method?: string | null
          profile_id?: string | null
          shipping_address?: Json
          status?: string
          stripe_session_id?: string | null
          total_amount?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          allow_indexing: boolean | null
          canonical_url: string | null
          content: Json | null
          content_blocks: Json[] | null
          created_at: string | null
          id: string
          is_published: boolean | null
          menu_order: number | null
          menu_type: string | null
          meta_description: string | null
          meta_keywords: string | null
          meta_title: string | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          page_template: string | null
          parent_id: string | null
          show_in_footer: boolean | null
          show_in_header: boolean | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          allow_indexing?: boolean | null
          canonical_url?: string | null
          content?: Json | null
          content_blocks?: Json[] | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          menu_order?: number | null
          menu_type?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_template?: string | null
          parent_id?: string | null
          show_in_footer?: boolean | null
          show_in_header?: boolean | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          allow_indexing?: boolean | null
          canonical_url?: string | null
          content?: Json | null
          content_blocks?: Json[] | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          menu_order?: number | null
          menu_type?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_template?: string | null
          parent_id?: string | null
          show_in_footer?: boolean | null
          show_in_header?: boolean | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          created_at: string | null
          description: string
          features: string[] | null
          id: string
          image: string
          media: Json | null
          name: string
          price: number
          specifications: Json | null
          updated_at: string | null
          why_choose_features: Json | null
        }
        Insert: {
          created_at?: string | null
          description: string
          features?: string[] | null
          id?: string
          image: string
          media?: Json | null
          name: string
          price: number
          specifications?: Json | null
          updated_at?: string | null
          why_choose_features?: Json | null
        }
        Update: {
          created_at?: string | null
          description?: string
          features?: string[] | null
          id?: string
          image?: string
          media?: Json | null
          name?: string
          price?: number
          specifications?: Json | null
          updated_at?: string | null
          why_choose_features?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          country: string | null
          currency: string | null
          email: string | null
          email_notifications: boolean | null
          full_name: string | null
          id: string
          language: string | null
          marketing_emails: boolean | null
          phone_number: string | null
          region: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          country?: string | null
          currency?: string | null
          email?: string | null
          email_notifications?: boolean | null
          full_name?: string | null
          id: string
          language?: string | null
          marketing_emails?: boolean | null
          phone_number?: string | null
          region?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          country?: string | null
          currency?: string | null
          email?: string | null
          email_notifications?: boolean | null
          full_name?: string | null
          id?: string
          language?: string | null
          marketing_emails?: boolean | null
          phone_number?: string | null
          region?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          contact_email: string | null
          created_at: string | null
          custom_scripts: Json | null
          default_language:
            | Database["public"]["Enums"]["supported_language"]
            | null
          enable_cookie_consent: boolean | null
          enable_https_redirect: boolean | null
          enable_registration: boolean | null
          enable_search_indexing: boolean | null
          enable_user_avatars: boolean | null
          favicon_url: string | null
          google_analytics_id: string | null
          homepage_slug: string | null
          id: string
          maintenance_mode: boolean | null
          max_upload_size: number | null
          meta_description: string | null
          meta_keywords: string | null
          site_title: string
          updated_at: string | null
        }
        Insert: {
          contact_email?: string | null
          created_at?: string | null
          custom_scripts?: Json | null
          default_language?:
            | Database["public"]["Enums"]["supported_language"]
            | null
          enable_cookie_consent?: boolean | null
          enable_https_redirect?: boolean | null
          enable_registration?: boolean | null
          enable_search_indexing?: boolean | null
          enable_user_avatars?: boolean | null
          favicon_url?: string | null
          google_analytics_id?: string | null
          homepage_slug?: string | null
          id?: string
          maintenance_mode?: boolean | null
          max_upload_size?: number | null
          meta_description?: string | null
          meta_keywords?: string | null
          site_title: string
          updated_at?: string | null
        }
        Update: {
          contact_email?: string | null
          created_at?: string | null
          custom_scripts?: Json | null
          default_language?:
            | Database["public"]["Enums"]["supported_language"]
            | null
          enable_cookie_consent?: boolean | null
          enable_https_redirect?: boolean | null
          enable_registration?: boolean | null
          enable_search_indexing?: boolean | null
          enable_user_avatars?: boolean | null
          favicon_url?: string | null
          google_analytics_id?: string | null
          homepage_slug?: string | null
          id?: string
          maintenance_mode?: boolean | null
          max_upload_size?: number | null
          meta_description?: string | null
          meta_keywords?: string | null
          site_title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      content_block_type:
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
        | "about_sustainability"
        | "about_team"
        | "about_customer_impact"
        | "contact_hero"
        | "contact_details"
        | "contact_form"
        | "contact_faq"
        | "contact_business"
      page_view_type: "page_view" | "exit"
      post_status: "draft" | "published"
      promo_code_type: "percentage" | "fixed_amount"
      supported_currency: "USD" | "EUR" | "UAH" | "CAD"
      supported_language: "en" | "fr" | "uk"
      user_role: "admin" | "client"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
