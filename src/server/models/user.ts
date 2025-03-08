
// User model, matching the structure in Supabase
export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone_number?: string;
  address?: string;
  country?: string;
  region?: string;
  language?: string;
  currency?: string;
  marketing_emails?: boolean;
  email_notifications?: boolean;
  completed_initial_setup?: boolean;
  created_at?: string;
  updated_at?: string;
}

// User role
export type UserRole = 'client' | 'admin';

// Interface for user with role
export interface UserWithRole extends User {
  role: UserRole;
}

// Function to parse user data from database to User type
export const parseUser = (data: any): User => {
  return {
    id: data.id,
    email: data.email,
    full_name: data.user_metadata?.full_name || data.raw_user_meta_data?.full_name || '',
    phone_number: data.phone_number,
    address: data.address,
    country: data.country,
    region: data.region,
    language: data.language || 'en',
    currency: data.currency || 'USD',
    marketing_emails: !!data.marketing_emails,
    email_notifications: !!data.email_notifications,
    completed_initial_setup: !!data.completed_initial_setup,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};
