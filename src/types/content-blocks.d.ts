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
  description?: string;
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
  description?: string;
  statsTitle?: string;
  stats?: {
    icon: string;
    title: string;
    description: string;
    color: string;
  }[];
  timelineItems?: string[];
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

export interface ProductCarouselContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  description?: string;
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

export interface ContactHeroContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
}

export interface ContactDetailsContent extends BaseBlockContent {
  address?: string;
  phone?: string;
  email?: string;
}

export interface ContactFormContent extends BaseBlockContent {
  title?: string;
  description?: string;
  buttonText?: string;
  secondaryButtonText?: string;
}

export interface ContactFAQContent extends BaseBlockContent {
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}

export interface ContactBusinessContent extends BaseBlockContent {
  title?: string;
  description?: string;
  email?: string;
  buttonText?: string;
  buttonLink?: string;
}

export interface AboutHeroContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
}

export interface AboutStoryContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  content?: string;
  image?: string;
}

export interface AboutMissionContent extends BaseBlockContent {
  title?: string;
  description?: string;
  values?: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
}

export interface AboutSustainabilityContent extends BaseBlockContent {
  title?: string;
  description?: string;
  stats?: Array<{
    value: string;
    label: string;
  }>;
  initiatives?: Array<{
    title: string;
    description: string;
  }>;
}

export interface AboutTeamContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  members?: Array<{
    name: string;
    role: string;
    image?: string;
    bio?: string;
  }>;
}

export interface AboutCustomerImpactContent extends BaseBlockContent {
  title?: string;
  description?: string;
  testimonials?: Array<{
    quote: string;
    author: string;
    location?: string;
  }>;
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
  | NewsletterContent
  | ProductCarouselContent
  | CompetitorComparisonContent
  | ContactHeroContent
  | ContactDetailsContent
  | ContactFormContent
  | ContactFAQContent
  | ContactBusinessContent
  | AboutHeroContent
  | AboutStoryContent
  | AboutMissionContent
  | AboutSustainabilityContent
  | AboutTeamContent
  | AboutCustomerImpactContent;

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
  | "product_gallery"
  | "elevating_essentials"
  | "game_changer"
  | "competitor_comparison"
  | "about_hero_section"
  | "about_story"
  | "about_mission"
  | "about_sustainability"
  | "about_team"
  | "about_customer_impact"
  | "contact_hero"
  | "contact_details"
  | "contact_form"
  | "contact_faq"
  | "contact_business";

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
