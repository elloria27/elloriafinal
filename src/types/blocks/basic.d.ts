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
  | "sustainability_cta"
  | "donation_hero";

export interface ContentBlock {
  id: string;
  type: BlockType;
  content: BlockContent;
  order_index: number;
  page_id?: string;
  created_at?: string;
  updated_at?: string;
}