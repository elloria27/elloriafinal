import { BaseBlockContent } from "./basic";

export interface ContactHeroContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
}

export interface ContactDetailsContent extends BaseBlockContent {
  address?: string;
  phone?: string;
  email?: string;
}

export interface ContactFormContent extends BaseBlockContent {
  title?: string;
  description?: string;
  buttonText?: string;
  secondaryButtonText?: string;
}

export interface ContactFAQContent extends BaseBlockContent {
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}

export interface ContactBusinessContent extends BaseBlockContent {
  title?: string;
  description?: string;
  email?: string;
  buttonText?: string;
  buttonLink?: string;
}

export interface AboutHeroContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  buttonText?: string;
  buttonLink?: string;
}

export interface AboutStoryContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  content?: string;
  videoUrl?: string;
  videoThumbnail?: string;
}

export interface AboutMissionContent extends BaseBlockContent {
  title?: string;
  description?: string;
  values?: Array<{
    icon: 'Leaf' | 'Star' | 'Heart';
    title: string;
    description: string;
  }>;
}

export interface AboutSustainabilityContent extends BaseBlockContent {
  title?: string;
  description?: string;
  stats?: Array<{
    icon: 'Leaf' | 'Recycle' | 'TreePine';
    value: string;
    label: string;
    description: string;
  }>;
}

export interface AboutTeamContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  members?: Array<{
    name: string;
    role: string;
    image?: string;
    quote?: string;
    bio?: string;
  }>;
}

export interface AboutCustomerImpactContent extends BaseBlockContent {
  title?: string;
  description?: string;
  stats?: Array<{
    value: string;
    label: string;
  }>;
  testimonials?: Array<{
    quote: string;
    author: string;
    role?: string;
    rating: number;
  }>;
}

export interface AboutCtaContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  backgroundGradient?: string;
}