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
      blog_categories: BlogCategoryTable
      blog_comments: BlogCommentTable
      blog_posts: BlogPostTable
      blog_posts_categories: BlogPostCategoryTable
      blog_settings: BlogSettingTable
      bulk_file_shares: BulkFileShareTable
      contact_submissions: ContactSubmissionTable
      content_blocks: ContentBlockTable
      file_shares: FileShareTable
      folders: FolderTable
      orders: OrderTable
      page_views: PageViewTable
      pages: PageTable
      products: ProductTable
      profiles: ProfileTable
      promo_codes: PromoCodeTable
      reviews: ReviewTable
      shop_settings: ShopSettingTable
      site_settings: SiteSettingTable
      user_roles: UserRoleTable
    }
    Views: {
      [_ in never]: never
    }
    Functions: DatabaseFunctions
    Enums: DatabaseEnums
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']