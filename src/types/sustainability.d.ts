export type SustainabilitySectionType = 
  | 'sustainability_hero'
  | 'sustainability_mission'
  | 'sustainability_materials'
  | 'sustainability_faq'
  | 'sustainability_cta';

export interface SustainabilitySection {
  id: string;
  page_id: string;
  section_type: SustainabilitySectionType;
  content: SustainabilityHeroContent | SustainabilityMissionContent | SustainabilityMaterialsContent | SustainabilityFAQContent | SustainabilityCTAContent;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export interface SustainabilityHeroContent {
  title: string;
  description: string;
  background_image: string;
}

export interface SustainabilityMissionContent {
  title: string;
  description: string;
  stats: Array<{
    icon: 'Leaf' | 'PackageCheck' | 'Globe';
    value: string;
    label: string;
    description: string;
  }>;
}

export interface SustainabilityMaterialsContent {
  title: string;
  description: string;
  materials: Array<{
    icon: 'TreePine' | 'Recycle' | 'Factory';
    title: string;
    description: string;
  }>;
}

export interface SustainabilityFAQContent {
  title: string;
  description: string;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export interface SustainabilityCTAContent {
  title: string;
  description: string;
  button_text: string;
  button_link: string;
}