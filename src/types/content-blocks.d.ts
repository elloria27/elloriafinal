import { BlockType, ContentBlock, BaseBlockContent, HeadingBlockContent, TextBlockContent, ImageBlockContent, VideoBlockContent, ButtonBlockContent } from './blocks/basic';
import { HeroContent, FeaturesContent, GameChangerContent, StoreBrandsContent, SustainabilityContent, TestimonialsContent, BlogPreviewContent, NewsletterContent, ProductCarouselContent, CompetitorComparisonContent } from './blocks/content';
import { ContactHeroContent, ContactDetailsContent, ContactFormContent, ContactFAQContent, ContactBusinessContent, AboutHeroContent, AboutStoryContent, AboutMissionContent, AboutSustainabilityContent, AboutTeamContent, AboutCustomerImpactContent, AboutCtaContent } from './blocks/sections';
import { ForBusinessHeroContent, BusinessSolutionsContent, BusinessContactContent, CustomSolutionsHeroContent, CustomSolutionsServicesContent, CustomSolutionsProcessContent, CustomSolutionsCtaContent } from './blocks/business';

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