import { Json } from '@/integrations/supabase/types';

export interface BaseBlockContent {
  title?: string;
  subtitle?: string;
  description?: string;
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

export interface HeroContent extends BaseBlockContent {
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  cta_text?: string;
  cta_link?: string;
}

export interface FeaturesContent extends BaseBlockContent {
  features: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
}

export interface TestimonialsContent extends BaseBlockContent {
  testimonials: Array<{
    name: string;
    role?: string;
    content: string;
    avatar?: string;
  }>;
}

export interface NewsletterContent extends BaseBlockContent {
  title: string;
  description: string;
  button_text?: string;
}

export interface StoreBrandsContent extends BaseBlockContent {
  title: string;
  brands: Array<{
    name: string;
    logo: string;
  }>;
}

export interface GameChangerContent extends BaseBlockContent {
  title: string;
  description: string;
  image?: string;
}

export interface SustainabilityContent extends BaseBlockContent {
  title: string;
  description: string;
  stats?: Array<{
    value: string;
    label: string;
  }>;
}

export interface CompetitorComparisonContent extends BaseBlockContent {
  title: string;
  description: string;
  competitors: Array<{
    name: string;
    features: string[];
  }>;
}

export interface BulkOrdersContent extends BaseBlockContent {
  title: string;
  description: string;
  features: string[];
}