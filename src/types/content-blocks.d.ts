import { Json } from "@/integrations/supabase/types";

export interface BaseBlockContent {
  [key: string]: string | number | boolean | null | any;
}

export interface HeadingBlockContent extends BaseBlockContent {
  text?: string;
  size?: 'h1' | 'h2' | 'h3' | 'h4';
}

export interface TextBlockContent extends BaseBlockContent {
  text?: string;
}

export interface ImageBlockContent extends BaseBlockContent {
  url?: string;
  alt?: string;
}

export interface VideoBlockContent extends BaseBlockContent {
  url?: string;
  title?: string;
}

export interface ButtonBlockContent extends BaseBlockContent {
  text?: string;
  url?: string;
  variant?: 'default' | 'outline' | 'ghost';
}

export interface HeroBlockContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  videoUrl?: string;
}

export interface FeaturesBlockContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: {
    icon: string;
    title: string;
    description: string;
    detail?: string;
  }[];
}

export type BlockContent = 
  | HeadingBlockContent 
  | TextBlockContent 
  | ImageBlockContent 
  | VideoBlockContent
  | ButtonBlockContent
  | HeroBlockContent
  | FeaturesBlockContent
  | Record<string, any>;

export type BlockType = 
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
  | "product_carousel";

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: BlockContent;
  order_index: number;
  page_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FeaturesProps {
  content: FeaturesBlockContent;
}