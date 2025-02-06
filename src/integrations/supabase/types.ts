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
    }
  }
}

export type Tables = Database['public']['Tables']