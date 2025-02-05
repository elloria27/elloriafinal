import { Json } from "@/integrations/supabase/types";

export interface BaseBlockContent {
  [key: string]: string | number | boolean | null | Json;
}

export interface HeadingBlockContent extends BaseBlockContent {
  text?: string;
  size?: 'h1' | 'h2' | 'h3' | 'h4';
}

export interface TextBlockContent extends BaseBlockContent {
  text?: string;
}

export interface ImageBlockContent extends BaseBlockContent {
  url?: string;
  alt?: string;
}

export interface VideoBlockContent extends BaseBlockContent {
  url?: string;
  title?: string;
}

export interface ButtonBlockContent extends BaseBlockContent {
  text?: string;
  url?: string;
  variant?: 'default' | 'outline' | 'ghost';
}

export interface HeroContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  videoUrl?: string;
  videoPoster?: string;
  shopNowText?: string;
  learnMoreText?: string;
}

export interface FeaturesContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: FeatureItem[];
}

export interface GameChangerContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: FeatureItem[];
}

export interface StoreBrandsContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  brands?: {
    name: string;
    logo: string;
    link: string;
  }[];
}

export interface SustainabilityContent extends BaseBlockContent {
  title?: string;
  description?: string;
  backgroundImage?: string;
  stats?: Array<{
    icon: string;
    value: string;
    label: string;
    description: string;
  }>;
  materials?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  buttonText?: string;
  buttonLink?: string;
  timelineItems?: string[];
}

export interface TestimonialsContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  testimonials?: Array<{
    name: string;
    rating: number;
    text: string;
    source: string;
  }>;
}

export interface BlogPreviewContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  articles?: {
    title: string;
    category: string;
    image: string;
  }[];
}

export interface NewsletterContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

export interface ProductCarouselContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  description?: string;
}

export interface CompetitorComparisonContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  metrics?: {
    category: string;
    elloria: number;
    competitors: number;
    icon: string;
    description: string;
  }[];
  buttonText?: string;
  buttonUrl?: string;
}

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

export interface CustomSolutionsHeroContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
}

export interface CustomSolutionsServicesContent extends BaseBlockContent {
  title?: string;
  description?: string;
  services?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

export interface CustomSolutionsProcessContent extends BaseBlockContent {
  title?: string;
  description?: string;
  steps?: Array<{
    title: string;
    description: string;
  }>;
}

export interface CustomSolutionsCtaContent extends BaseBlockContent {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}

export interface ForBusinessHeroContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
}

export interface BusinessSolutionsContent extends BaseBlockContent {
  title?: string;
  description?: string;
  solutions?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

export interface BusinessContactContent extends BaseBlockContent {
  title?: string;
  description?: string;
  email?: string;
  phone?: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
  detail?: string;
}

export interface FeaturesProps {
  content?: FeaturesContent;
}

export interface HeroProps {
  content?: HeroContent;
}

export interface MediaLibraryModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  type?: 'image' | 'video';
}

export type BlockContent = 
  | HeadingBlockContent 
  | TextBlockContent 
  | ImageBlockContent 
  | VideoBlockContent
  | ButtonBlockContent
  | HeroContent
  | FeaturesContent
  | GameChangerContent
  | StoreBrandsContent
  | SustainabilityContent
  | TestimonialsContent
  | BlogPreviewContent
  | NewsletterContent
  | ProductCarouselContent
  | CompetitorComparisonContent
  | ContactHeroContent
  | ContactDetailsContent
  | ContactFormContent
  | ContactFAQContent
  | ContactBusinessContent
  | AboutHeroContent
  | AboutStoryContent
  | AboutMissionContent
  | AboutSustainabilityContent
  | AboutTeamContent
  | AboutCustomerImpactContent
  | AboutCtaContent
  | CustomSolutionsHeroContent
  | CustomSolutionsServicesContent
  | CustomSolutionsProcessContent
  | CustomSolutionsCtaContent
  | ForBusinessHeroContent
  | BusinessSolutionsContent
  | BusinessContactContent;

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
  | "blog_preview" 
  | "store_brands"
  | "sustainability"
  | "product_carousel"
  | "product_gallery"
  | "elevating_essentials"
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
  | "contact_details"
  | "contact_form"
  | "contact_faq"
  | "contact_business"
  | "business_hero"
  | "business_solutions"
  | "business_contact"
  | "custom_solutions_hero"
  | "custom_solutions_services"
  | "custom_solutions_process"
  | "custom_solutions_cta"
  | "sustainability_hero"
  | "sustainability_mission"
  | "sustainability_materials"
  | "sustainability_faq"
  | "sustainability_cta";

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: BlockContent;
  order_index: number;
  page_id?: string;
  created_at?: string;
  updated_at?: string;
}