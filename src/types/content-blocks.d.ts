import { BlockType, ContentBlock, BaseBlockContent, HeadingBlockContent, TextBlockContent, ImageBlockContent, VideoBlockContent, ButtonBlockContent } from './blocks/basic';
import { HeroContent, FeaturesContent, GameChangerContent, StoreBrandsContent, SustainabilityContent, TestimonialsContent, BlogPreviewContent, NewsletterContent, ProductCarouselContent, CompetitorComparisonContent } from './blocks/content';
import { ContactHeroContent, ContactDetailsContent, ContactFormContent, ContactFAQContent, ContactBusinessContent, AboutHeroContent, AboutStoryContent, AboutMissionContent, AboutSustainabilityContent, AboutTeamContent, AboutCustomerImpactContent, AboutCtaContent } from './blocks/sections';
import { ForBusinessHeroContent, BusinessSolutionsContent, BusinessContactContent, CustomSolutionsHeroContent, CustomSolutionsServicesContent, CustomSolutionsProcessContent, CustomSolutionsCtaContent } from './blocks/business';

// Feature and Testimonial interfaces
export interface FeatureItem {
  icon: string;
  title: string;
  description: string;
  detail?: string;
}

export interface TestimonialItem {
  name: string;
  rating: number;
  text: string;
  source: string;
}

// Props interfaces
export interface FeaturesProps {
  content?: FeaturesContent;
}

export interface StoreBrandsProps {
  content?: StoreBrandsContent;
}

export interface TestimonialsProps {
  content?: TestimonialsContent;
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
  | ForBusinessHeroContent
  | BusinessSolutionsContent
  | BusinessContactContent
  | CustomSolutionsHeroContent
  | CustomSolutionsServicesContent
  | CustomSolutionsProcessContent
  | CustomSolutionsCtaContent;

export {
  BlockType,
  ContentBlock,
  BaseBlockContent,
  HeadingBlockContent,
  TextBlockContent,
  ImageBlockContent,
  VideoBlockContent,
  ButtonBlockContent,
  HeroContent,
  FeaturesContent,
  GameChangerContent,
  StoreBrandsContent,
  SustainabilityContent,
  TestimonialsContent,
  BlogPreviewContent,
  NewsletterContent,
  ProductCarouselContent,
  CompetitorComparisonContent,
  ContactHeroContent,
  ContactDetailsContent,
  ContactFormContent,
  ContactFAQContent,
  ContactBusinessContent,
  AboutHeroContent,
  AboutStoryContent,
  AboutMissionContent,
  AboutSustainabilityContent,
  AboutTeamContent,
  AboutCustomerImpactContent,
  AboutCtaContent,
  ForBusinessHeroContent,
  BusinessSolutionsContent,
  BusinessContactContent,
  CustomSolutionsHeroContent,
  CustomSolutionsServicesContent,
  CustomSolutionsProcessContent,
  CustomSolutionsCtaContent
};