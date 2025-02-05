export type BlockType =
  | "heading"
  | "text"
  | "image"
  | "video"
  | "button"
  | "hero"
  | "features"
  | "game_changer"
  | "store_brands"
  | "sustainability"
  | "testimonials"
  | "blog_preview"
  | "product_carousel"
  | "competitor_comparison"
  | "newsletter"
  | "product_gallery"
  | "about_hero_section"
  | "about_story"
  | "about_mission"
  | "about_sustainability"
  | "about_team"
  | "about_customer_impact"
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
  | "sustainability_cta"
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
  page_id: string;
  created_at?: string;
  updated_at?: string;
}

export type BlockContent = Record<string, any>;

export interface FeaturesProps {
  content?: FeaturesContent;
}

export interface FeaturesContent {
  title?: string;
  subtitle?: string;
  features?: FeatureItem[];
}

export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
}

export interface HeroContent {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  buttonText?: string;
  buttonLink?: string;
}

export interface BlogPreviewContent {
  title?: string;
  subtitle?: string;
  buttonText?: string;
}

export interface CompetitorComparisonContent {
  title?: string;
  subtitle?: string;
  metrics?: Array<{
    category: string;
    elloria: number;
    competitors: number;
    icon: string;
    description: string;
  }>;
  buttonText?: string;
  buttonUrl?: string;
}

export interface GameChangerContent {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: Array<{
    icon: string;
    title: string;
    description: string;
    detail: string;
  }>;
}

export interface NewsletterContent {
  title?: string;
  description?: string;
  buttonText?: string;
}

export interface ProductCarouselContent {
  title?: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
}

export interface StoreBrandsContent {
  title?: string;
  subtitle?: string;
  features?: any[];
}

export interface SustainabilityContent {
  title?: string;
  description?: string;
  stats?: Array<{
    icon: string;
    title: string;
    description: string;
    color: string;
  }>;
}

export interface TestimonialsContent {
  title?: string;
  testimonials?: any[];
  items?: any[];
}

export interface AboutHeroContent {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
}

export interface AboutStoryContent {
  title?: string;
  subtitle?: string;
  content?: string;
  videoUrl?: string;
  videoThumbnail?: string;
}

export interface AboutMissionContent {
  title?: string;
  description?: string;
  values?: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

export interface AboutSustainabilityContent {
  title?: string;
  description?: string;
  stats?: Array<{
    icon: string;
    value: string;
    label: string;
    description: string;
  }>;
}

export interface AboutTeamContent {
  title?: string;
  subtitle?: string;
  members?: Array<{
    name: string;
    role: string;
    image: string;
    quote: string;
  }>;
}

export interface AboutCustomerImpactContent {
  title?: string;
  description?: string;
  stats?: Array<{
    value: string;
    label: string;
  }>;
  testimonials?: Array<{
    quote: string;
    author: string;
    role: string;
    rating: number;
  }>;
}

export interface ContactHeroContent {
  title?: string;
  subtitle?: string;
}

export interface ContactDetailsContent {
  address?: string;
  phone?: string;
  email?: string;
}

export interface ContactFormContent {
  description?: string;
  buttonText?: string;
  secondaryButtonText?: string;
}

export interface ContactFAQContent {
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}

export interface ContactBusinessContent {
  title?: string;
  description?: string;
  email?: string;
  buttonText?: string;
  buttonLink?: string;
}

export interface DonationHeroContent {
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  donationLink?: string;
}

export interface DonationFormContent {
  title?: string;
  description?: string;
  amounts?: number[];
  customAmount?: boolean;
  recurring?: boolean;
}

export interface DonationImpactContent {
  title?: string;
  description?: string;
  impacts?: Array<{
    amount: number;
    description: string;
    icon?: string;
  }>;
}

export interface DonationFAQContent {
  title?: string;
  description?: string;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}

export interface DonationJoinMovementContent {
  title?: string;
  description?: string;
  image?: string;
  link?: string;
  buttonText?: string;
}

export interface DonationPartnersContent {
  title?: string;
  description?: string;
  partners?: Array<{
    name: string;
    logo: string;
    description?: string;
  }>;
}

export interface DonationStoriesContent {
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