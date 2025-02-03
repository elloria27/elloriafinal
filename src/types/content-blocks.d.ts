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
  buttonText?: string;
}

export interface ProductCarouselContent {
  title?: string;
  subtitle?: string;
  description?: string;
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
  items?: any[];
}

export interface BlogPreviewContent {
  title?: string;
  subtitle?: string;
  posts?: string[];
  buttonText?: string;
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

export interface AboutHeroContent extends HeroContent {}

export interface AboutStoryContent {
  title?: string;
  subtitle?: string;
  content?: string;
  videoUrl?: string;
  videoThumbnail?: string;
}

export interface AboutMissionContent {
  title?: string;
  subtitle?: string;
  description?: string;
  values?: FeatureItem[];
}

export interface AboutSustainabilityContent extends SustainabilityContent {}

export interface AboutTeamContent {
  title?: string;
  subtitle?: string;
  members?: {
    name: string;
    role: string;
    image: string;
    quote: string;
  }[];
}

export interface AboutCustomerImpactContent {
  title?: string;
  description?: string;
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

export interface AboutCtaContent {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}

export interface ContactHeroContent {
  title?: string;
  subtitle?: string;
}

export interface ContactDetailsContent {
  address?: string;
  phone?: string;
  email?: string;
}

export interface ContactFormContent {
  title?: string;
  description?: string;
  buttonText?: string;
  secondaryButtonText?: string;
}

export interface ContactFAQContent {
  title?: string;
  description?: string;
  faqs?: {
    question: string;
    answer: string;
  }[];
}

export interface ContactBusinessContent {
  title?: string;
  description?: string;
  email?: string;
  buttonText?: string;
  buttonLink?: string;
}

export interface BusinessHeroContent extends HeroContent {}

export interface BusinessSolutionsContent {
  title?: string;
  subtitle?: string;
  solutions?: FeatureItem[];
}

export interface BusinessContactContent extends ContactBusinessContent {}

export interface CustomSolutionsProcessContent {
  title?: string;
  subtitle?: string;
  steps?: CustomSolutionsProcessStep[];
}

export interface CustomSolutionsProcessStep {
  title: string;
  description: string;
  icon: string;
}

export interface ImageBlockContent {
  url?: string;
  alt?: string;
  caption?: string;
}

export interface HeadingBlockContent {
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