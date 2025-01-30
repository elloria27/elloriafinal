export type BlockType = 
  | "heading"
  | "text"
  | "image"
  | "video"
  | "button"
  | "hero"
  | "features"
  | "testimonials"
  | "newsletter"
  | "product_gallery"
  | "blog_preview"
  | "store_brands"
  | "sustainability"
  | "elevating_essentials"
  | "contact_business"
  | "contact_form"
  | "contact_details"
  | "contact_faq";

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: BlockContent;
  order_index: number;
  page_id: string;
  created_at: string;
  updated_at: string;
}

export type BlockContent =
  | HeroContent
  | FeaturesContent
  | TestimonialsContent
  | NewsletterContent
  | ProductGalleryContent
  | BlogPreviewContent
  | StoreBrandsContent
  | SustainabilityContent
  | ElevatingEssentialsContent
  | ContactBusinessContent
  | ContactFormContent
  | ContactDetailsContent
  | ContactFAQContent;

export interface HeroContent {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  secondaryButtonText?: string;
  imageUrl?: string;
  backgroundUrl?: string;
}

export interface FeatureItem {
  icon?: string;
  title: string;
  description: string;
}

export interface FeaturesContent {
  title?: string;
  subtitle?: string;
  description?: string;
  features: FeatureItem[];
}

export interface TestimonialItem {
  author: string;
  role?: string;
  content: string;
  avatar?: string;
  rating?: number;
}

export interface TestimonialsContent {
  title?: string;
  subtitle?: string;
  testimonials: TestimonialItem[];
}

export interface NewsletterContent {
  title?: string;
  description?: string;
  buttonText?: string;
  imageUrl?: string;
}

export interface ProductItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  category?: string;
}

export interface ProductGalleryContent {
  title?: string;
  subtitle?: string;
  products: ProductItem[];
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt?: string;
  imageUrl?: string;
  author?: string;
  date?: string;
  category?: string;
}

export interface BlogPreviewContent {
  title?: string;
  subtitle?: string;
  posts: BlogPost[];
}

export interface StoreBrandsContent {
  title?: string;
  subtitle?: string;
  description?: string;
  features: {
    title: string;
    description: string;
    detail?: string;
  }[];
}

export interface SustainabilityContent {
  title?: string;
  subtitle?: string;
  description?: string;
  initiatives: {
    title: string;
    description: string;
    icon?: string;
  }[];
}

export interface ElevatingEssentialsContent {
  title?: string;
  subtitle?: string;
  description?: string;
  items: {
    title: string;
    description: string;
    imageUrl?: string;
  }[];
}

export interface ContactBusinessContent {
  title?: string;
  subtitle?: string;
  features: {
    icon: string;
    title: string;
    description: string;
  }[];
}

export interface ContactFormContent {
  title?: string;
  description?: string;
  buttonText?: string;
  secondaryButtonText?: string;
}

export interface ContactDetailsContent {
  title?: string;
  subtitle?: string;
  address?: string;
  phone?: string;
  email?: string;
  hours?: string[];
  socialLinks?: {
    platform: string;
    url: string;
  }[];
}

export interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

export interface ContactFAQContent {
  title?: string;
  subtitle?: string;
  faqs: FAQItem[];
}