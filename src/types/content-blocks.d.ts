import { Json } from "@/integrations/supabase/types";

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
  description?: string;
  features?: Json[];
  items?: Json[];
  testimonials?: Json[] | Record<string, Json>;
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
  features?: {
    icon: string;
    title: string;
    description: string;
  }[];
}

export interface GameChangerContent extends BlockContent {
  features?: {
    icon: string;
    title: string;
    description: string;
    detail?: string;
  }[];
}

export interface StoreBrandsContent extends BlockContent {
  features?: Json[];
}

export interface SustainabilityContent extends BlockContent {
  stats?: {
    icon: string;
    title: string;
    description: string;
    color: string;
  }[];
  timelineItems?: string[];
}

export interface ProductCarouselContent extends BlockContent {
  products?: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
  }[];
}

export interface CompetitorComparisonContent extends BlockContent {
  metrics?: {
    category: string;
    elloria: number;
    competitors: number;
    icon: string;
    description: string;
  }[];
}

export interface TestimonialsContent extends BlockContent {
  testimonials?: Json[] | Record<string, Json>;
  items?: Json[];
}

export interface BlogPreviewContent extends BlockContent {
  posts?: {
    id: string;
    title: string;
    excerpt: string;
    image: string;
  }[];
}

export interface NewsletterContent extends BlockContent {
  buttonText?: string;
}

export interface AboutHeroContent extends BlockContent {
  image?: string;
}

export interface AboutStoryContent extends BlockContent {
  milestones?: {
    year: string;
    title: string;
    description: string;
  }[];
}

export interface AboutMissionContent extends BlockContent {
  values?: {
    title: string;
    description: string;
    icon: string;
  }[];
}

export interface AboutSustainabilityContent extends BlockContent {
  initiatives?: {
    title: string;
    description: string;
    icon: string;
  }[];
}

export interface AboutTeamContent extends BlockContent {
  team?: {
    name: string;
    role: string;
    image: string;
    bio: string;
  }[];
}

export interface AboutCustomerImpactContent extends BlockContent {
  stories?: {
    name: string;
    story: string;
    image: string;
  }[];
}

export interface AboutCtaContent extends BlockContent {
  buttonText?: string;
  buttonUrl?: string;
}

export interface ContactHeroContent extends BlockContent {}

export interface ContactDetailsContent extends BlockContent {
  locations?: {
    city: string;
    address: string;
    phone: string;
    email: string;
  }[];
}

export interface ContactFormContent extends BlockContent {
  submitText?: string;
}

export interface ContactFAQContent extends BlockContent {
  faqs?: {
    question: string;
    answer: string;
  }[];
}

export interface ContactBusinessContent extends BlockContent {
  services?: {
    title: string;
    description: string;
    icon: string;
  }[];
}