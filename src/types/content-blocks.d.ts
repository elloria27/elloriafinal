import { Database } from "@/integrations/supabase/types";

export type BlockType = Database['public']['Enums']['content_block_type'];

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: BlockContent;
  order_index: number;
  page_id?: string;
  created_at?: string;
  updated_at?: string;
}

export type BlockContent =
  | HeroContent
  | FeaturesContent
  | GameChangerContent
  | StoreBrandsContent
  | ProductCarouselContent
  | CompetitorComparisonContent
  | TestimonialsContent
  | BlogPreviewContent
  | NewsletterContent
  | SustainabilityContent;

export interface FeaturesProps {
  content?: FeaturesContent;
}

export interface HeroContent {
  title?: string;
  subtitle?: string;
  description?: string;
  videoUrl?: string;
  videoPoster?: string;
  shopNowText?: string;
  learnMoreText?: string;
}

export interface FeaturesContent {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: FeatureItem[];
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
  detail?: string;
}

export interface GameChangerContent {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: FeatureItem[];
}

export interface StoreBrandsContent {
  title?: string;
  subtitle?: string;
  features?: FeatureItem[];
}

export interface ProductCarouselContent {
  title?: string;
  subtitle?: string;
  products?: string[];
}

export interface CompetitorComparisonContent {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonUrl?: string;
  metrics?: {
    category: string;
    elloria: number;
    competitors: number;
    icon: string;
    description: string;
  }[];
}

export interface TestimonialsContent {
  title?: string;
  subtitle?: string;
  testimonials?: {
    name: string;
    rating: number;
    text: string;
    source: string;
  }[];
}

export interface BlogPreviewContent {
  title?: string;
  subtitle?: string;
  posts?: string[];
}

export interface NewsletterContent {
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

export interface SustainabilityContent {
  title?: string;
  subtitle?: string;
  description?: string;
  stats?: SustainabilityStat[];
  materials?: SustainabilityMaterial[];
  timeline?: SustainabilityTimelineItem[];
}

export interface SustainabilityStat {
  icon: string;
  value: string;
  label: string;
  description: string;
}

export interface SustainabilityMaterial {
  icon: string;
  title: string;
  description: string;
}

export interface SustainabilityTimelineItem {
  icon: string;
  title: string;
  description: string;
  color: string;
}