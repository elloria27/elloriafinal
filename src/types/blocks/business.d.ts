import { BaseBlockContent } from "./basic";

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