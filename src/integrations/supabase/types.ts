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
      business_form_submissions: {
        Row: {
          admin_notes: string | null
          assigned_at: string | null
          assigned_to: string | null
          attachments: Json | null
          business_type: string | null
          company_name: string | null
          completed_at: string | null
          created_at: string | null
          email: string
          form_type: Database["public"]["Enums"]["form_type"]
          full_name: string
          id: string
          inquiry_type: string | null
          last_updated_at: string | null
          message: string | null
          notes: string | null
          order_quantity: string | null
          phone: string | null
          status: Database["public"]["Enums"]["form_status"] | null
          terms_accepted: boolean | null
          updated_at: string | null
        }
        Insert: {
          admin_notes?: string | null
          assigned_at?: string | null
          assigned_to?: string | null
          attachments?: Json | null
          business_type?: string | null
          company_name?: string | null
          completed_at?: string | null
          created_at?: string | null
          email: string
          form_type: Database["public"]["Enums"]["form_type"]
          full_name: string
          id?: string
          inquiry_type?: string | null
          last_updated_at?: string | null
          message?: string | null
          notes?: string | null
          order_quantity?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["form_status"] | null
          terms_accepted?: boolean | null
          updated_at?: string | null
        }
        Update: {
          admin_notes?: string | null
          assigned_at?: string | null
          assigned_to?: string | null
          attachments?: Json | null
          business_type?: string | null
          company_name?: string | null
          completed_at?: string | null
          created_at?: string | null
          email?: string
          form_type?: Database["public"]["Enums"]["form_type"]
          full_name?: string
          id?: string
          inquiry_type?: string | null
          last_updated_at?: string | null
          message?: string | null
          notes?: string | null
          order_quantity?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["form_status"] | null
          terms_accepted?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      business_forms: {
        Row: {
          company_name: string
          created_at: string
          email: string
          id: string
          inquiry_type: string
          message: string
        }
        Insert: {
          company_name: string
          created_at?: string
          email: string
          id?: string
          inquiry_type: string
          message: string
        }
        Update: {
          company_name?: string
          created_at?: string
          email?: string
          id?: string
          inquiry_type?: string
          message?: string
        }
        Relationships: []
      }
      certificates: {
        Row: {
          category: string
          certificate_number: string
          created_at: string
          expiry_date: string
          id: string
          image_url: string | null
          issue_date: string
          issuing_authority: string
          name: string
          qr_code_url: string | null
          updated_at: string
        }
        Insert: {
          category: string
          certificate_number: string
          created_at?: string
          expiry_date: string
          id?: string
          image_url?: string | null
          issue_date: string
          issuing_authority: string
          name: string
          qr_code_url?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          certificate_number?: string
          created_at?: string
          expiry_date?: string
          id?: string
          image_url?: string | null
          issue_date?: string
          issuing_authority?: string
          name?: string
          qr_code_url?: string | null
          updated_at?: string
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
      hrm_checklist_items: {
        Row: {
          checklist_id: string
          completed: boolean | null
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          last_updated_at: string | null
          order_index: number
        }
        Insert: {
          checklist_id: string
          completed?: boolean | null
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          last_updated_at?: string | null
          order_index: number
        }
        Update: {
          checklist_id?: string
          completed?: boolean | null
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          last_updated_at?: string | null
          order_index?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_checklist_items_checklist"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "hrm_task_checklists"
            referencedColumns: ["id"]
          },
        ]
      }
      hrm_credit_notes: {
        Row: {
          amount: number
          created_at: string | null
          created_by: string | null
          credit_note_number: string
          customer_id: string | null
          id: string
          invoice_id: string | null
          reason: string | null
          status: string
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          created_by?: string | null
          credit_note_number: string
          customer_id?: string | null
          id?: string
          invoice_id?: string | null
          reason?: string | null
          status?: string
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          created_by?: string | null
          credit_note_number?: string
          customer_id?: string | null
          id?: string
          invoice_id?: string | null
          reason?: string | null
          status?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hrm_credit_notes_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "hrm_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hrm_credit_notes_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "hrm_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      hrm_customer_payment_methods: {
        Row: {
          created_at: string | null
          customer_id: string | null
          details: Json
          id: string
          is_default: boolean | null
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          details: Json
          id?: string
          is_default?: boolean | null
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          details?: Json
          id?: string
          is_default?: boolean | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hrm_customer_payment_methods_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "hrm_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      hrm_customers: {
        Row: {
          address: Json | null
          created_at: string | null
          created_by: string | null
          email: string
          id: string
          name: string
          phone: string | null
          tax_id: string | null
          updated_at: string | null
        }
        Insert: {
          address?: Json | null
          created_at?: string | null
          created_by?: string | null
          email: string
          id?: string
          name: string
          phone?: string | null
          tax_id?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: Json | null
          created_at?: string | null
          created_by?: string | null
          email?: string
          id?: string
          name?: string
          phone?: string | null
          tax_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      hrm_estimate_items: {
        Row: {
          created_at: string | null
          description: string
          estimate_id: string | null
          id: string
          quantity: number
          tax_percentage: number | null
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          description: string
          estimate_id?: string | null
          id?: string
          quantity?: number
          tax_percentage?: number | null
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          description?: string
          estimate_id?: string | null
          id?: string
          quantity?: number
          tax_percentage?: number | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "hrm_estimate_items_estimate_id_fkey"
            columns: ["estimate_id"]
            isOneToOne: false
            referencedRelation: "hrm_estimates"
            referencedColumns: ["id"]
          },
        ]
      }
      hrm_estimates: {
        Row: {
          created_at: string | null
          created_by: string | null
          customer_id: string | null
          estimate_number: string
          id: string
          notes: string | null
          status: string
          subtotal_amount: number
          tax_amount: number
          terms: string | null
          total_amount: number
          updated_at: string | null
          valid_until: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          estimate_number: string
          id?: string
          notes?: string | null
          status?: string
          subtotal_amount?: number
          tax_amount?: number
          terms?: string | null
          total_amount?: number
          updated_at?: string | null
          valid_until?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          customer_id?: string | null
          estimate_number?: string
          id?: string
          notes?: string | null
          status?: string
          subtotal_amount?: number
          tax_amount?: number
          terms?: string | null
          total_amount?: number
          updated_at?: string | null
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hrm_estimates_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "hrm_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      hrm_expense_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      hrm_invoice_emails: {
        Row: {
          email_type: string
          error_message: string | null
          id: string
          invoice_id: string | null
          sent_at: string | null
          sent_by: string | null
          sent_to: string
          status: string
          template_version: string | null
        }
        Insert: {
          email_type?: string
          error_message?: string | null
          id?: string
          invoice_id?: string | null
          sent_at?: string | null
          sent_by?: string | null
          sent_to: string
          status?: string
          template_version?: string | null
        }
        Update: {
          email_type?: string
          error_message?: string | null
          id?: string
          invoice_id?: string | null
          sent_at?: string | null
          sent_by?: string | null
          sent_to?: string
          status?: string
          template_version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hrm_invoice_emails_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "hrm_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      hrm_invoice_items: {
        Row: {
          created_at: string | null
          description: string
          id: string
          invoice_id: string | null
          quantity: number
          tax_category_id: string | null
          tax_percentage: number | null
          total_price: number
          unit_price: number
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          invoice_id?: string | null
          quantity?: number
          tax_category_id?: string | null
          tax_percentage?: number | null
          total_price: number
          unit_price: number
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          invoice_id?: string | null
          quantity?: number
          tax_category_id?: string | null
          tax_percentage?: number | null
          total_price?: number
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "hrm_invoice_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "hrm_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      hrm_invoice_payments: {
        Row: {
          amount_paid: number
          created_at: string | null
          created_by: string | null
          id: string
          invoice_id: string | null
          payment_date: string
          payment_method: string
          status: Database["public"]["Enums"]["payment_status"]
          transaction_id: string | null
        }
        Insert: {
          amount_paid: number
          created_at?: string | null
          created_by?: string | null
          id?: string
          invoice_id?: string | null
          payment_date?: string
          payment_method: string
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
        }
        Update: {
          amount_paid?: number
          created_at?: string | null
          created_by?: string | null
          id?: string
          invoice_id?: string | null
          payment_date?: string
          payment_method?: string
          status?: Database["public"]["Enums"]["payment_status"]
          transaction_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hrm_invoice_payments_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "hrm_invoices"
            referencedColumns: ["id"]
          },
        ]
      }
      hrm_invoice_settings: {
        Row: {
          company_email: string | null
          company_id: string | null
          company_info: Json | null
          company_phone: string | null
          created_at: string | null
          default_due_days: number | null
          default_notes: string | null
          footer_text: string | null
          id: string
          invoice_template: string | null
          late_fee_percentage: number | null
          logo_url: string | null
          payment_instructions: string | null
          updated_at: string | null
        }
        Insert: {
          company_email?: string | null
          company_id?: string | null
          company_info?: Json | null
          company_phone?: string | null
          created_at?: string | null
          default_due_days?: number | null
          default_notes?: string | null
          footer_text?: string | null
          id?: string
          invoice_template?: string | null
          late_fee_percentage?: number | null
          logo_url?: string | null
          payment_instructions?: string | null
          updated_at?: string | null
        }
        Update: {
          company_email?: string | null
          company_id?: string | null
          company_info?: Json | null
          company_phone?: string | null
          created_at?: string | null
          default_due_days?: number | null
          default_notes?: string | null
          footer_text?: string | null
          id?: string
          invoice_template?: string | null
          late_fee_percentage?: number | null
          logo_url?: string | null
          payment_instructions?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hrm_invoice_settings_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "hrm_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      hrm_invoices: {
        Row: {
          company_info: Json | null
          created_at: string | null
          created_by: string | null
          currency: string
          customer_id: string | null
          discount_amount: number | null
          discount_type: string | null
          due_date: string
          employee_id: string | null
          footer_text: string | null
          id: string
          invoice_number: string
          last_sent_at: string | null
          last_sent_to: string | null
          late_fee_percentage: number | null
          notes: string | null
          payment_instructions: string | null
          payment_terms: string | null
          pdf_url: string | null
          reference_number: string | null
          shipping_amount: number | null
          status: Database["public"]["Enums"]["invoice_status"]
          subtotal_amount: number
          tax_amount: number
          tax_details: Json | null
          template_version: string | null
          total_amount: number
          total_amount_with_tax: number | null
          updated_at: string | null
        }
        Insert: {
          company_info?: Json | null
          created_at?: string | null
          created_by?: string | null
          currency?: string
          customer_id?: string | null
          discount_amount?: number | null
          discount_type?: string | null
          due_date: string
          employee_id?: string | null
          footer_text?: string | null
          id?: string
          invoice_number: string
          last_sent_at?: string | null
          last_sent_to?: string | null
          late_fee_percentage?: number | null
          notes?: string | null
          payment_instructions?: string | null
          payment_terms?: string | null
          pdf_url?: string | null
          reference_number?: string | null
          shipping_amount?: number | null
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal_amount?: number
          tax_amount?: number
          tax_details?: Json | null
          template_version?: string | null
          total_amount?: number
          total_amount_with_tax?: number | null
          updated_at?: string | null
        }
        Update: {
          company_info?: Json | null
          created_at?: string | null
          created_by?: string | null
          currency?: string
          customer_id?: string | null
          discount_amount?: number | null
          discount_type?: string | null
          due_date?: string
          employee_id?: string | null
          footer_text?: string | null
          id?: string
          invoice_number?: string
          last_sent_at?: string | null
          last_sent_to?: string | null
          late_fee_percentage?: number | null
          notes?: string | null
          payment_instructions?: string | null
          payment_terms?: string | null
          pdf_url?: string | null
          reference_number?: string | null
          shipping_amount?: number | null
          status?: Database["public"]["Enums"]["invoice_status"]
          subtotal_amount?: number
          tax_amount?: number
          tax_details?: Json | null
          template_version?: string | null
          total_amount?: number
          total_amount_with_tax?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hrm_invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "hrm_customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hrm_invoices_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
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
        Relationships: [
          {
            foreignKeyName: "hrm_personal_reminders_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hrm_recurring_invoices: {
        Row: {
          created_at: string | null
          customer_id: string | null
          end_date: string | null
          frequency: string
          id: string
          is_active: boolean | null
          last_generated: string | null
          next_generation: string | null
          start_date: string
          template_data: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          customer_id?: string | null
          end_date?: string | null
          frequency: string
          id?: string
          is_active?: boolean | null
          last_generated?: string | null
          next_generation?: string | null
          start_date: string
          template_data: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          customer_id?: string | null
          end_date?: string | null
          frequency?: string
          id?: string
          is_active?: boolean | null
          last_generated?: string | null
          next_generation?: string | null
          start_date?: string
          template_data?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hrm_recurring_invoices_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "hrm_customers"
            referencedColumns: ["id"]
          },
        ]
      }
      hrm_subtasks: {
        Row: {
          completed: boolean | null
          created_at: string | null
          created_by: string | null
          id: string
          last_updated_at: string | null
          order_index: number
          task_id: string
          title: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          last_updated_at?: string | null
          order_index: number
          task_id: string
          title: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          created_by?: string | null
          id?: string
          last_updated_at?: string | null
          order_index?: number
          task_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_task"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "hrm_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      hrm_task_attachments: {
        Row: {
          created_at: string | null
          file_name: string
          file_path: string
          id: string
          task_id: string
          uploaded_by: string
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_path: string
          id?: string
          task_id: string
          uploaded_by: string
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_path?: string
          id?: string
          task_id?: string
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "hrm_task_attachments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "hrm_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hrm_task_attachments_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      hrm_task_checklists: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          last_updated_at: string | null
          order_index: number
          task_id: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          last_updated_at?: string | null
          order_index: number
          task_id?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          last_updated_at?: string | null
          order_index?: number
          task_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_task"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "hrm_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hrm_task_checklists_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "hrm_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      hrm_task_comments: {
        Row: {
          comment: string
          created_at: string | null
          created_by: string
          id: string
          task_id: string
        }
        Insert: {
          comment: string
          created_at?: string | null
          created_by: string
          id?: string
          task_id: string
        }
        Update: {
          comment?: string
          created_at?: string | null
          created_by?: string
          id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hrm_task_comments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hrm_task_comments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "hrm_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      hrm_task_history: {
        Row: {
          action: string
          changed_by: string
          created_at: string | null
          id: string
          new_value: Json | null
          old_value: Json | null
          task_id: string
        }
        Insert: {
          action: string
          changed_by: string
          created_at?: string | null
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          task_id: string
        }
        Update: {
          action?: string
          changed_by?: string
          created_at?: string | null
          id?: string
          new_value?: Json | null
          old_value?: Json | null
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "hrm_task_history_changed_by_fkey"
            columns: ["changed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hrm_task_history_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "hrm_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      hrm_task_label_assignments: {
        Row: {
          created_at: string | null
          id: string
          label_id: string | null
          task_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          label_id?: string | null
          task_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          label_id?: string | null
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hrm_task_label_assignments_label_id_fkey"
            columns: ["label_id"]
            isOneToOne: false
            referencedRelation: "hrm_task_labels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hrm_task_label_assignments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "hrm_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      hrm_task_labels: {
        Row: {
          color: string
          created_at: string | null
          created_by: string | null
          id: string
          name: string
        }
        Insert: {
          color: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      hrm_task_notifications: {
        Row: {
          created_at: string | null
          email_sent: boolean | null
          id: string
          is_read: boolean | null
          message: string
          notification_type: Database["public"]["Enums"]["task_notification_type"]
          task_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email_sent?: boolean | null
          id?: string
          is_read?: boolean | null
          message: string
          notification_type: Database["public"]["Enums"]["task_notification_type"]
          task_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email_sent?: boolean | null
          id?: string
          is_read?: boolean | null
          message?: string
          notification_type?: Database["public"]["Enums"]["task_notification_type"]
          task_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hrm_task_notifications_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "hrm_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      hrm_tasks: {
        Row: {
          actual_hours: number | null
          assigned_to: string
          category: Database["public"]["Enums"]["task_category"]
          completion_date: string | null
          created_at: string | null
          created_by: string
          description: string | null
          due_date: string | null
          estimated_hours: number | null
          id: string
          last_updated_at: string | null
          priority: Database["public"]["Enums"]["task_priority"]
          start_date: string | null
          status: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at: string | null
        }
        Insert: {
          actual_hours?: number | null
          assigned_to: string
          category?: Database["public"]["Enums"]["task_category"]
          completion_date?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          last_updated_at?: string | null
          priority?: Database["public"]["Enums"]["task_priority"]
          start_date?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          title: string
          updated_at?: string | null
        }
        Update: {
          actual_hours?: number | null
          assigned_to?: string
          category?: Database["public"]["Enums"]["task_category"]
          completion_date?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          due_date?: string | null
          estimated_hours?: number | null
          id?: string
          last_updated_at?: string | null
          priority?: Database["public"]["Enums"]["task_priority"]
          start_date?: string | null
          status?: Database["public"]["Enums"]["task_status"]
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hrm_tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "hrm_tasks_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
          custom_canonical_url: string | null
          id: string
          is_published: boolean | null
          menu_order: number | null
          menu_type: string | null
          meta_description: string | null
          meta_keywords: string | null
          meta_robots: string | null
          meta_title: string | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          page_template: string | null
          parent_id: string | null
          redirect_url: string | null
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
          custom_canonical_url?: string | null
          id?: string
          is_published?: boolean | null
          menu_order?: number | null
          menu_type?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_robots?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_template?: string | null
          parent_id?: string | null
          redirect_url?: string | null
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
          custom_canonical_url?: string | null
          id?: string
          is_published?: boolean | null
          menu_order?: number | null
          menu_type?: string | null
          meta_description?: string | null
          meta_keywords?: string | null
          meta_robots?: string | null
          meta_title?: string | null
          og_description?: string | null
          og_image?: string | null
          og_title?: string | null
          page_template?: string | null
          parent_id?: string | null
          redirect_url?: string | null
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
      seo_settings: {
        Row: {
          created_at: string
          default_meta_description: string | null
          default_meta_keywords: string | null
          default_title_template: string | null
          google_site_verification: string | null
          id: string
          robots_txt: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_meta_description?: string | null
          default_meta_keywords?: string | null
          default_title_template?: string | null
          google_site_verification?: string | null
          id?: string
          robots_txt?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_meta_description?: string | null
          default_meta_keywords?: string | null
          default_title_template?: string | null
          google_site_verification?: string | null
          id?: string
          robots_txt?: string | null
          updated_at?: string
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
          logo_url: string | null
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
          logo_url?: string | null
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
          logo_url?: string | null
          maintenance_mode?: boolean | null
          max_upload_size?: number | null
          meta_description?: string | null
          meta_keywords?: string | null
          site_title?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          created_at: string | null
          email: string
          id: string
          source: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          source?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          source?: string | null
          updated_at?: string | null
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
          custom_canonical_url: string | null
          id: string
          is_published: boolean | null
          menu_order: number | null
          menu_type: string | null
          meta_description: string | null
          meta_keywords: string | null
          meta_robots: string | null
          meta_title: string | null
          og_description: string | null
          og_image: string | null
          og_title: string | null
          page_template: string | null
          parent_id: string | null
          redirect_url: string | null
          show_in_footer: boolean | null
          show_in_header: boolean | null
          slug: string
          title: string
          updated_at: string | null
        }[]
      }
      get_admin_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          full_name: string
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
        | "thanks_welcome"
        | "thanks_referral"
        | "thanks_special_offer"
        | "thanks_newsletter"
        | "bulk_hero"
        | "bulk_benefits"
        | "bulk_process"
        | "bulk_cta"
        | "bulk_consultation"
        | "custom_solutions_hero"
        | "custom_solutions_services"
        | "custom_solutions_process"
        | "custom_solutions_cta"
        | "sustainability_program_hero"
        | "sustainability_program_benefits"
        | "sustainability_program_process"
        | "sustainability_program_cta"
        | "not_found"
        | "certificates"
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
      form_status: "new" | "in_progress" | "completed" | "archived"
      form_type:
        | "business_contact"
        | "custom_solutions"
        | "bulk_order"
        | "sustainability"
      invoice_status: "pending" | "paid" | "overdue" | "cancelled"
      page_view_type: "page_view" | "exit"
      payment_method: "cash" | "bank_transfer" | "credit_card"
      payment_status: "pending" | "completed" | "failed"
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
      task_category: "hr" | "finance" | "operations" | "other"
      task_notification_type: "assigned" | "updated" | "completed" | "comment"
      task_priority: "low" | "medium" | "high"
      task_status: "todo" | "in_progress" | "completed" | "on_hold"
      user_role: "admin" | "client"
      work_act_status: "draft" | "pending" | "signed" | "cancelled"
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
