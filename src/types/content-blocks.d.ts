import { Json } from "@/integrations/supabase/types";
import { 
  SustainabilityHeroContent,
  SustainabilityMissionContent,
  SustainabilityMaterialsContent,
  SustainabilityFAQContent,
  SustainabilityCTAContent
} from "./sustainability";

// Base interface with index signature for Json compatibility
export interface BaseBlockContent {
  [key: string]: Json | any;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
  detail?: string;
}

export interface HeadingBlockContent extends BaseBlockContent {
  text?: string;
  level?: 'h1' | 'h2' | 'h3' | 'h4';
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
  videoPoster?: string;
  shopNowText?: string;
  learnMoreText?: string;
}

export interface TestimonialsContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  items?: Array<{
    author: string;
    content: string;
  }>;
}

export interface BlogPreviewContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  count?: number;
}

export interface GameChangerContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: FeatureItem[];
}

export type BlockContent = 
  | HeadingBlockContent 
  | TextBlockContent 
  | ImageBlockContent 
  | VideoBlockContent
  | ButtonBlockContent
  | HeroContent
  | GameChangerContent
  | TestimonialsContent
  | BlogPreviewContent
  | SustainabilityHeroContent
  | SustainabilityMissionContent
  | SustainabilityMaterialsContent
  | SustainabilityFAQContent
  | SustainabilityCTAContent;

export type BlockType = 
  | "heading" 
  | "text" 
  | "image" 
  | "video" 
  | "button" 
  | "hero" 
  | "features" 
  | "testimonials" 
  | "blog_preview"
  | "game_changer"
  | "sustainability_hero"
  | "sustainability_mission"
  | "sustainability_materials"
  | "sustainability_faq"
  | "sustainability_cta";

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: BlockContent;
  order_index: number;
  page_id?: string;
  created_at?: string;
  updated_at?: string;
}
