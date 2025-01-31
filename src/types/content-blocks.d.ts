import { ReactNode } from "react";
import { Json } from "@/integrations/supabase/types";

// Base types
export interface BlockContent {
  [key: string]: ReactNode | string | number | boolean | Json | null;
}

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
  | "heading"
  | "text"
  | "image"
  | "video"
  | "button"
  | "product_gallery"
  | "about_hero_section"
  | "about_story"
  | "about_mission"
  | "about_team"
  | "about_customer_impact"
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
  page_id?: string;
  type: BlockType;
  content: BlockContent;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

// Component-specific content types
export interface HeroContent extends BlockContent {
  title?: ReactNode;
  subtitle?: ReactNode;
  videoUrl?: string;
}

export interface FeaturesProps {
  content?: FeaturesContent;
}

export interface FeaturesContent extends BlockContent {
  title?: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  features?: FeatureItem[];
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface GameChangerContent extends BlockContent {
  title?: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  features?: {
    icon: string;
    title: string;
    description: string;
    detail?: string;
  }[];
}

export interface StoreBrandsContent extends BlockContent {
  title?: ReactNode;
  subtitle?: ReactNode;
  features?: {
    title: string;
    description: string;
    detail?: string;
  }[];
}

export interface ProductCarouselContent extends BlockContent {
  title?: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
}

export interface CompetitorComparisonContent extends BlockContent {
  title?: ReactNode;
  subtitle?: ReactNode;
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

export interface TestimonialsContent extends BlockContent {
  title?: ReactNode;
  testimonials?: {
    name: string;
    rating: number;
    text: string;
    source: string;
  }[];
}

export interface BlogPreviewContent extends BlockContent {
  title?: ReactNode;
  subtitle?: ReactNode;
  articles?: {
    title: string;
    category: string;
    image: string;
  }[];
}

export interface NewsletterContent extends BlockContent {
  title?: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
}

// About page content types
export interface AboutHeroContent extends BlockContent {
  title?: ReactNode;
  subtitle?: ReactNode;
  backgroundImage?: string;
}

export interface AboutStoryContent extends BlockContent {
  title?: ReactNode;
  content?: ReactNode;
  videoUrl?: string;
}

export interface AboutMissionContent extends BlockContent {
  title?: ReactNode;
  description?: ReactNode;
  values?: {
    title: string;
    description: string;
    icon: string;
  }[];
}

export interface AboutTeamContent extends BlockContent {
  title?: ReactNode;
  subtitle?: ReactNode;
  team?: {
    name: string;
    role: string;
    image: string;
    bio?: string;
  }[];
}

export interface AboutCustomerImpactContent extends BlockContent {
  title?: ReactNode;
  description?: ReactNode;
  stats?: {
    value: string;
    label: string;
  }[];
}

export interface AboutSustainabilityContent extends BlockContent {
  title?: ReactNode;
  description?: ReactNode;
  initiatives?: {
    title: string;
    description: string;
    icon: string;
  }[];
}

// Contact page content types
export interface ContactHeroContent extends BlockContent {
  title?: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
}

export interface ContactDetailsContent extends BlockContent {
  title?: ReactNode;
  details: {
    icon: string;
    label: string;
    value: string;
  }[];
}

export interface ContactFormContent extends BlockContent {
  title?: ReactNode;
  description?: ReactNode;
}

export interface ContactFAQContent extends BlockContent {
  title?: ReactNode;
  subtitle?: ReactNode;
  faqs?: {
    question: string;
    answer: string;
  }[];
}

export interface ContactBusinessContent extends BlockContent {
  title?: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  buttonText?: ReactNode;
  buttonUrl?: string;
}

// Custom Solutions content types
export interface CustomSolutionsHeroContent extends BlockContent {
  title?: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
}

export interface CustomSolutionsServicesContent extends BlockContent {
  title?: ReactNode;
  subtitle?: ReactNode;
  services?: {
    title: string;
    description: string;
    icon: string;
  }[];
}

export interface CustomSolutionsProcessContent extends BlockContent {
  title?: ReactNode;
  subtitle?: ReactNode;
  steps?: {
    title: string;
    description: string;
    icon: string;
  }[];
}

export interface CustomSolutionsCtaContent extends BlockContent {
  title?: ReactNode;
  description?: ReactNode;
  buttonText?: string;
  buttonUrl?: string;
}

// Business page content types
export interface BusinessSolutionsContent extends BlockContent {
  title?: ReactNode;
  subtitle?: ReactNode;
  solutions?: {
    title: string;
    description: string;
    icon: string;
  }[];
}

export interface ForBusinessHeroContent extends BlockContent {
  title?: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
}

export interface BusinessContactContent extends BlockContent {
  title?: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  buttonText?: string;
  buttonUrl?: string;
}