export type BlockType = 
  | 'hero'
  | 'heading'
  | 'text'
  | 'image'
  | 'video'
  | 'button'
  | 'features'
  | 'testimonials'
  | 'newsletter'
  | 'product_gallery'
  | 'blog_preview'
  | 'store_brands'
  | 'about_story'
  | 'about_mission'
  | 'about_hero_section'
  | 'about_sustainability'
  | 'game_changer'
  | 'sustainability'
  | 'product_carousel'
  | 'competitor_comparison';

export interface AboutMissionContent {
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  values?: {
    icon: string;
    title: string;
    description: string;
  }[];
}

export interface HeroContent {
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage?: string;
}

export interface HeadingContent {
  text?: string;
  size?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  alignment?: 'left' | 'center' | 'right';
  title?: string;
}

export interface TextContent {
  text?: string;
  alignment?: 'left' | 'center' | 'right';
}

export interface ImageContent {
  url?: string;
  alt?: string;
  caption?: string;
}

export interface VideoContent {
  url?: string;
  title?: string;
  autoplay?: boolean;
  controls?: boolean;
  videoUrl?: string;
}

export interface ButtonContent {
  text?: string;
  link?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

export interface FeaturesContent {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: {
    icon?: string;
    title: string;
    description: string;
  }[];
}

export interface FeaturesProps {
  content?: FeaturesContent;
}

export interface TestimonialsContent {
  title?: string;
  subtitle?: string;
  description?: string;
  testimonials?: {
    text: string;
    author: string;
    role?: string;
    image?: string;
  }[];
}

export interface NewsletterContent {
  title?: string;
  description?: string;
  buttonText?: string;
  image?: string;
}

export interface ProductGalleryContent {
  title?: string;
  description?: string;
  products?: string[];
}

export interface BlogPreviewContent {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  articles?: {
    title: string;
    category: string;
    image: string;
  }[];
}

export interface StoreBrandsContent {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: {
    title: string;
    description: string;
    detail?: string;
  }[];
  brands?: {
    name: string;
    logo: string;
    link?: string;
  }[];
}

export interface AboutStoryContent {
  title?: string;
  subtitle?: string;
  description?: string;
  videoUrl?: string;
  timeline?: {
    year: string;
    title: string;
    description: string;
  }[];
}

export interface GameChangerContent {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: {
    icon: string;
    title: string;
    description: string;
    detail?: string;
  }[];
}

export interface SustainabilityContent {
  title?: string;
  subtitle?: string;
  description?: string;
  stats?: {
    icon?: string;
    value?: string;
    label?: string;
    description?: string;
  }[];
  timelineItems?: string[];
}

export interface ProductCarouselContent {
  title?: string;
  subtitle?: string;
  description?: string;
  products?: {
    id: string;
    name: string;
    description: string;
    image: string;
    price: number;
  }[];
}

export interface CompetitorComparisonContent {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  metrics?: {
    category: string;
    elloria: number;
    competitors: number;
    icon: string;
    description: string;
  }[];
}

export type BlockContent =
  | HeroContent
  | HeadingContent
  | TextContent
  | ImageContent
  | VideoContent
  | ButtonContent
  | FeaturesContent
  | TestimonialsContent
  | NewsletterContent
  | ProductGalleryContent
  | BlogPreviewContent
  | StoreBrandsContent
  | AboutStoryContent
  | AboutMissionContent
  | GameChangerContent
  | SustainabilityContent
  | ProductCarouselContent
  | CompetitorComparisonContent;

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: BlockContent;
  order_index?: number;
  page_id?: string;
  created_at?: string;
  updated_at?: string;
}