import { Json } from "@/integrations/supabase/types";

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

// Common content interfaces
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

export interface FeaturesContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: FeatureItem[];
}

export interface StoreBrandsContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  features?: Json[];
}

export interface ProductCarouselContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
}

export interface CompetitorComparisonContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  metrics?: Array<{
    category: string;
    elloria: number;
    competitors: number;
    icon: string;
    description: string;
  }>;
  buttonText?: string;
  buttonUrl?: string;
}

export interface NewsletterContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

// About page content types
export interface AboutHeroContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
}

export interface AboutStoryContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  content?: string;
  videoUrl?: string;
  videoThumbnail?: string;
}

export interface AboutMissionContent extends BaseBlockContent {
  title?: string;
  description?: string;
  values?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

export interface AboutSustainabilityContent extends BaseBlockContent {
  title?: string;
  description?: string;
  stats?: Array<{
    icon: string;
    value: string;
    label: string;
    description: string;
  }>;
}

export interface AboutTeamContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  members?: Array<{
    name: string;
    role: string;
    image: string;
    quote: string;
  }>;
}

export interface AboutCustomerImpactContent extends BaseBlockContent {
  title?: string;
  description?: string;
  stats?: Array<{
    value: string;
    label: string;
  }>;
  testimonials?: Array<{
    quote: string;
    author: string;
    role: string;
    rating: number;
  }>;
}

export interface AboutCtaContent extends BaseBlockContent {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
}

// Contact page content types
export interface ContactHeroContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
}

export interface ContactDetailsContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  address?: string;
  phone?: string;
  email?: string;
}

export interface ContactFormContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
}

export interface ContactFAQContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}

export interface ContactBusinessContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
}

// Custom Solutions content types
export interface CustomSolutionsHeroContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
}

export interface CustomSolutionsServicesContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  services?: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
}

export interface CustomSolutionsProcessContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  steps?: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
}

export interface CustomSolutionsCtaContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonUrl?: string;
}

// Business page content types
export interface ForBusinessHeroContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
}

export interface BusinessSolutionsContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  solutions?: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
}

export interface BusinessContactContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
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
  | FeaturesContent
  | StoreBrandsContent
  | ProductCarouselContent
  | CompetitorComparisonContent
  | NewsletterContent
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
  | CustomSolutionsHeroContent
  | CustomSolutionsServicesContent
  | CustomSolutionsProcessContent
  | CustomSolutionsCtaContent
  | ForBusinessHeroContent
  | BusinessSolutionsContent
  | BusinessContactContent;

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
  | "store_brands"
  | "sustainability"
  | "product_carousel"
  | "competitor_comparison"
  | "newsletter"
  | "about_hero_section"
  | "about_story"
  | "about_mission"
  | "about_sustainability"
  | "about_team"
  | "about_customer_impact"
  | "about_cta"
  | "contact_hero"
  | "contact_details"
  | "contact_form"
  | "contact_faq"
  | "contact_business"
  | "custom_solutions_hero"
  | "custom_solutions_services"
  | "custom_solutions_process"
  | "custom_solutions_cta"
  | "business_hero"
  | "business_solutions"
  | "business_contact";

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