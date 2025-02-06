import { BaseBlockContent } from "./basic";
import { Json } from "@/integrations/supabase/types";

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
  detail?: string;
}

export interface TestimonialItem {
  name: string;
  rating: number;
  text: string;
  source: string;
}

export interface HeroContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  videoUrl?: string;
  videoPoster?: string;
  shopNowText?: string;
  learnMoreText?: string;
}

export interface FeaturesContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: Json;
}

export interface GameChangerContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: Json;
}

export interface StoreBrandsContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  features?: Json;
}

export interface SustainabilityContent extends BaseBlockContent {
  title?: string;
  description?: string;
  stats?: Json;
  timelineItems?: string[];
}

export interface TestimonialsContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  testimonials?: Json;
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