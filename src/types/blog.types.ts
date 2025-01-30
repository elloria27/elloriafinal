import { Json } from './database.types'

export interface BlogCategoryTable {
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
    }
  ]
}

export interface BlogCommentTable {
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
    }
  ]
}

export interface BlogPostTable {
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
    status: PostStatus
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
    status?: PostStatus
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
    status?: PostStatus
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
    }
  ]
}

export type PostStatus = 'draft' | 'published'