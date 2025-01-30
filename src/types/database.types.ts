import { Json } from "@/integrations/supabase/types";

// Core database types
export interface Database {
  public: {
    Tables: DatabaseTables;
    Views: Record<string, never>;
    Functions: DatabaseFunctions;
    Enums: DatabaseEnums;
  };
}

export interface DatabaseTables {
  blog_categories: BlogCategoryTable;
  blog_comments: BlogCommentTable;
  blog_posts: BlogPostTable;
  blog_posts_categories: BlogPostCategoryTable;
  blog_settings: BlogSettingTable;
  bulk_file_shares: BulkFileShareTable;
  contact_submissions: ContactSubmissionTable;
  content_blocks: ContentBlockTable;
  file_shares: FileShareTable;
  folders: FolderTable;
  orders: OrderTable;
  page_views: PageViewTable;
  pages: PageTable;
  products: ProductTable;
  profiles: ProfileTable;
  promo_codes: PromoCodeTable;
  reviews: ReviewTable;
  shop_settings: ShopSettingTable;
  site_settings: SiteSettingTable;
  user_roles: UserRoleTable;
}

// Re-export types from the original types.ts
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];

// Shop-related types
export interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  currency: string;
  estimatedDays: string;
}

export interface ShippingMethods {
  CA: ShippingMethod[];
  US: ShippingMethod[];
}

export interface StripeSettings {
  secret_key: string;
  publishable_key: string;
}

export interface PaymentMethods {
  stripe: boolean;
  cash_on_delivery: boolean;
}