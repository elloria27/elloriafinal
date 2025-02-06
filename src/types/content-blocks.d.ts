import { Json } from "@/integrations/supabase/types";
import { ReactNode } from "react";

export interface BaseBlockContent {
  [key: string]: string | number | boolean | null | Json;
}

export interface ContentBlock {
  id: string;
  type: string;
  content: BlockContent;
  page_id: string;
  order_index: number;
}

export interface BlockContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  description?: string | ReactNode;
  features?: Array<{
    icon: string;
    title: string;
    description: string;
    detail?: string;
  }>;
  items?: Array<any>;
  testimonials?: Array<{
    quote: string;
    author: string;
    role: string;
    rating: number;
  }>;
  buttonText?: string;
  buttonUrl?: string;
}

export interface HeroContent extends BlockContent {
  title?: string;
  subtitle?: string;
  videoUrl?: string;
  videoPoster?: string | boolean;
  shopNowText?: string;
  learnMoreText?: string;
}

export interface FeaturesProps {
  content?: FeaturesContent;
}

export interface FeaturesContent extends BlockContent {
  features?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

export interface GameChangerContent extends BlockContent {
  features?: Array<{
    icon: string;
    title: string;
    description: string;
    detail?: string;
  }>;
}

export interface StoreBrandsContent extends BlockContent {
  features?: Array<{
    name: string;
    logo: string;
    link: string;
  }>;
}

export interface SustainabilityContent extends BlockContent {
  stats?: Array<{
    icon: string;
    title: string;
    description: string;
    color: string;
  }>;
  timelineItems?: string[];
}

export interface ProductCarouselContent extends BlockContent {
  products?: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
  }>;
}

export interface CompetitorComparisonContent extends BlockContent {
  metrics?: Array<{
    category: string;
    elloria: number;
    competitors: number;
    icon: string;
    description: string;
  }>;
}

export interface TestimonialsContent extends BlockContent {
  testimonials?: Array<{
    quote: string;
    author: string;
    role: string;
    rating: number;
  }>;
}

export interface BlogPreviewContent extends BlockContent {
  posts?: Array<{
    id: string;
    title: string;
    excerpt: string;
    image: string;
  }>;
}

export interface NewsletterContent extends BlockContent {
  buttonText?: string;
}

export interface AboutHeroContent extends BlockContent {
  image?: string;
}

export interface AboutStoryContent extends BlockContent {
  milestones?: Array<{
    year: string;
    title: string;
    description: string;
  }>;
  videoUrl?: string;
}

export interface AboutMissionContent extends BlockContent {
  values?: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
}

export interface AboutSustainabilityContent extends BlockContent {
  initiatives?: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
}

export interface AboutTeamContent extends BlockContent {
  team?: Array<{
    name: string;
    role: string;
    image: string;
    bio: string;
  }>;
}

export interface AboutCustomerImpactContent extends BlockContent {
  stories?: Array<{
    name: string;
    story: string;
    image: string;
  }>;
}

export interface AboutCtaContent extends BlockContent {
  buttonText?: string;
  buttonUrl?: string;
}

export interface ContactHeroContent extends BlockContent {
  title?: string;
  subtitle?: string;
}

export interface ContactDetailsContent extends BlockContent {
  locations?: Array<{
    city: string;
    address: string;
    phone: string;
    email: string;
  }>;
}

export interface ContactFormContent extends BlockContent {
  submitText?: string;
}

export interface ContactFAQContent extends BlockContent {
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}

export interface ContactBusinessContent extends BlockContent {
  services?: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
}