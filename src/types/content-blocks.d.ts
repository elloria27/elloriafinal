import { Database } from "@/integrations/supabase/types";
import { Json } from "@/integrations/supabase/types";

export type BlockType = Database['public']['Enums']['content_block_type'] | 
  'business_hero' | 
  'business_solutions' | 
  'business_contact' |
  'custom_solutions_process';

// Base interface for all content types
interface BaseContent extends Record<string, Json> {
  title?: string;
  subtitle?: string;
  description?: string;
}

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
  | SustainabilityContent
  | AboutHeroContent
  | AboutStoryContent
  | AboutMissionContent
  | AboutSustainabilityContent
  | AboutTeamContent
  | AboutCustomerImpactContent
  | AboutCtaContent
  | ContactHeroContent
  | ContactDetailsContent
  | ContactFormContent
  | ContactFAQContent
  | ContactBusinessContent
  | BusinessHeroContent
  | BusinessSolutionsContent
  | BusinessContactContent
  | CustomSolutionsProcessContent
  | ImageBlockContent
  | HeadingBlockContent;

export interface HeroContent extends BaseContent {
  videoUrl?: string;
  videoPoster?: string;
  shopNowText?: string;
  learnMoreText?: string;
  backgroundImage?: string;
}

export interface FeaturesContent extends BaseContent {
  features?: FeatureItem[];
}

export interface FeatureItem extends Record<string, Json> {
  icon: string;
  title: string;
  description: string;
  detail?: string;
}

export interface GameChangerContent extends BaseContent {
  features?: FeatureItem[];
}

export interface StoreBrandsContent extends BaseContent {
  features?: FeatureItem[];
  buttonText?: string;
}

export interface ProductCarouselContent extends BaseContent {
  products?: string[];
}

export interface CompetitorComparisonContent extends BaseContent {
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

export interface TestimonialsContent extends BaseContent {
  testimonials?: {
    name: string;
    rating: number;
    text: string;
    source: string;
  }[];
  items?: any[];
}

export interface BlogPreviewContent extends BaseContent {
  posts?: string[];
  buttonText?: string;
}

export interface NewsletterContent extends BaseContent {
  buttonText?: string;
}

export interface SustainabilityContent extends BaseContent {
  stats?: SustainabilityStat[];
  materials?: SustainabilityMaterial[];
  timeline?: SustainabilityTimelineItem[];
}

export interface AboutHeroContent extends HeroContent {}

export interface AboutStoryContent extends BaseContent {
  content?: string;
  videoUrl?: string;
  videoThumbnail?: string;
}

export interface AboutMissionContent extends BaseContent {
  values?: FeatureItem[];
}

export interface AboutSustainabilityContent extends SustainabilityContent {}

export interface AboutTeamContent extends BaseContent {
  members?: {
    name: string;
    role: string;
    image: string;
    quote: string;
  }[];
}

export interface AboutCustomerImpactContent extends BaseContent {
  stats?: {
    value: string;
    label: string;
  }[];
  testimonials?: {
    quote: string;
    author: string;
    role: string;
    rating: number;
  }[];
}

export interface AboutCtaContent extends BaseContent {
  buttonText?: string;
  buttonLink?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
}

export interface ContactHeroContent extends BaseContent {}

export interface ContactDetailsContent extends BaseContent {
  address?: string;
  phone?: string;
  email?: string;
}

export interface ContactFormContent extends BaseContent {
  buttonText?: string;
  secondaryButtonText?: string;
}

export interface ContactFAQContent extends BaseContent {
  faqs?: {
    question: string;
    answer: string;
  }[];
}

export interface ContactBusinessContent extends BaseContent {
  email?: string;
  buttonText?: string;
  buttonLink?: string;
}

export interface BusinessHeroContent extends HeroContent {}

export interface BusinessSolutionsContent extends BaseContent {
  solutions?: FeatureItem[];
}

export interface BusinessContactContent extends ContactBusinessContent {}

export interface CustomSolutionsProcessContent extends BaseContent {
  steps?: CustomSolutionsProcessStep[];
}

export interface CustomSolutionsProcessStep extends Record<string, Json> {
  title: string;
  description: string;
  icon: string;
  number?: number;
}

export interface ImageBlockContent extends BaseContent {
  url?: string;
  alt?: string;
  caption?: string;
}

export interface HeadingBlockContent extends BaseContent {
  text?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  alignment?: 'left' | 'center' | 'right';
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