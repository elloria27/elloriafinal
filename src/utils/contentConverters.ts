import { Json } from "@/integrations/supabase/types";
import { FeatureItem, TestimonialItem } from "@/types/content-blocks";

// Database types
export interface DatabaseFeature {
  icon: string;
  title: string;
  description: string;
  detail?: string;
}

export interface DatabaseTestimonial {
  name: string;
  rating: number;
  text: string;
  source: string;
}

// Type guards
const isFeatureItem = (item: any): item is DatabaseFeature => {
  return typeof item === 'object' && 
         typeof item.icon === 'string' && 
         typeof item.title === 'string' && 
         typeof item.description === 'string';
};

const isTestimonialItem = (item: any): item is DatabaseTestimonial => {
  return typeof item === 'object' && 
         typeof item.name === 'string' && 
         typeof item.text === 'string' && 
         typeof item.source === 'string' && 
         typeof item.rating === 'number';
};

// Converters
export const convertToFeatureItem = (dbFeature: DatabaseFeature): FeatureItem => {
  return {
    icon: dbFeature.icon,
    title: dbFeature.title,
    description: dbFeature.description,
    detail: dbFeature.detail
  };
};

export const convertToTestimonialItem = (dbTestimonial: DatabaseTestimonial): TestimonialItem => {
  return {
    name: dbTestimonial.name,
    rating: dbTestimonial.rating,
    text: dbTestimonial.text,
    source: dbTestimonial.source
  };
};

// Array converters
export const convertToFeatureItems = (data: Json | null): FeatureItem[] => {
  if (!data) return [];
  if (Array.isArray(data)) {
    return data.map(item => {
      if (typeof item === 'string') {
        try {
          const parsed = JSON.parse(item);
          return isFeatureItem(parsed) ? convertToFeatureItem(parsed) : null;
        } catch {
          return null;
        }
      }
      return isFeatureItem(item) ? convertToFeatureItem(item) : null;
    }).filter((item): item is FeatureItem => item !== null);
  }
  return [];
};

export const convertToTestimonialItems = (data: Json | null): TestimonialItem[] => {
  if (!data) return [];
  if (Array.isArray(data)) {
    return data.map(item => {
      if (typeof item === 'string') {
        try {
          const parsed = JSON.parse(item);
          return isTestimonialItem(parsed) ? convertToTestimonialItem(parsed) : null;
        } catch {
          return null;
        }
      }
      return isTestimonialItem(item) ? convertToTestimonialItem(item) : null;
    }).filter((item): item is TestimonialItem => item !== null);
  }
  return [];
};