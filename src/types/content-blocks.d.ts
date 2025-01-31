import { Json } from "@/integrations/supabase/types";
import { ReactNode } from "react";

// Base types
export interface BlockContent {
  [key: string]: string | number | boolean | ReactNode | ReactNode[] | Json | null;
}

export type BlockType = 
  | "hero"
  | "features"
  | "gameChanger"
  | "storeBrands"
  | "sustainability"
  | "productCarousel"
  | "testimonials"
  | "blogPreview"
  | "newsletter"
  | "aboutHero"
  | "aboutStory"
  | "aboutValues"
  | "aboutTeam"
  | "contactHero"
  | "contactForm"
  | "contactDetails"
  | "sustainabilityProgramHero"
  | "sustainabilityProgramBenefits"
  | "sustainabilityProgramSteps"
  | "sustainabilityProgramCta";

export interface ContentBlock {
  id: string;
  page_id?: string;
  type: BlockType;
  content: BlockContent;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

// Hero section
export interface HeroContent extends BlockContent {
  title?: ReactNode;
  subtitle?: ReactNode;
  videoUrl?: string;
}

// Features section
export interface FeaturesProps {
  content?: FeaturesContent;
}

export interface FeaturesContent extends BlockContent {
  title?: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  features?: Feature[];
}

export interface Feature {
  icon?: string;
  title?: string;
  description?: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

// Game Changer section
export interface GameChangerContent extends BlockContent {
  title?: ReactNode;
  subtitle?: ReactNode;
  features?: {
    icon: string;
    title: string;
    description: string;
    detail?: string;
  }[];
}

// Store Brands section
export interface StoreBrandsContent extends BlockContent {
  title?: ReactNode;
  subtitle?: ReactNode;
  features?: {
    title: string;
    description: string;
    detail?: string;
  }[];
}

// Competitor Comparison section
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

// Product Carousel section
export interface ProductCarouselContent extends BlockContent {
  title?: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
}

// Testimonials section
export interface TestimonialsContent extends BlockContent {
  title?: ReactNode;
  testimonials?: {
    name: string;
    rating: number;
    text: string;
    source: string;
  }[];
}

// Blog Preview section
export interface BlogPreviewContent extends BlockContent {
  title?: ReactNode;
  subtitle?: ReactNode;
  articles?: {
    title: string;
    category: string;
    image: string;
  }[];
}

// About page specific blocks
export interface AboutHeroContent extends BlockContent {
  title?: ReactNode;
  subtitle?: ReactNode;
  image?: string;
}

export interface AboutStoryContent extends BlockContent {
  title?: ReactNode;
  subtitle?: ReactNode;
  content?: ReactNode;
  videoUrl?: string;
  videoThumbnail?: string;
}

export interface AboutMissionContent extends BlockContent {
  title?: ReactNode;
  description?: ReactNode;
  values?: {
    icon: string;
    title: string;
    description: string;
  }[];
}

export interface AboutTeamContent extends BlockContent {
  title?: ReactNode;
  subtitle?: ReactNode;
  members?: {
    name: string;
    role: string;
    image: string;
    quote: string;
  }[];
}

export interface AboutCustomerImpactContent extends BlockContent {
  title?: ReactNode;
  description?: ReactNode;
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

export interface AboutSustainabilityContent extends BlockContent {
  title?: ReactNode;
  description?: ReactNode;
  stats?: {
    icon: string;
    value: string;
    label: string;
    description: string;
  }[];
}

export interface AboutCtaContent extends BlockContent {
  title?: ReactNode;
  description?: ReactNode;
  buttonText?: string;
  buttonUrl?: string;
}

// Contact page specific blocks
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
  buttonText?: string;
  buttonUrl?: string;
}

// Custom Solutions page specific blocks
export interface CustomSolutionsHeroContent extends BlockContent {
  title?: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
}

export interface CustomSolutionsServicesContent extends BlockContent {
  title?: ReactNode;
  subtitle?: ReactNode;
  services?: {
    icon: string;
    title: string;
    description: string;
  }[];
}

export interface CustomSolutionsProcessContent extends BlockContent {
  title?: ReactNode;
  subtitle?: ReactNode;
  steps?: {
    number: number;
    title: string;
    description: string;
  }[];
}

export interface CustomSolutionsCtaContent extends BlockContent {
  title?: ReactNode;
  description?: ReactNode;
  buttonText?: string;
  buttonUrl?: string;
}

// For Business page specific blocks
export interface ForBusinessHeroContent extends BlockContent {
  title?: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
}

export interface BusinessSolutionsContent extends BlockContent {
  title?: ReactNode;
  subtitle?: ReactNode;
  solutions?: {
    icon: string;
    title: string;
    description: string;
  }[];
}

export interface BusinessContactContent extends BlockContent {
  title?: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  buttonText?: string;
  buttonUrl?: string;
}