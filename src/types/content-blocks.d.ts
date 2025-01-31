// Base types
export interface BlockContent {
  [key: string]: string | number | boolean | string[] | object | null;
}

export interface ContentBlock {
  id: string;
  page_id?: string;
  type: string;
  content: BlockContent;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

// Hero section
export interface HeroContent extends BlockContent {
  title?: string;
  subtitle?: string;
  videoUrl?: string;
}

// Features section
export interface FeaturesProps {
  content: FeaturesContent;
}

export interface FeaturesContent extends BlockContent {
  title?: string;
  features?: Feature[];
}

export interface Feature {
  icon?: string;
  title?: string;
  description?: string;
}

// Game Changer section
export interface GameChangerContent extends BlockContent {
  title?: string;
  image?: string;
}

// Store Brands section
export interface StoreBrandsContent extends BlockContent {
  title?: string;
  image?: string;
}

// Sustainability section
export interface SustainabilityContent extends BlockContent {
  title?: string;
  image?: string;
}

// Product Carousel section
export interface ProductCarouselContent extends BlockContent {
  title?: string;
  image?: string;
}

// Testimonials section
export interface TestimonialsContent extends BlockContent {
  title?: string;
  image?: string;
}

// Blog Preview section
export interface BlogPreviewContent extends BlockContent {
  title?: string;
  image?: string;
}

// Newsletter section
export interface NewsletterContent extends BlockContent {
  title?: string;
  image?: string;
}

// About page specific blocks
export interface AboutHeroContent extends BlockContent {
  title?: string;
  subtitle?: string;
  image?: string;
}

export interface AboutStoryContent extends BlockContent {
  title?: string;
  content?: string;
  image?: string;
}

export interface AboutValuesContent extends BlockContent {
  title?: string;
  values?: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
}

export interface AboutTeamContent extends BlockContent {
  title?: string;
  team_members?: Array<{
    name: string;
    role: string;
    image?: string;
    bio?: string;
  }>;
}

// Contact page specific blocks
export interface ContactHeroContent extends BlockContent {
  title?: string;
  subtitle?: string;
  image?: string;
}

export interface ContactFormContent extends BlockContent {
  title?: string;
  description?: string;
}

export interface ContactDetailsContent extends BlockContent {
  title?: string;
  details: Array<{
    icon: string;
    label: string;
    value: string;
  }>;
}

// Sustainability Program specific blocks
export interface SustainabilityProgramHeroContent extends BlockContent {
  title?: string;
  subtitle?: string;
  description?: string;
}

export interface SustainabilityProgramBenefitsContent extends BlockContent {
  title?: string;
  benefits: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

export interface SustainabilityProgramStepsContent extends BlockContent {
  title?: string;
  steps: Array<{
    number: number;
    title: string;
    description: string;
  }>;
}

export interface SustainabilityProgramCtaContent extends BlockContent {
  title?: string;
  description?: string;
  buttonText?: string;
}