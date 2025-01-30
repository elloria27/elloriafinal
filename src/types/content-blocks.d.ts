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
  | "elevating_essentials"
  | "game_changer"
  | "competitor_comparison"
  | "contact_hero"
  | "contact_business"
  | "contact_form"
  | "contact_details"
  | "contact_faq"
  | "about_hero_section"
  | "about_story"
  | "about_mission"
  | "about_sustainability"
  | "about_team"
  | "about_customer_impact"
  | "about_cta";

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: BlockContent;
  order_index: number;
  page_id?: string;
  created_at: string;
  updated_at: string;
}

export type BlockContent =
  | HeroContent
  | FeaturesContent
  | TestimonialsContent
  | NewsletterContent
  | ProductGalleryContent
  | ProductCarouselContent
  | BlogPreviewContent
  | StoreBrandsContent
  | SustainabilityContent
  | GameChangerContent
  | CompetitorComparisonContent
  | ContactHeroContent
  | ContactBusinessContent
  | ContactFormContent
  | ContactDetailsContent
  | ContactFAQContent
  | AboutHeroContent
  | AboutStoryContent
  | AboutMissionContent
  | AboutSustainabilityContent
  | AboutTeamContent
  | AboutCustomerImpactContent
  | AboutCtaContent;

export interface HeroContent {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  secondaryButtonText?: string;
  imageUrl?: string;
  videoUrl?: string;
  backgroundUrl?: string;
}

export interface FeaturesContent {
  title?: string;
  subtitle?: string;
  description?: string;
  features: {
    icon: string;
    title: string;
    description: string;
  }[];
}

export interface GameChangerContent {
  title?: string;
  subtitle?: string;
  description?: string;
  features: {
    icon: string;
    title: string;
    description: string;
    detail?: string;
  }[];
}

export interface ProductCarouselContent {
  title?: string;
  subtitle?: string;
  products: {
    id: string;
    name: string;
    description?: string;
    imageUrl: string;
    price: number;
  }[];
}

export interface CompetitorComparisonContent {
  title?: string;
  subtitle?: string;
  metrics: {
    category: string;
    elloria: number;
    competitors: number;
    icon: string;
    description: string;
  }[];
  buttonText?: string;
  buttonUrl?: string;
}

export interface BlogPreviewContent {
  title?: string;
  subtitle?: string;
  articles: {
    title: string;
    category: string;
    image: string;
  }[];
}

export interface ContactHeroContent {
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
}

export interface ContactBusinessContent {
  title?: string;
  subtitle?: string;
  description?: string;
  email?: string;
  buttonText?: string;
  buttonLink?: string;
  features: {
    icon: string;
    title: string;
    description: string;
  }[];
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
  contactInfo?: {
    address: string;
    phone: string;
    email: string;
  };
}

export interface ContactFAQContent {
  title?: string;
  subtitle?: string;
  description?: string;
  faqs: {
    question: string;
    answer: string;
    category?: string;
  }[];
}

export interface AboutHeroContent extends HeroContent {
  backgroundImage?: string;
}

export interface AboutStoryContent {
  title?: string;
  subtitle?: string;
  content?: string;
  imageUrl?: string;
}

export interface AboutMissionContent {
  title?: string;
  subtitle?: string;
  mission?: string;
  values?: {
    title: string;
    description: string;
    icon?: string;
  }[];
}

export interface AboutSustainabilityContent extends SustainabilityContent {
  backgroundImage?: string;
}

export interface AboutTeamContent {
  title?: string;
  subtitle?: string;
  members: {
    name: string;
    role: string;
    bio?: string;
    imageUrl?: string;
  }[];
}

export interface AboutCustomerImpactContent {
  title?: string;
  subtitle?: string;
  impact?: string;
  statistics?: {
    value: string;
    label: string;
  }[];
}

export interface AboutCtaContent {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  imageUrl?: string;
}

export interface FeaturesProps {
  content?: FeaturesContent;
}