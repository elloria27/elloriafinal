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
      chat_interactions: {
        Row: {
          created_at: string | null
          id: string
          message: string
          response: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          response: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          response?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      component_definitions: {
        Row: {
          category: string
          created_at: string | null
          default_props: Json | null
          description: string | null
          icon: string | null
          id: string
          name: string
          status: Database["public"]["Enums"]["component_status"] | null
          type: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          default_props?: Json | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          status?: Database["public"]["Enums"]["component_status"] | null
          type: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          default_props?: Json | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          status?: Database["public"]["Enums"]["component_status"] | null
          type?: string
          updated_at?: string | null
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
      cycle_settings: {
        Row: {
          created_at: string | null
          cycle_length: number
          id: string
          last_period_date: string | null
          notifications_enabled: boolean | null
          period_length: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          cycle_length?: number
          id?: string
          last_period_date?: string | null
          notifications_enabled?: boolean | null
          period_length?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          cycle_length?: number
          id?: string
          last_period_date?: string | null
          notifications_enabled?: boolean | null
          period_length?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      delivery_methods: {
        Row: {
          base_price: number | null
          created_at: string | null
          description: string | null
          estimated_days: string | null
          id: string
          is_active: boolean | null
          name: string
          regions: string[] | null
          updated_at: string | null
        }
        Insert: {
          base_price?: number | null
          created_at?: string | null
          description?: string | null
          estimated_days?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          regions?: string[] | null
          updated_at?: string | null
        }
        Update: {
          base_price?: number | null
          created_at?: string | null
          description?: string | null
          estimated_days?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          regions?: string[] | null
          updated_at?: string | null
        }
        Relationships: []
      }
      donation_settings: {
        Row: {
          button_link: string | null
          button_text: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          page_id: string | null
          title: string | null
          updated_at: string | null
        }
        Insert: {
          button_link?: string | null
          button_text?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          page_id?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Update: {
          button_link?: string | null
          button_text?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          page_id?: string | null
          title?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "donation_settings_page_id_fkey"
            columns: ["page_id"]
            isOneToOne: false
            referencedRelation: "pages"
            referencedColumns: ["id"]
          },
        ]
      }
      donations: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          donor_email: string | null
          donor_name: string | null
          id: string
          payment_method: string | null
          status: string | null
          stripe_session_id: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          donor_email?: string | null
          donor_name?: string | null
          id?: string
          payment_method?: string | null
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          donor_email?: string | null
          donor_name?: string | null
          id?: string
          payment_method?: string | null
          status?: string | null
          stripe_session_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
          name?: string
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
      hrm_personal_reminders: {
        Row: {
          admin_id: string
          created_at: string
          description: string | null
          email_notify: boolean
          id: string
          recurrence: Database["public"]["Enums"]["reminder_recurrence"]
          reminder_date: string
          reminder_time: string
          status: boolean
          title: string
          updated_at: string
        }
        Insert: {
          admin_id: string
          created_at?: string
          description?: string | null
          email_notify?: boolean
          id?: string
          recurrence?: Database["public"]["Enums"]["reminder_recurrence"]
          reminder_date: string
          reminder_time: string
          status?: boolean
          title: string
          updated_at?: string
        }
        Update: {
          admin_id?: string
          created_at?: string
          description?: string | null
          email_notify?: boolean
          id?: string
          recurrence?: Database["public"]["Enums"]["reminder_recurrence"]
          reminder_date?: string
          reminder_time?: string
          status?: boolean
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      inventory: {
        Row: {
          created_at: string | null
          id: string
          last_counted_at: string | null
          location: string | null
          low_stock_threshold: number | null
          optimal_stock: number | null
          product_id: string
          quantity: number
          reorder_point: number | null
          sku: string | null
          unit_cost: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_counted_at?: string | null
          location?: string | null
          low_stock_threshold?: number | null
          optimal_stock?: number | null
          product_id: string
          quantity?: number
          reorder_point?: number | null
          sku?: string | null
          unit_cost?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_counted_at?: string | null
          location?: string | null
          low_stock_threshold?: number | null
          optimal_stock?: number | null
          product_id?: string
          quantity?: number
          reorder_point?: number | null
          sku?: string | null
          unit_cost?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_logs: {
        Row: {
          adjustment_type: string | null
          created_at: string | null
          created_by: string | null
          id: string
          location: string | null
          new_quantity: number
          performed_by: string | null
          previous_quantity: number
          product_id: string
          quantity_change: number
          reason_details: string | null
          reason_type: string
          reference_number: string | null
          retailer_name: string | null
          total_cost: number | null
          unit_cost: number | null
        }
        Insert: {
          adjustment_type?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          location?: string | null
          new_quantity: number
          performed_by?: string | null
          previous_quantity: number
          product_id: string
          quantity_change: number
          reason_details?: string | null
          reason_type: string
          reference_number?: string | null
          retailer_name?: string | null
          total_cost?: number | null
          unit_cost?: number | null
        }
        Update: {
          adjustment_type?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          location?: string | null
          new_quantity?: number
          performed_by?: string | null
          previous_quantity?: number
          product_id?: string
          quantity_change?: number
          reason_details?: string | null
          reason_type?: string
          reference_number?: string | null
          retailer_name?: string | null
          total_cost?: number | null
          unit_cost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_logs_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          applied_promo_code: Json | null
          billing_address: Json
          created_at: string | null
          gst: number | null
          id: string
          items: Json
          order_number: string
          payment_method: string | null
          profile_id: string | null
          shipping_address: Json
          shipping_cost: number | null
          status: string
          stripe_session_id: string | null
          total_amount: number
          user_id: string | null
        }
        Insert: {
          applied_promo_code?: Json | null
          billing_address: Json
          created_at?: string | null
          gst?: number | null
          id?: string
          items: Json
          order_number: string
          payment_method?: string | null
          profile_id?: string | null
          shipping_address: Json
          shipping_cost?: number | null
          status: string
          stripe_session_id?: string | null
          total_amount: number
          user_id?: string | null
        }
        Update: {
          applied_promo_code?: Json | null
          billing_address?: Json
          created_at?: string | null
          gst?: number | null
          id?: string
          items?: Json
          order_number?: string
          payment_method?: string | null
          profile_id?: string | null
          shipping_address?: Json
          shipping_cost?: number | null
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
      payment_methods: {
        Row: {
          created_at: string | null
          description: string | null
          icon_url: string | null
          id: string
          is_active: boolean | null
          name: string
          processing_fee: number | null
          stripe_config: Json | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          processing_fee?: number | null
          stripe_config?: Json | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          processing_fee?: number | null
          stripe_config?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      period_logs: {
        Row: {
          created_at: string | null
          date: string
          flow_intensity: Database["public"]["Enums"]["flow_intensity"]
          id: string
          notes: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          flow_intensity: Database["public"]["Enums"]["flow_intensity"]
          id?: string
          notes?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          flow_intensity?: Database["public"]["Enums"]["flow_intensity"]
          id?: string
          notes?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
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
          slug: string
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
          slug: string
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
          slug?: string
          specifications?: Json
          updated_at?: string | null
          why_choose_features?: Json | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          completed_initial_setup: boolean | null
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
          selected_delivery_method: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          completed_initial_setup?: boolean | null
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
          selected_delivery_method?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          completed_initial_setup?: boolean | null
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
          selected_delivery_method?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_selected_delivery_method_fkey"
            columns: ["selected_delivery_method"]
            isOneToOne: false
            referencedRelation: "delivery_methods"
            referencedColumns: ["id"]
          },
        ]
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
      referral_tracking: {
        Row: {
          created_at: string | null
          id: string
          referral_id: string | null
          referred_email: string
          status: Database["public"]["Enums"]["referral_status"] | null
          updated_at: string | null
          utm_campaign: string | null
          utm_medium: string | null
          utm_source: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          referral_id?: string | null
          referred_email: string
          status?: Database["public"]["Enums"]["referral_status"] | null
          updated_at?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          referral_id?: string | null
          referred_email?: string
          status?: Database["public"]["Enums"]["referral_status"] | null
          updated_at?: string | null
          utm_campaign?: string | null
          utm_medium?: string | null
          utm_source?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "referral_tracking_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          created_at: string | null
          id: string
          referral_code: string
          referral_count: number | null
          referrer_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          referral_code: string
          referral_count?: number | null
          referrer_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          referral_code?: string
          referral_count?: number | null
          referrer_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reminders: {
        Row: {
          created_at: string | null
          days_before: number | null
          description: string | null
          id: string
          is_enabled: boolean | null
          reminder_type: string
          time: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          days_before?: number | null
          description?: string | null
          id?: string
          is_enabled?: boolean | null
          reminder_type: string
          time: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          days_before?: number | null
          description?: string | null
          id?: string
          is_enabled?: boolean | null
          reminder_type?: string
          time?: string
          title?: string
          updated_at?: string | null
          user_id?: string
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
      shop_company_expenses: {
        Row: {
          amount: number
          category: Database["public"]["Enums"]["expense_category"]
          created_at: string | null
          created_by: string | null
          date: string
          id: string
          notes: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          receipt_path: string | null
          status: Database["public"]["Enums"]["expense_status"]
          title: string
          updated_at: string | null
          vendor_name: string
        }
        Insert: {
          amount: number
          category: Database["public"]["Enums"]["expense_category"]
          created_at?: string | null
          created_by?: string | null
          date: string
          id?: string
          notes?: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          receipt_path?: string | null
          status?: Database["public"]["Enums"]["expense_status"]
          title: string
          updated_at?: string | null
          vendor_name: string
        }
        Update: {
          amount?: number
          category?: Database["public"]["Enums"]["expense_category"]
          created_at?: string | null
          created_by?: string | null
          date?: string
          id?: string
          notes?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          receipt_path?: string | null
          status?: Database["public"]["Enums"]["expense_status"]
          title?: string
          updated_at?: string | null
          vendor_name?: string
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
      symptom_logs: {
        Row: {
          created_at: string | null
          date: string
          id: string
          notes: string | null
          severity: Database["public"]["Enums"]["symptom_severity"]
          symptom_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          date: string
          id?: string
          notes?: string | null
          severity: Database["public"]["Enums"]["symptom_severity"]
          symptom_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          date?: string
          id?: string
          notes?: string | null
          severity?: Database["public"]["Enums"]["symptom_severity"]
          symptom_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "symptom_logs_symptom_id_fkey"
            columns: ["symptom_id"]
            isOneToOne: false
            referencedRelation: "symptoms"
            referencedColumns: ["id"]
          },
        ]
      }
      symptoms: {
        Row: {
          category: string | null
          created_at: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name?: string
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
      get_upcoming_reminders: {
        Args: {
          days_ahead?: number
        }
        Returns: {
          id: string
          title: string
          description: string
          reminder_date: string
          reminder_time: string
          recurrence: Database["public"]["Enums"]["reminder_recurrence"]
          email_notify: boolean
          status: boolean
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
      migrate_sustainability_content: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      block_type:
        | "heading"
        | "text"
        | "image"
        | "video"
        | "button"
        | "spacer"
        | "hero"
        | "features"
        | "testimonials"
        | "newsletter"
        | "blog_preview"
        | "store_brands"
        | "sustainability"
        | "product_carousel"
        | "product_gallery"
        | "elevating_essentials"
        | "game_changer"
        | "competitor_comparison"
        | "about_hero_section"
        | "about_story"
        | "about_mission"
        | "about_sustainability"
        | "about_team"
        | "about_customer_impact"
        | "about_cta"
        | "contact_hero"
        | "contact_details"
        | "contact_form"
        | "contact_faq"
        | "contact_business"
        | "custom_solutions_hero"
        | "custom_solutions_services"
        | "custom_solutions_process"
        | "custom_solutions_cta"
        | "sustainability_hero"
        | "sustainability_mission"
        | "sustainability_materials"
        | "sustainability_faq"
        | "sustainability_cta"
        | "donation_hero"
        | "donation_impact"
        | "donation_form"
        | "donation_stories"
        | "donation_partners"
        | "donation_faq"
        | "donation_join_movement"
        | "for_business_hero"
        | "for_business_solutions"
      component_status: "draft" | "published" | "archived"
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
        | "donation_hero"
        | "spacer"
        | "sustainability_hero"
        | "sustainability_mission"
        | "sustainability_materials"
        | "sustainability_faq"
        | "sustainability_cta"
        | "donation_impact"
        | "donation_form"
        | "donation_stories"
        | "donation_partners"
        | "donation_faq"
        | "donation_join_movement"
        | "business_hero"
        | "business_solutions"
        | "business_contact"
      expense_category:
        | "inventory"
        | "marketing"
        | "office_supplies"
        | "utilities"
        | "employee_benefits"
        | "logistics"
        | "software"
        | "other"
      expense_status: "paid" | "pending"
      flow_intensity: "light" | "medium" | "heavy" | "spotting"
      page_view_type: "page_view" | "exit"
      payment_method: "cash" | "bank_transfer" | "credit_card"
      post_status: "draft" | "published"
      promo_code_type: "percentage" | "fixed_amount"
      referral_status: "pending" | "completed"
      reminder_recurrence: "none" | "weekly" | "monthly" | "yearly"
      supported_currency: "USD" | "EUR" | "UAH" | "CAD"
      supported_language: "en" | "fr" | "uk"
      sustainability_section_type:
        | "sustainability_hero"
        | "sustainability_mission"
        | "sustainability_materials"
        | "sustainability_faq"
        | "sustainability_cta"
      symptom_severity: "light" | "medium" | "severe"
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
