import { Json } from "@/integrations/supabase/types";
import { FeatureItem, TestimonialItem } from "@/types/content-blocks";

// Database types
export interface DatabaseFeature {
  icon: string;
  title: string;
  description: string;
  detail?: string;
  color?: string;
}

export interface DatabaseTestimonial {
  name: string;
  rating: number;
  text: string;
  source: string;
}

// Type guards
const isFeatureItem = (item: unknown): item is DatabaseFeature => {
  if (!item || typeof item !== 'object') return false;
  const feature = item as any;
  return (
    typeof feature.icon === 'string' && 
    typeof feature.title === 'string' && 
    typeof feature.description === 'string'
  );
};

const isTestimonialItem = (item: unknown): item is DatabaseTestimonial => {
  if (!item || typeof item !== 'object') return false;
  const testimonial = item as any;
  return (
    typeof testimonial.name === 'string' && 
    typeof testimonial.text === 'string' && 
    typeof testimonial.source === 'string' && 
    typeof testimonial.rating === 'number'
  );
};

// Converters
export const convertToFeatureItem = (dbFeature: DatabaseFeature): FeatureItem => {
  return {
    icon: dbFeature.icon,
    title: dbFeature.title,
    description: dbFeature.description,
    detail: dbFeature.detail,
    color: dbFeature.color
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

// Array converters with better type safety
export const convertToFeatureItems = (data: Json | null): FeatureItem[] => {
  if (!data || !Array.isArray(data)) return [];
  
  return data
    .map(item => {
      if (typeof item === 'string') {
        try {
          const parsed = JSON.parse(item);
          return isFeatureItem(parsed) ? convertToFeatureItem(parsed) : null;
        } catch {
          return null;
        }
      }
      return isFeatureItem(item) ? convertToFeatureItem(item) : null;
    })
    .filter((item): item is FeatureItem => item !== null);
};

export const convertToTestimonialItems = (data: Json | null): TestimonialItem[] => {
  if (!data || !Array.isArray(data)) return [];
  
  return data
    .map(item => {
      if (typeof item === 'string') {
        try {
          const parsed = JSON.parse(item);
          return isTestimonialItem(parsed) ? convertToTestimonialItem(parsed) : null;
        } catch {
          return null;
        }
      }
      return isTestimonialItem(item) ? convertToTestimonialItem(item) : null;
    })
    .filter((item): item is TestimonialItem => item !== null);
};