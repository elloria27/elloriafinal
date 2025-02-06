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
          return convertToFeatureItem(JSON.parse(item));
        } catch {
          return null;
        }
      }
      return convertToFeatureItem(item as DatabaseFeature);
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
          return convertToTestimonialItem(JSON.parse(item));
        } catch {
          return null;
        }
      }
      return convertToTestimonialItem(item as DatabaseTestimonial);
    }).filter((item): item is TestimonialItem => item !== null);
  }
  return [];
};