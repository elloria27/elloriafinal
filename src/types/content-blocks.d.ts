import { Json } from "@/integrations/supabase/types";
import { ReactNode } from "react";

export type BlockType = 
  | "hero"
  | "features" 
  | "game_changer"
  | "store_brands"
  | "sustainability"
  | "product_carousel"
  | "testimonials"
  | "blog_preview"
  | "newsletter"
  | "heading"
  | "text"
  | "image"
  | "video"
  | "button"
  | "product_gallery"
  | "about_hero_section"
  | "about_story"
  | "about_mission"
  | "about_sustainability"
  | "about_team"
  | "about_customer_impact"
  | "competitor_comparison"
  | "contact_hero"
  | "contact_details"
  | "contact_form"
  | "contact_faq"
  | "contact_business"
  | "custom_solutions_hero"
  | "custom_solutions_services"
  | "custom_solutions_process"
  | "custom_solutions_cta"
  | "business_hero"
  | "business_solutions"
  | "business_contact"
  | "elevating_essentials";

export interface BaseContent {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
  detail?: string;
}

export interface BlockContent extends BaseContent {
  features?: FeatureItem[];
  text?: string;
  level?: string;
  url?: string;
  alt?: string;
  variant?: string;
  items?: Json[];
  count?: number;
  [key: string]: Json | undefined;
}

export interface ContentBlock {
  id: string;
  page_id?: string | null;
  type: BlockType;
  content: BlockContent;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export interface FeaturesProps {
  content?: FeaturesContent;
}

export interface FeaturesContent extends BlockContent {
  features: FeatureItem[];
}

export interface GameChangerContent extends BlockContent {
  features: FeatureItem[];
}

export interface StoreBrandsContent extends BlockContent {
  features: FeatureItem[];
}

export interface SustainabilityStat {
  value: string;
  label: string;
  description: string;
}

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

export interface SustainabilityContent extends BlockContent {
  stats: SustainabilityStat[];
  timelineItems: TimelineItem[];
}

export interface ProductCarouselContent extends BlockContent {
  products: Json[];
}

export interface TestimonialItem {
  name: string;
  role?: string;
  comment: string;
  rating: number;
  source?: string;
}

export interface TestimonialsContent extends BlockContent {
  items: TestimonialItem[];
}

export interface BlogPost {
  id: string;
  title: string;
  category?: string;
  featured_image: string;
}

export interface BlogPreviewContent extends BlockContent {
  viewAllButtonText?: string;
  articles?: BlogPost[];
}

export interface NewsletterContent extends BlockContent {
  buttonText?: string;
}

export interface HeroContent extends BlockContent {
  videoUrl?: string;
  videoPoster?: string;
  backgroundImage?: string;
  shopNowText?: string;
  learnMoreText?: string;
}

export interface AboutHeroContent extends HeroContent {}

export interface AboutStoryContent extends BlockContent {
  content?: string;
  videoUrl?: string;
  videoThumbnail?: string;
}

export interface AboutMissionContent extends BlockContent {
  values: FeatureItem[];
}

export interface AboutSustainabilityContent extends SustainabilityContent {}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
  quote: string;
}

export interface AboutTeamContent extends BlockContent {
  members: TeamMember[];
}

export interface CustomerImpactStat {
  value: string;
  label: string;
}

export interface CustomerTestimonial {
  quote: string;
  author: string;
  role: string;
  rating: number;
}

export interface AboutCustomerImpactContent extends BlockContent {
  stats: CustomerImpactStat[];
  testimonials: CustomerTestimonial[];
}

export interface AboutCtaContent extends BlockContent {
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

export interface ComparisonMetric {
  category: string;
  elloria: number;
  competitors: number;
  icon: string;
  description: string;
}

export interface CompetitorComparisonContent extends BlockContent {
  metrics: ComparisonMetric[];
  buttonText?: string;
  buttonUrl?: string;
}

export interface ContactHeroContent extends BlockContent {}
export interface ContactDetailsContent extends BlockContent {
  address?: string;
  phone?: string;
  email?: string;
}
export interface ContactFormContent extends BlockContent {
  buttonText?: string;
  secondaryButtonText?: string;
}
export interface ContactFAQContent extends BlockContent {
  faqs: { question: string; answer: string; }[];
}
export interface ContactBusinessContent extends BlockContent {
  buttonText?: string;
  buttonLink?: string;
}

export interface CustomSolutionsHeroContent extends BlockContent {}
export interface CustomSolutionsServicesContent extends BlockContent {
  services: FeatureItem[];
}
export interface CustomSolutionsProcessContent extends BlockContent {
  steps: { number: number; title: string; description: string; }[];
}
export interface CustomSolutionsCtaContent extends BlockContent {}

export interface ForBusinessHeroContent extends BlockContent {
  buttonText?: string;
  buttonLink?: string;
}
export interface BusinessSolutionsContent extends BlockContent {
  solutions: FeatureItem[];
}
export interface BusinessContactContent extends BlockContent {
  buttonText?: string;
  buttonLink?: string;
}