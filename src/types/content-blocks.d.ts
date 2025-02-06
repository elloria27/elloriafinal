import { ReactNode } from 'react';
import { Json } from '@/integrations/supabase/types';

export interface BaseBlockContent {
  title?: string;
  subtitle?: string;
  description?: ReactNode;
}

export interface BlogPreviewContent extends BaseBlockContent {
  buttonText?: string;
}

export interface CompetitorComparisonContent extends BaseBlockContent {
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

export interface GameChangerContent extends BaseBlockContent {
  features?: {
    icon: string;
    title: string;
    description: string;
    detail: string;
  }[];
}

export interface NewsletterContent extends BaseBlockContent {
  buttonText?: string;
}

export interface StoreBrandsContent extends BaseBlockContent {
  features?: {
    title: string;
    description: string;
    detail?: string;
  }[];
}

export interface SustainabilityContent extends BaseBlockContent {
  stats?: {
    icon: string;
    value: string;
    label: string;
    description: string;
  }[];
}

export interface TestimonialsContent extends BaseBlockContent {
  testimonials: {
    name: string;
    rating: number;
    text: string;
    source: string;
  }[];
}

export interface AboutCustomerImpactContent extends BaseBlockContent {
  stats: {
    value: string;
    label: string;
  }[];
  testimonials: {
    quote: string;
    author: string;
    role: string;
    rating: number;
  }[];
}

export interface AboutHeroContent extends BaseBlockContent {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

export interface AboutMissionContent extends BaseBlockContent {
  values?: {
    icon: string;
    title: string;
    description: string;
  }[];
}

export interface AboutStoryContent extends BaseBlockContent {
  videoUrl: string;
  videoThumbnail: string;
}

export interface AboutSustainabilityContent extends BaseBlockContent {
  stats: {
    icon: string;
    value: string;
    label: string;
    description: string;
  }[];
}

export interface AboutTeamContent extends BaseBlockContent {
  members: {
    name: string;
    role: string;
    image: string;
    quote: string;
  }[];
}

export interface AboutCtaContent extends BaseBlockContent {
  primaryButtonText: string;
  secondaryButtonText: string;
}

export interface ContactHeroContent extends BaseBlockContent {
  title: string;
}

export interface ContactDetailsContent extends BaseBlockContent {
  address: string;
  phone: string;
  email: string;
}

export interface ContactFormContent extends BaseBlockContent {
  buttonText?: string;
  secondaryButtonText?: string;
}

export interface ContactFAQContent extends BaseBlockContent {
  faqs: {
    question: string;
    answer: string;
  }[];
}

export interface ContactBusinessContent extends BaseBlockContent {
  email: string;
  buttonLink: string;
  buttonText?: string;
}

export interface HeroContent extends BaseBlockContent {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  shopNowText?: string;
  learnMoreText?: string;
  videoUrl?: string;
  videoPoster?: string;
}

export interface ProductCarouselContent extends BaseBlockContent {
  title: string;
}

export interface ContentBlock {
  id: string;
  type: string;
  content: Json;
  page_id: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface FeaturesProps {
  features?: {
    icon: string;
    title: string;
    description: string;
  }[];
  title?: string;
  subtitle?: string;
  description?: ReactNode;
}

export interface BulkOrdersContent extends BaseBlockContent {
  title: string;
  description: string;
  features: {
    icon: string;
    title: string;
    description: string;
  }[];
}

export interface BulkOrdersProps {
  content: BulkOrdersContent;
}
