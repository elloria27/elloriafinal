import { Json } from "@/integrations/supabase/types";

export interface BaseBlockContent {
  [key: string]: string | number | boolean | null | Json;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
  detail?: string;
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

export interface HeroContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  videoUrl?: string;
}

export interface FeaturesContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: FeatureItem[];
}

export interface GameChangerContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  features?: FeatureItem[];
}

export interface StoreBrandsContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  brands?: {
    name: string;
    logo: string;
    link: string;
  }[];
}

export interface SustainabilityContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  stats?: {
    icon: string;
    value: string;
    label: string;
    description: string;
  }[];
}

export interface TestimonialsContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  testimonials?: {
    name: string;
    rating: number;
    text: string;
    source: string;
  }[];
}

export interface BlogPreviewContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  articles?: {
    title: string;
    category: string;
    image: string;
  }[];
}

export interface NewsletterContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

export type BlockContent = 
  | HeadingBlockContent 
  | TextBlockContent 
  | ImageBlockContent 
  | VideoBlockContent
  | ButtonBlockContent
  | HeroContent
  | FeaturesContent
  | GameChangerContent
  | StoreBrandsContent
  | SustainabilityContent
  | TestimonialsContent
  | BlogPreviewContent
  | NewsletterContent;

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
  | "blog_preview" 
  | "store_brands"
  | "sustainability"
  | "product_carousel"
  | "elevating_essentials"
  | "game_changer"
  | "competitor_comparison";

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
  content?: FeaturesContent;
}

export interface HeroProps {
  content?: HeroContent;
}