
// Модель блогу, яка відповідає структурі в Supabase
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: any; // jsonb
  excerpt?: string;
  featured_image?: string;
  status: PostStatus;
  author_id?: string;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
  view_count?: number;
  meta_title?: string;
  meta_description?: string;
  keywords?: string[];
}

export type PostStatus = 'draft' | 'published' | 'archived';

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  parent_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BlogComment {
  id: string;
  content: string;
  post_id?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Функції для перетворення даних з бази даних
export const parseBlogPost = (data: any): BlogPost => {
  return {
    id: data.id,
    title: data.title,
    slug: data.slug,
    content: data.content,
    excerpt: data.excerpt,
    featured_image: data.featured_image,
    status: data.status || 'draft',
    author_id: data.author_id,
    published_at: data.published_at,
    created_at: data.created_at,
    updated_at: data.updated_at,
    view_count: Number(data.view_count || 0),
    meta_title: data.meta_title,
    meta_description: data.meta_description,
    keywords: Array.isArray(data.keywords) ? data.keywords : []
  };
};

export const parseBlogCategory = (data: any): BlogCategory => {
  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    parent_id: data.parent_id,
    created_at: data.created_at,
    updated_at: data.updated_at
  };
};
