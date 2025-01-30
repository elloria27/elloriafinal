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

// Common block types
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
  | "newsletter"
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
  | "contact_business"
  | "heading"
  | "text"
  | "image"
  | "video"
  | "button";

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
  values?: {
    icon: string;
    title: string;
    description: string;
  }[];
}

export interface AboutSustainabilityContent extends BaseBlockContent {
  title?: string;
  description?: string;
  stats?: {
    icon: string;
    value: string;
    label: string;
    description: string;
  }[];
}

export interface AboutTeamContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  members?: {
    name: string;
    role: string;
    image: string;
    quote: string;
  }[];
}

export interface AboutCustomerImpactContent extends BaseBlockContent {
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

export interface AboutCtaContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

// Contact page content types
export interface ContactHeroContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
}

export interface ContactDetailsContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  contactInfo?: {
    address?: string;
    email?: string;
    phone?: string;
    hours?: string;
  };
}

export interface ContactFormContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  submitButtonText?: string;
}

export interface ContactFAQContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  faqs?: {
    question: string;
    answer: string;
  }[];
}

export interface ContactBusinessContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  features?: {
    icon: string;
    title: string;
    description: string;
  }[];
}

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
  | ContactBusinessContent;

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