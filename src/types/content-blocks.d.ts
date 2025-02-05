import { Json } from "@/integrations/supabase/types";

export interface BaseBlockContent {
  [key: string]: string | number | boolean | null | Json;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
  detail?: string;
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
  testimonials?: {
    name: string;
    rating: number;
    text: string;
    source: string;
  }[];
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
    bio?: string;  // Added bio field
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

export interface ForBusinessHeroContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
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
  buttonText?: string;
  buttonLink?: string;
}

export interface CustomSolutionsHeroContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  description?: string;
}

export interface CustomSolutionsServicesContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  services?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

export interface CustomSolutionsProcessContent extends BaseBlockContent {
  title?: string;
  steps?: Array<{
    number: number;
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

export interface DonationHeroContent extends BaseBlockContent {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
}

export interface DonationFormContent extends BaseBlockContent {
  fixedAmounts?: number[];
  buttonText?: string;
  successMessage?: string;
  errorMessage?: string;
}

export interface DonationImpactContent extends BaseBlockContent {
  title?: string;
  description?: string;
  impacts?: Array<{
    icon: string;
    title: string;
    description: string;
    value?: string;
  }>;
}

export interface DonationFAQContent extends BaseBlockContent {
  title?: string;
  description?: string;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}

export interface DonationJoinMovementContent extends BaseBlockContent {
  title?: string;
  description?: string;
  buttonText?: string;
}

export interface DonationPartnersContent extends BaseBlockContent {
  title?: string;
  description?: string;
  partners?: Array<{
    name: string;
    logo: string;
    description?: string;
  }>;
}

export interface DonationStoriesContent extends BaseBlockContent {
  title?: string;
  description?: string;
  stories?: Array<{
    title: string;
    description: string;
    image?: string;
    author?: string;
    date?: string;
  }>;
}

export interface DonationHeroProps {
  content: DonationHeroContent;
}

export interface DonationFormProps {
  content: DonationFormContent;
}

export interface DonationImpactProps {
  content: DonationImpactContent;
}

export interface DonationFAQProps {
  content: DonationFAQContent;
}

export interface DonationJoinMovementProps {
  content: DonationJoinMovementContent;
}

export interface DonationPartnersProps {
  content: DonationPartnersContent;
}

export interface DonationStoriesProps {
  content: DonationStoriesContent;
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
  | DonationHeroContent
  | DonationFormContent
  | DonationImpactContent
  | DonationFAQContent
  | DonationJoinMovementContent
  | DonationPartnersContent
  | DonationStoriesContent;

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
  | "game_changer"
  | "competitor_comparison"
  | "donation_hero"
  | "donation_form"
  | "donation_impact"
  | "donation_faq"
  | "donation_join_movement"
  | "donation_partners"
  | "donation_stories";

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: BlockContent;
  order_index: number;
  page_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FeaturesProps {
  content?: FeaturesContent;
}

export interface HeroProps {
  content?: HeroContent;
}

export interface PaymentMethod {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  processing_fee: number;
  icon_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface DeliveryMethod {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  base_price: number;
  estimated_days?: string;
  regions?: string[];
  created_at?: string;
  updated_at?: string;
}
