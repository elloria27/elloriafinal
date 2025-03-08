
// User role enum
export type UserRole = 'admin' | 'client' | 'customer' | 'vendor';

// Base User interface
export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  phone_number?: string;
  address?: string;
  country?: string;
  region?: string;
  language?: string;
  currency?: string;
  created_at: string;
  updated_at: string;
}

// Extended User interface with role
export interface UserWithRole extends User {
  role: UserRole;
  password: string; // Hashed password
}

// User preferences
export interface UserPreferences {
  darkMode?: boolean;
  emailNotifications?: boolean;
  smsNotifications?: boolean;
  language?: string;
  currency?: string;
}

// User activity
export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  details: string;
  timestamp: string;
}

// User session
export interface UserSession {
  id: string;
  userId: string;
  token: string;
  userAgent: string;
  ipAddress: string;
  lastActive: string;
  expiresAt: string;
}
