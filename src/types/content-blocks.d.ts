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

export interface DonationHeroContent {
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  cta?: {
    text: string;
    link: string;
  };
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
  impacts?: {
    amount: number;
    description: string;
    icon?: string;
  }[];
}

export interface DonationFAQContent {
  title?: string;
  description?: string;
  faqs?: {
    question: string;
    answer: string;
  }[];
}

export interface DonationJoinMovementContent {
  title?: string;
  description?: string;
  image?: string;
  cta?: {
    text: string;
    link: string;
  };
}

export interface DonationPartnersContent {
  title?: string;
  description?: string;
  partners?: {
    name: string;
    logo: string;
    description?: string;
  }[];
}

export interface DonationStoriesContent {
  title?: string;
  description?: string;
  stories?: {
    title: string;
    description: string;
    image?: string;
    author?: string;
    date?: string;
  }[];
}