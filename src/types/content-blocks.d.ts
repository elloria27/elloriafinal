import { ReactNode } from 'react';

export interface BaseBlockContent {
  title?: string;
  subtitle?: string;
  description?: ReactNode;
}

export interface HeroContent extends BaseBlockContent {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

export interface FeaturesProps {
  features: {
    icon: string;
    title: string;
    description: string;
  }[];
  title: string;
  subtitle: string;
  description?: ReactNode;
}

export interface TestimonialsContent extends BaseBlockContent {
  testimonials: {
    name: string;
    role: string;
    content: string;
    image?: string;
  }[];
}

export interface ProductCarouselContent extends BaseBlockContent {
  title: string;
  subtitle: string;
}

export interface AboutCustomerImpactContent extends BaseBlockContent {
  stats: {
    value: string;
    label: string;
  }[];
  testimonials: {
    name: string;
    role: string;
    content: string;
    image?: string;
  }[];
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

export interface ContactHeroContent extends BaseBlockContent {
  title: string;
  subtitle: string;
}

export interface ContactDetailsContent extends BaseBlockContent {
  address: string;
  phone: string;
  email: string;
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
}

export interface BulkOrdersContent extends BaseBlockContent {
  title: string;
  subtitle: string;
  features: {
    icon: string;
    title: string;
    description: string;
  }[];
}

export interface BulkOrdersProps {
  content: BulkOrdersContent;
}

export interface ContentBlock {
  id: string;
  type: string;
  content: BaseBlockContent;
  page_id: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}