import { Json } from "@/integrations/supabase/types";

// Base types
export interface BaseBlockContent {
  [key: string]: string | number | boolean | null | Json;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
  detail?: string;
}

// Home page specific content types
export interface HeroContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  videoUrl?: string;
  buttonText?: string;
  buttonUrl?: string;
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
  description?: string;
  features?: FeatureItem[];
}

export interface StoreBrandsContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  features?: {
    title: string;
    description: string;
    detail?: string;
  }[];
}

export interface SustainabilityContent extends BaseBlockContent {
  title?: string;
  description?: string;
  stats?: {
    icon: string;
    title: string;
    description: string;
    color: string;
  }[];
  timelineItems?: string[];
}

export interface ProductCarouselContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  description?: string;
  products?: {
    id: string;
    name: string;
    image: string;
    price: number;
  }[];
}

export interface CompetitorComparisonContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  metrics?: {
    category: string;
    elloria: number;
    competitors: number;
    icon: string;
    description: string;
  }[];
  buttonText?: string;
  buttonUrl?: string;
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
  posts?: {
    title: string;
    excerpt: string;
    image: string;
    date: string;
    category: string;
  }[];
}

export interface NewsletterContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

// Block type definition
export type BlockType = 
  | "hero"
  | "features"
  | "game_changer"
  | "store_brands"
  | "sustainability"
  | "product_carousel"
  | "competitor_comparison"
  | "testimonials"
  | "blog_preview"
  | "newsletter";

// Combined content type
export type BlockContent =
  | HeroContent
  | FeaturesContent
  | GameChangerContent
  | StoreBrandsContent
  | SustainabilityContent
  | ProductCarouselContent
  | CompetitorComparisonContent
  | TestimonialsContent
  | BlogPreviewContent
  | NewsletterContent;

// Main content block interface
export interface ContentBlock {
  id: string;
  type: BlockType;
  content: BlockContent;
  order_index: number;
  page_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Props interfaces for components
export interface FeaturesProps {
  content?: FeaturesContent;
}

export interface HeroProps {
  content?: HeroContent;
}