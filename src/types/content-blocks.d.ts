import { Json } from "@/integrations/supabase/types";

export interface BlockContent {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: Json[];
}

export interface ContentBlock {
  id: string;
  page_id?: string | null;
  type: BlockType;
  content: BlockContent;
  order_index: number;
}

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
  | "contact_business";

export interface HeroContent extends BlockContent {
  videoUrl?: string;
  videoPoster?: string;
  backgroundImage?: string;
  shopNowText?: string;
  learnMoreText?: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
  detail?: string;
}

export interface FeaturesContent extends BlockContent {
  features?: FeatureItem[];
}

export interface FeaturesProps {
  content?: FeaturesContent;
}

export interface GameChangerContent extends BlockContent {
  features?: FeatureItem[];
}

export interface StoreBrandsContent extends BlockContent {
  features?: Json[];
}

export interface SustainabilityContent extends BlockContent {
  features?: FeatureItem[];
}

export interface ProductCarouselContent extends BlockContent {
  products?: Json[];
}

export interface TestimonialsContent extends BlockContent {
  testimonials?: {
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

export interface AboutHeroContent extends BlockContent {
  backgroundImage?: string;
}

export interface AboutStoryContent extends BlockContent {
  image?: string;
  milestones?: {
    year: string;
    title: string;
    description: string;
  }[];
}

export interface AboutMissionContent extends BlockContent {
  values?: FeatureItem[];
}

export interface AboutSustainabilityContent extends BlockContent {
  stats?: {
    value: string;
    label: string;
    description: string;
  }[];
}

export interface AboutTeamContent extends BlockContent {
  members?: {
    name: string;
    role: string;
    image: string;
    quote?: string;
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

export interface CompetitorComparisonContent extends BlockContent {
  competitors?: {
    name: string;
    features: string[];
  }[];
}

export interface ContactHeroContent extends BlockContent {
  backgroundImage?: string;
}

export interface ContactDetailsContent extends BlockContent {
  email?: string;
  phone?: string;
  address?: string;
  hours?: string[];
  socialLinks?: {
    platform: string;
    url: string;
  }[];
}

export interface ContactFormContent extends BlockContent {
  submitButtonText?: string;
  successMessage?: string;
}

export interface ContactFAQContent extends BlockContent {
  faqs?: {
    question: string;
    answer: string;
  }[];
}

export interface ContactBusinessContent extends BlockContent {
  email?: string;
  phone?: string;
}

export interface CustomSolutionsHeroContent extends BlockContent {
  backgroundImage?: string;
}

export interface CustomSolutionsServicesContent extends BlockContent {
  services?: FeatureItem[];
}

export interface CustomSolutionsProcessContent extends BlockContent {
  steps?: {
    title: string;
    description: string;
  }[];
}

export interface CustomSolutionsCtaContent extends BlockContent {
  buttonText?: string;
}

export interface ForBusinessHeroContent extends BlockContent {
  backgroundImage?: string;
}

export interface BusinessSolutionsContent extends BlockContent {
  solutions?: FeatureItem[];
}

export interface BusinessContactContent extends BlockContent {
  email?: string;
  phone?: string;
}

export interface AboutCtaContent extends BlockContent {
  buttonText?: string;
  backgroundImage?: string;
}