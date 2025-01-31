import { Json } from "@/integrations/supabase/types";
import { ReactNode } from "react";

// Base types
export interface BlockContent {
  [key: string]: ReactNode | string | number | boolean | Json | null;
}

export type BlockType = 
  | "hero"
  | "features"
  | "game_changer"
  | "store_brands"
  | "sustainability"
  | "product_carousel"
  | "competitor_comparison"
  | "testimonials"
  | "blog_preview"
  | "newsletter"
  | "heading"
  | "text"
  | "image"
  | "video"
  | "button"
  | "about_hero_section"
  | "about_story"
  | "about_mission"
  | "about_team"
  | "about_customer_impact"
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
  | "business_contact";

export interface ContentBlock {
  id: string;
  page_id?: string;
  type: BlockType;
  content: BlockContent;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

// Newsletter section
export interface NewsletterContent extends BlockContent {
  title?: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
}

// Sustainability section
export interface SustainabilityContent extends BlockContent {
  title?: ReactNode;
  description?: ReactNode;
  stats?: {
    icon: string;
    title: string;
    description: string;
    color: string;
  }[];
  timelineItems?: string[];
}

// Contact sections
export interface ContactHeroContent extends BlockContent {
  title?: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
}

export interface ContactDetailsContent extends BlockContent {
  title?: ReactNode;
  details: {
    icon: string;
    label: string;
    value: string;
  }[];
}

export interface ContactFormContent extends BlockContent {
  title?: ReactNode;
  description?: ReactNode;
}

export interface ContactFAQContent extends BlockContent {
  title?: ReactNode;
  subtitle?: ReactNode;
  faqs?: {
    question: string;
    answer: string;
  }[];
}

export interface ContactBusinessContent extends BlockContent {
  title?: ReactNode;
  subtitle?: ReactNode;
  description?: ReactNode;
  buttonText?: ReactNode;
  buttonUrl?: string;
}
