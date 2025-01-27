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

// Base interface for all content types to ensure JSON compatibility
interface BaseContent {
  [key: string]: any;
}

export interface AboutMissionContent extends BaseContent {
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

export interface HeroContent extends BaseContent {
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage?: string;
}

export interface HeadingContent extends BaseContent {
  text?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  size?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  alignment?: 'left' | 'center' | 'right';
}

export interface TextContent extends BaseContent {
  text?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  alignment?: 'left' | 'center' | 'right';
}

export interface ImageContent extends BaseContent {
  url?: string;
  alt?: string;
  caption?: string;
}

export interface VideoContent extends BaseContent {
  url?: string;
  title?: string;
  autoplay?: boolean;
  controls?: boolean;
  videoUrl?: string;
}

export interface ButtonContent extends BaseContent {
  text?: string;
  link?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  buttonText?: string;
  buttonUrl?: string;
}

export interface FeaturesContent extends BaseContent {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  backgroundImage?: string;
  features?: {
    icon?: string;
    title: string;
    description: string;
  }[];
}

export interface FeaturesProps {
  content?: FeaturesContent;
}

export interface TestimonialsContent extends BaseContent {
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

export interface NewsletterContent extends BaseContent {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  image?: string;
}

export interface ProductGalleryContent extends BaseContent {
  title?: string;
  subtitle?: string;
  description?: string;
  products?: string[];
}

export interface BlogPreviewContent extends BaseContent {
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

export interface StoreBrandsContent extends BaseContent {
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

export interface AboutStoryContent extends BaseContent {
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

export interface GameChangerContent extends BaseContent {
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

export interface SustainabilityContent extends BaseContent {
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

export interface ProductCarouselContent extends BaseContent {
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

export interface CompetitorComparisonContent extends BaseContent {
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