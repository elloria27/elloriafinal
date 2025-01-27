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
  | 'about_mission';

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
}

export interface HeadingContent {
  text?: string;
  size?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  alignment?: 'left' | 'center' | 'right';
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
}

export interface ButtonContent {
  text?: string;
  link?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
}

export interface FeaturesContent {
  title?: string;
  description?: string;
  features?: {
    icon?: string;
    title: string;
    description: string;
  }[];
}

export interface TestimonialsContent {
  title?: string;
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
  description?: string;
  posts?: string[];
}

export interface StoreBrandsContent {
  title?: string;
  description?: string;
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
  | AboutMissionContent;

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: BlockContent;
  order_index?: number;
  page_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SustainabilityContent {
  title?: string;
  description?: string;
  stats?: {
    icon?: string;
    value?: string;
    description?: string;
  }[];
  timelineItems?: string[];
}