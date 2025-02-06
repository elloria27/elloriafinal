import { Json } from "@/integrations/supabase/types";
import { ReactNode } from "react";

export interface BaseBlockContent {
  title?: string;
  subtitle?: string;
  description?: ReactNode;
  buttonText?: string;
  buttonUrl?: string;
}

export interface ContentBlock {
  id: string;
  type: string;
  content: BaseBlockContent;
  page_id: string;
  order_index: number;
}

export interface CompetitorComparisonContent extends BaseBlockContent {
  competitors?: Array<{
    name: string;
    features: string[];
  }>;
}

export interface FeaturesProps extends BaseBlockContent {
  features?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

export interface TestimonialsContent extends BaseBlockContent {
  testimonials?: Array<{
    quote: string;
    author: string;
    role: string;
    rating: number;
  }>;
}

export interface AboutCustomerImpactContent extends BaseBlockContent {
  stats: Array<{
    value: string;
    label: string;
  }>;
  testimonials: Array<{
    quote: string;
    author: string;
    role: string;
    rating: number;
  }>;
}

export interface AboutHeroContent extends BaseBlockContent {
  title: string;
  subtitle: string;
  backgroundImage: string;
}

export interface AboutStoryContent extends BaseBlockContent {
  videoUrl: string;
  videoThumbnail: string;
}

export interface AboutSustainabilityContent extends BaseBlockContent {
  stats: Array<{
    icon: string;
    value: string;
    label: string;
    description: string;
  }>;
}

export interface AboutTeamContent extends BaseBlockContent {
  members: Array<{
    name: string;
    role: string;
    image: string;
    quote: string;
  }>;
}

export interface AboutCtaContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
}

export interface ContactFormContent extends BaseBlockContent {
  submitText?: string;
}

export interface ContactDetailsContent extends BaseBlockContent {
  address: string;
  phone: string;
  email: string;
}

export interface ContactBusinessContent extends BaseBlockContent {
  email: string;
  buttonLink: string;
}

export interface HeroContent extends BaseBlockContent {
  videoUrl?: string;
  videoPoster?: string;
  shopNowText?: string;
  learnMoreText?: string;
}

export interface StoreBrandsContent extends BaseBlockContent {
  features?: Array<{
    name: string;
    logo: string;
    link: string;
  }>;
}

export interface GameChangerContent extends BaseBlockContent {
  features?: Array<{
    icon: string;
    title: string;
    description: string;
    detail?: string;
  }>;
}

export interface SustainabilityContent extends BaseBlockContent {
  stats?: Array<{
    icon: string;
    title: string;
    description: string;
    color: string;
  }>;
  timelineItems?: string[];
}

export interface ProductCarouselContent extends BaseBlockContent {
  products?: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
  }>;
}

export interface BlogPreviewContent extends BaseBlockContent {
  posts?: Array<{
    id: string;
    title: string;
    excerpt: string;
    image: string;
  }>;
}

export interface NewsletterContent extends BaseBlockContent {
  buttonText?: string;
}