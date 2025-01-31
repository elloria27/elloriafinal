import { Json } from "@/integrations/supabase/types";
import { ReactNode } from "react";

export type BlockType = 
  | "hero"
  | "features" 
  | "game_changer"
  | "store_brands"
  | "sustainability"
  | "product_carousel"
  | "testimonials"
  | "blog_preview"
  | "newsletter"
  | "heading"
  | "text"
  | "image"
  | "video"
  | "button"
  | "product_gallery"
  | "about_hero_section"
  | "about_story"
  | "about_mission"
  | "about_sustainability"
  | "about_team"
  | "about_customer_impact"
  | "competitor_comparison"
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

export interface BlockContent {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: Json[];
  text?: string;
  level?: string;
  url?: string;
  alt?: string;
  variant?: string;
  items?: Json[];
  count?: number;
  [key: string]: Json | undefined;
}

export interface ContentBlock {
  id: string;
  page_id?: string | null;
  type: BlockType;
  content: BlockContent;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
  detail?: string;
}

export interface FeaturesProps {
  content?: FeaturesContent;
}

export interface FeaturesContent extends BlockContent {
  features?: FeatureItem[];
}

export interface GameChangerContent extends BlockContent {
  features?: FeatureItem[];
}

export interface StoreBrandsContent extends BlockContent {
  features?: Json[];
}

export interface SustainabilityContent extends BlockContent {
  stats?: {
    value: string;
    label: string;
    description: string;
  }[];
  timelineItems?: {
    year: string;
    title: string;
    description: string;
  }[];
}

export interface ProductCarouselContent extends BlockContent {
  products?: Json[];
}

export interface TestimonialsContent extends BlockContent {
  items?: {
    name: string;
    role?: string;
    comment: string;
    rating: number;
    source?: string;
  }[];
}

export interface BlogPost {
  id: string;
  title: string;
  category?: string;
  featured_image: string;
}

export interface BlogPreviewContent extends BlockContent {
  viewAllButtonText?: string;
  articles?: BlogPost[];
}

export interface NewsletterContent extends BlockContent {
  buttonText?: string;
}

export interface HeroContent extends BlockContent {
  videoUrl?: string;
  videoPoster?: string;
  backgroundImage?: string;
  shopNowText?: string;
  learnMoreText?: string;
}

export interface AboutHeroContent extends HeroContent {}
export interface AboutStoryContent extends BlockContent {
  content?: string;
  videoUrl?: string;
  videoThumbnail?: string;
}
export interface AboutMissionContent extends BlockContent {}
export interface AboutSustainabilityContent extends SustainabilityContent {}
export interface AboutTeamContent extends BlockContent {
  members?: {
    name: string;
    role: string;
    image: string;
    quote: string;
  }[];
}
export interface AboutCustomerImpactContent extends BlockContent {
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
export interface AboutCtaContent extends BlockContent {
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

export interface CompetitorComparisonContent extends BlockContent {
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

export interface ContactHeroContent extends BlockContent {}
export interface ContactDetailsContent extends BlockContent {}
export interface ContactFormContent extends BlockContent {
  buttonText?: string;
  secondaryButtonText?: string;
}
export interface ContactFAQContent extends BlockContent {
  faqs?: {
    question: string;
    answer: string;
  }[];
}
export interface ContactBusinessContent extends BlockContent {
  buttonText?: string;
  buttonLink?: string;
}

export interface CustomSolutionsHeroContent extends BlockContent {}
export interface CustomSolutionsServicesContent extends BlockContent {}
export interface CustomSolutionsProcessContent extends BlockContent {}
export interface CustomSolutionsCtaContent extends BlockContent {
  buttonText?: string;
  buttonLink?: string;
}

export interface ForBusinessHeroContent extends BlockContent {
  buttonText?: string;
  buttonLink?: string;
}
export interface BusinessSolutionsContent extends BlockContent {}
export interface BusinessContactContent extends BlockContent {
  buttonText?: string;
  buttonLink?: string;
}