import { Json } from "@/integrations/supabase/types";

export interface BaseBlockContent {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: any[];
}

export interface ContentBlock {
  id: string;
  page_id: string;
  type: string;
  content: Json;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface BlogPreviewContent extends BaseBlockContent {
  buttonText?: string;
}

export interface CompetitorComparisonContent extends BaseBlockContent {
  metrics?: Array<{
    category: string;
    elloria: number;
    competitors: number;
    icon: string;
    description: string;
  }>;
}

export interface FeaturesProps {
  features?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  title?: string;
  subtitle?: string;
  description?: string;
}

export interface GameChangerContent extends BaseBlockContent {
  features?: Array<{
    icon: string;
    title: string;
    description: string;
    detail?: string;
  }>;
}

export interface HeroContent extends BaseBlockContent {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  videoUrl?: string;
  videoPoster?: string;
  shopNowText?: string;
  learnMoreText?: string;
}

export interface ProductCarouselContent extends BaseBlockContent {
  title: string;
}

export interface StoreBrandsContent extends BaseBlockContent {
  features?: Array<{
    title: string;
    description: string;
    detail?: string;
  }>;
}

export interface TestimonialsContent extends BaseBlockContent {
  testimonials: Array<{
    name: string;
    rating: number;
    text: string;
    source?: string;
  }>;
}

export interface NewsletterContent extends BaseBlockContent {}

export interface SustainabilityContent extends BaseBlockContent {
  stats?: Array<{
    icon: string;
    title: string;
    description: string;
    color: string;
  }>;
  timelineItems?: string[];
}

// About page content types
export interface AboutHeroContent extends HeroContent {}
export interface AboutStoryContent extends BaseBlockContent {}
export interface AboutMissionContent extends BaseBlockContent {}
export interface AboutSustainabilityContent extends SustainabilityContent {}
export interface AboutTeamContent extends BaseBlockContent {}
export interface AboutCustomerImpactContent extends BaseBlockContent {}
export interface AboutCtaContent extends BaseBlockContent {}

// Contact page content types
export interface ContactBusinessContent extends BaseBlockContent {}
export interface ContactDetailsContent extends BaseBlockContent {}
export interface ContactFAQContent extends BaseBlockContent {}
export interface ContactFormContent extends BaseBlockContent {}
export interface ContactHeroContent extends HeroContent {}

export interface BulkOrdersContent {
  title: string;
  description: string;
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}