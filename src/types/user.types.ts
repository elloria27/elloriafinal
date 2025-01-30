export interface ProfileTable {
  Row: {
    id: string
    full_name: string | null
    phone_number: string | null
    address: string | null
    country: string | null
    region: string | null
    email_notifications: boolean | null
    marketing_emails: boolean | null
    language: string | null
    currency: string | null
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
    email_notifications?: boolean | null
    marketing_emails?: boolean | null
    language?: string | null
    currency?: string | null
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
    email_notifications?: boolean | null
    marketing_emails?: boolean | null
    language?: string | null
    currency?: string | null
    updated_at?: string | null
    email?: string | null
  }
  Relationships: []
}

export interface UserRoleTable {
  Row: {
    id: string
    user_id: string
    role: UserRole
    created_at: string
  }
  Insert: {
    id?: string
    user_id: string
    role?: UserRole
    created_at?: string
  }
  Update: {
    id?: string
    user_id?: string
    role?: UserRole
    created_at?: string
  }
  Relationships: []
}

export type UserRole = 'admin' | 'client'