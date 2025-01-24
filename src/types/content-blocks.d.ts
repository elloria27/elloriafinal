import { Json } from "@/integrations/supabase/types";

export interface BaseBlockContent {
  [key: string]: string | number | boolean | null;
}

export interface HeadingBlockContent extends BaseBlockContent {
  text: string;
  size: 'h1' | 'h2' | 'h3' | 'h4';
}

export interface TextBlockContent extends BaseBlockContent {
  text: string;
}

export interface ImageBlockContent extends BaseBlockContent {
  url: string;
  alt: string;
}

export interface ButtonBlockContent extends BaseBlockContent {
  text: string;
  url: string;
  variant: 'default' | 'outline' | 'ghost';
}

export type BlockContent = 
  | HeadingBlockContent 
  | TextBlockContent 
  | ImageBlockContent 
  | ButtonBlockContent
  | Record<string, string>;

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
  | "store_brands";

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: BlockContent;
  order_index: number;
}