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
  | "product_carousel"
  | "blog_preview"
  | "store_brands"
  | "sustainability"
  | "game_changer"
  | "competitor_comparison"
  | "about_hero_section"
  | "about_story"
  | "about_mission"
  | "about_sustainability"
  | "about_team"
  | "about_customer_impact"
  | "about_cta"
  | "contact_hero"
  | "contact_form"
  | "contact_details"
  | "contact_business"
  | "contact_faq";

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: BlockContent;
  order_index: number;
  page_id?: string;
  created_at: string;
  updated_at: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface NewsletterContent {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
}

export interface ProductCarouselContent {
  title?: string;
  subtitle?: string;
  description?: string;
  products?: Array<{
    id: string;
    name: string;
    description: string;
    image: string;
    price: number;
  }>;
}

export interface StoreBrandsContent {
  title?: string;
  subtitle?: string;
  features?: Array<{
    title: string;
    description: string;
    detail?: string;
  }>;
}

export interface SustainabilityContent {
  title?: string;
  description?: string;
  stats?: Array<{
    icon: string;
    value: string;
    label: string;
    description: string;
  }>;
}

export interface TestimonialsContent {
  title?: string;
  testimonials?: Array<{
    name: string;
    rating: number;
    text: string;
    source: string;
  }>;
}

export interface AboutHeroContent extends HeroContent {
  backgroundImage?: string;
}

export interface AboutStoryContent {
  title?: string;
  subtitle?: string;
  content?: string;
  imageUrl?: string;
  videoUrl?: string;
  videoThumbnail?: string;
}

export interface AboutMissionContent {
  title?: string;
  subtitle?: string;
  description?: string;
  mission?: string;
  values?: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
}

export interface AboutSustainabilityContent extends SustainabilityContent {
  backgroundImage?: string;
  stats: Array<{
    icon: string;
    value: string;
    label: string;
    description: string;
  }>;
}

export interface AboutTeamContent {
  title?: string;
  subtitle?: string;
  members: Array<{
    name: string;
    role: string;
    bio?: string;
    imageUrl?: string;
  }>;
}

export interface AboutCustomerImpactContent {
  title?: string;
  subtitle?: string;
  description?: string;
  impact?: string;
  stats?: Array<{
    value: string;
    label: string;
  }>;
  testimonials?: Array<{
    quote: string;
    author: string;
    role: string;
  }>;
}

export interface AboutCtaContent {
  title?: string;
  subtitle?: string;
  description?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  imageUrl?: string;
}

export interface ContactFormContent {
  title?: string;
  description?: string;
  submitButtonText?: string;
}

export interface ContactDetailsContent {
  title?: string;
  subtitle?: string;
  address?: string;
  phone?: string;
  email?: string;
  hours?: string[];
  socialLinks?: Array<{
    platform: string;
    url: string;
  }>;
  contactInfo?: {
    address: string;
    phone: string;
    email: string;
  };
}

export interface ContactBusinessContent {
  title?: string;
  subtitle?: string;
  description?: string;
  email?: string;
  buttonText?: string;
  buttonLink?: string;
  features: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

export interface ContactFAQContent {
  title?: string;
  subtitle?: string;
  description?: string;
  faqs: Array<{
    question: string;
    answer: string;
    category?: string;
  }>;
}

export type BlockContent =
  | HeroContent
  | FeaturesContent
  | TestimonialsContent
  | NewsletterContent
  | ProductCarouselContent
  | StoreBrandsContent
  | SustainabilityContent
  | GameChangerContent
  | CompetitorComparisonContent
  | AboutHeroContent
  | AboutStoryContent
  | AboutMissionContent
  | AboutSustainabilityContent
  | AboutTeamContent
  | AboutCustomerImpactContent
  | AboutCtaContent
  | ContactFormContent
  | ContactDetailsContent
  | ContactBusinessContent
  | ContactFAQContent;