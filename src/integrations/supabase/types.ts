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
      blog_categories: {
        Row: {
          created_at: string | null
          id: string
          name: string
          parent_id: string | null
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          parent_id?: string | null
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          slug?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          post_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          post_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string | null
          content: Json
          created_at: string | null
          excerpt: string | null
          featured_image: string | null
          id: string
          keywords: string[] | null
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          slug: string | null
          status: Database["public"]["Enums"]["post_status"]
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          author_id?: string | null
          content?: Json
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          keywords?: string[] | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["post_status"]
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          author_id?: string | null
          content?: Json
          created_at?: string | null
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          keywords?: string[] | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          slug?: string | null
          status?: Database["public"]["Enums"]["post_status"]
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts_categories: {
        Row: {
          category_id: string
          post_id: string
        }
        Insert: {
          category_id: string
          post_id: string
        }
        Update: {
          category_id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_posts_categories_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_settings: {
        Row: {
          created_at: string | null
          hero_background_image: string | null
          hero_subtitle: string
          hero_title: string
          id: string
          instagram_profile_url: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          hero_background_image?: string | null
          hero_subtitle?: string
          hero_title?: string
          id?: string
          instagram_profile_url?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          hero_background_image?: string | null
          hero_subtitle?: string
          hero_title?: string
          id?: string
          instagram_profile_url?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      bulk_file_shares: {
        Row: {
          access_level: string
          created_at: string | null
          created_by: string | null
          expires_at: string | null
          file_paths: string[]
          id: string
          share_token: string
        }
        Insert: {
          access_level: string
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          file_paths: string[]
          id?: string
          share_token: string
        }
        Update: {
          access_level?: string
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          file_paths?: string[]
          id?: string
          share_token?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string | null
          email: string
          full_name: string
          id: string
          message: string
          newsletter_subscription: boolean | null
          phone: string | null
          status: string | null
          subject: string
        }
        Insert: {
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          message: string
          newsletter_subscription?: boolean | null
          phone?: string | null
          status?: string | null
          subject: string
        }
        Update: {
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          message?: string
          newsletter_subscription?: boolean | null
          phone?: string | null
          status?: string | null
          subject?: string
        }
        Relationships: []
      }
      content_blocks: {
        Row: {
          content: Json
          created_at: string | null
          id: string
          order_index: number
          page_id: string | null
          type: Database["public"]["Enums"]["content_block_type"]
          updated_at: string | null
        }
        Insert: {
          content?: Json
          created_at?: string | null
          id?: string
          order_index: number
          page_id?: string | null
          type: Database["public"]["Enums"]["content_block_type"]
          updated_at?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          id?: string
          order_index?: number
          page_id?: string | null
          type?: Database["public"]["Enums"]["content_block_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_blocks_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      file_shares: {
        Row: {
          access_level: string
          created_at: string | null
          created_by: string | null
          expires_at: string | null
          file_path: string
          folder_path: string | null
          id: string
          share_token: string
        }
        Insert: {
          access_level: string
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          file_path: string
          folder_path?: string | null
          id?: string
          share_token: string
        }
        Update: {
          access_level?: string
          created_at?: string | null
          created_by?: string | null
          expires_at?: string | null
          file_path?: string
          folder_path?: string | null
          id?: string
          share_token?: string
        }
        Relationships: []
      }
      folders: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          name: string
          parent_path: string | null
          path: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          name: string
          parent_path?: string | null
          path: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          name: string
          parent_path?: string | null
          path?: string
        }
        Relationships: [
          {
            foreignKeyName: "folders_parent_path_fkey"
            columns: ["parent_path"]
            isOneToOne: false
            referencedRelation: "folders"
            referencedColumns: ["path"]
          },
        ]
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
          status: string
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
      page_views: {
        Row: {
          city: string | null
          country: string | null
          created_at: string | null
          id: string
          page_path: string
          referrer: string | null
          session_id: string
          user_agent: string | null
          view_type: Database["public"]["Enums"]["page_view_type"] | null
          visitor_ip: string | null
        }
        Insert: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          page_path: string
          referrer?: string | null
          session_id: string
          user_agent?: string | null
          view_type?: Database["public"]["Enums"]["page_view_type"] | null
          visitor_ip?: string | null
        }
        Update: {
          city?: string | null
          country?: string | null
          created_at?: string | null
          id?: string
          page_path?: string
          referrer?: string | null
          session_id?: string
          user_agent?: string | null
          view_type?: Database["public"]["Enums"]["page_view_type"] | null
          visitor_ip?: string | null
        }
        Relationships: []
      }
      pages: {
        Row: {
          allow_indexing: boolean | null
          canonical_url: string | null
          content: Json
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
          content?: Json
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
          content?: Json
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
          features: string[]
          id: string
          image: string
          media: Json | null
          name: string
          price: number
          specifications: Json
          updated_at: string | null
          why_choose_features: Json | null
        }
        Insert: {
          created_at?: string | null
          description: string
          features?: string[]
          id?: string
          image: string
          media?: Json | null
          name: string
          price: number
          specifications?: Json
          updated_at?: string | null
          why_choose_features?: Json | null
        }
        Update: {
          created_at?: string | null
          description?: string
          features?: string[]
          id?: string
          image?: string
          media?: Json | null
          name?: string
          price?: number
          specifications?: Json
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
      promo_codes: {
        Row: {
          code: string
          created_at: string | null
          description: string | null
          end_date: string | null
          id: string
          is_active: boolean | null
          max_uses: number | null
          min_purchase_amount: number | null
          start_date: string | null
          type: Database["public"]["Enums"]["promo_code_type"]
          updated_at: string | null
          uses_count: number | null
          value: number
        }
        Insert: {
          code: string
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_purchase_amount?: number | null
          start_date?: string | null
          type: Database["public"]["Enums"]["promo_code_type"]
          updated_at?: string | null
          uses_count?: number | null
          value: number
        }
        Update: {
          code?: string
          created_at?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          is_active?: boolean | null
          max_uses?: number | null
          min_purchase_amount?: number | null
          start_date?: string | null
          type?: Database["public"]["Enums"]["promo_code_type"]
          updated_at?: string | null
          uses_count?: number | null
          value?: number
        }
        Relationships: []
      }
      reviews: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          rating: number
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          rating: number
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          rating?: number
          user_id?: string
        }
        Relationships: []
      }
      shop_settings: {
        Row: {
          created_at: string
          default_currency: Database["public"]["Enums"]["supported_currency"]
          enable_guest_checkout: boolean | null
          id: string
          max_order_amount: number | null
          min_order_amount: number | null
          payment_methods: Json | null
          shipping_countries: string[] | null
          shipping_methods: Json | null
          stripe_settings: Json | null
          tax_rate: number | null
          tax_settings: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_currency?: Database["public"]["Enums"]["supported_currency"]
          enable_guest_checkout?: boolean | null
          id?: string
          max_order_amount?: number | null
          min_order_amount?: number | null
          payment_methods?: Json | null
          shipping_countries?: string[] | null
          shipping_methods?: Json | null
          stripe_settings?: Json | null
          tax_rate?: number | null
          tax_settings?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_currency?: Database["public"]["Enums"]["supported_currency"]
          enable_guest_checkout?: boolean | null
          id?: string
          max_order_amount?: number | null
          min_order_amount?: number | null
          payment_methods?: Json | null
          shipping_countries?: string[] | null
          shipping_methods?: Json | null
          stripe_settings?: Json | null
          tax_rate?: number | null
          tax_settings?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          contact_email: string | null
          created_at: string
          custom_scripts: Json | null
          default_language: Database["public"]["Enums"]["supported_language"]
          enable_cookie_consent: boolean | null
          enable_https_redirect: boolean | null
          enable_registration: boolean
          enable_search_indexing: boolean
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
          updated_at: string
        }
        Insert: {
          contact_email?: string | null
          created_at?: string
          custom_scripts?: Json | null
          default_language?: Database["public"]["Enums"]["supported_language"]
          enable_cookie_consent?: boolean | null
          enable_https_redirect?: boolean | null
          enable_registration?: boolean
          enable_search_indexing?: boolean
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
          updated_at?: string
        }
        Update: {
          contact_email?: string | null
          created_at?: string
          custom_scripts?: Json | null
          default_language?: Database["public"]["Enums"]["supported_language"]
          enable_cookie_consent?: boolean | null
          enable_https_redirect?: boolean | null
          enable_registration?: boolean
          enable_search_indexing?: boolean
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
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string
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
      admin_fetch_all_pages: {
        Args: Record<PropertyKey, never>
        Returns: {
          allow_indexing: boolean | null
          canonical_url: string | null
          content: Json
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
        }[]
      }
      get_daily_views: {
        Args: {
          days_back: number
        }
        Returns: {
          date: string
          count: number
        }[]
      }
      get_top_countries: {
        Args: {
          limit_count: number
        }
        Returns: {
          country: string
          count: number
        }[]
      }
      get_top_pages: {
        Args: {
          limit_count: number
        }
        Returns: {
          page_path: string
          count: number
        }[]
      }
      increment_post_view_count: {
        Args: {
          post_id: string
        }
        Returns: undefined
      }
      is_admin: {
        Args: {
          user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      block_type:
        | "hero"
        | "elevating_essentials"
        | "game_changer"
        | "features"
        | "store_brands"
        | "sustainability"
        | "product_carousel"
        | "testimonials"
        | "newsletter"
        | "about_hero_section"
        | "about_story"
        | "about_mission"
        | "about_sustainability"
        | "about_team"
        | "about_customer_impact"
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

export interface PaymentMethods {
  stripe: boolean;
  cash_on_delivery: boolean;
}

export interface StripeSettings {
  secret_key: string;
  publishable_key: string;
}

export interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  currency: string;
  estimatedDays: string;
}
