
import { Json } from "@/integrations/supabase/types";
import { Product } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface JsonObject {
  [key: string]: Json;
}

export const parseSpecifications = (specs: Json): Product['specifications'] => {
  if (!specs || typeof specs !== 'object' || Array.isArray(specs)) {
    return {
      length: '',
      absorption: '',
      quantity: '',
      material: '',
      features: ''
    };
  }

  const specObject = specs as JsonObject;
  
  return {
    length: String(specObject.length || ''),
    absorption: String(specObject.absorption || ''),
    quantity: String(specObject.quantity || ''),
    material: String(specObject.material || ''),
    features: String(specObject.features || '')
  };
};

interface MediaItem {
  type?: string;
  url?: string;
  thumbnail?: string;
}

export const parseMedia = (media: Json): Product['media'] => {
  if (!Array.isArray(media)) return [];
  
  return media.map(item => {
    const mediaItem = item as MediaItem;
    return {
      type: (mediaItem.type === 'video' || mediaItem.type === 'image') ? mediaItem.type : 'image',
      url: String(mediaItem.url || ''),
      thumbnail: mediaItem.thumbnail ? String(mediaItem.thumbnail) : undefined
    };
  });
};

interface WhyChooseFeature {
  icon?: string;
  title?: string;
  description?: string;
}

export const parseWhyChooseFeatures = (features: Json): Product['why_choose_features'] => {
  if (!Array.isArray(features)) return [];
  
  return features.map(feature => {
    const whyChooseFeature = feature as WhyChooseFeature;
    return {
      icon: String(whyChooseFeature.icon || ''),
      title: String(whyChooseFeature.title || ''),
      description: String(whyChooseFeature.description || '')
    };
  });
};

export const parseProduct = (data: any): Product => {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    image: data.image,
    price: data.price,
    features: Array.isArray(data.features) ? data.features : [],
    specifications: parseSpecifications(data.specifications),
    media: parseMedia(data.media),
    why_choose_features: parseWhyChooseFeatures(data.why_choose_features),
    created_at: data.created_at,
    updated_at: data.updated_at,
    slug: data.slug
  };
};

/**
 * Imports default site settings from the SQL file
 * This function parses the SQL insert statement and converts it to a format that can be used with Supabase's insert method
 */
export const importDefaultSiteSettings = async (): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Importing default site settings...');
    
    // Check if settings already exist
    const { data: existingSettings, error: checkError } = await supabase
      .from('site_settings')
      .select('id')
      .limit(1);
      
    if (checkError) {
      console.error('Error checking existing settings:', checkError);
      return { success: false, message: `Error checking settings: ${checkError.message}` };
    }
    
    if (existingSettings && existingSettings.length > 0) {
      console.log('Settings already exist, updating instead of inserting');
      
      // Default settings parsed from the SQL file
      const defaultSettings = {
        id: 'c58d6cba-34dc-4ac6-b9fe-b19cad7eb3ec',
        site_title: 'Elloria',
        default_language: 'en' as const,
        enable_registration: true,
        enable_search_indexing: true,
        meta_description: null,
        meta_keywords: null,
        custom_scripts: [],
        created_at: '2025-01-26T16:59:44.940264-06:00',
        updated_at: '2025-02-13T06:02:08.844257-06:00',
        homepage_slug: 'index',
        favicon_url: null,
        maintenance_mode: false,
        contact_email: 'sales@elloria.ca',
        google_analytics_id: null,
        enable_cookie_consent: false,
        enable_https_redirect: false,
        max_upload_size: 10, // Changed from string to number
        enable_user_avatars: false,
        logo_url: null
      };
      
      const { error: updateError } = await supabase
        .from('site_settings')
        .update(defaultSettings)
        .eq('id', existingSettings[0].id);
        
      if (updateError) {
        console.error('Error updating settings:', updateError);
        return { success: false, message: `Error updating settings: ${updateError.message}` };
      }
      
      return { success: true, message: 'Default site settings updated successfully' };
    } else {
      console.log('No settings found, inserting default settings');
      
      // Default settings parsed from the SQL file
      const defaultSettings = {
        id: 'c58d6cba-34dc-4ac6-b9fe-b19cad7eb3ec',
        site_title: 'Elloria',
        default_language: 'en' as const,
        enable_registration: true,
        enable_search_indexing: true,
        meta_description: null,
        meta_keywords: null,
        custom_scripts: [],
        created_at: '2025-01-26T16:59:44.940264-06:00',
        updated_at: '2025-02-13T06:02:08.844257-06:00',
        homepage_slug: 'index',
        favicon_url: null,
        maintenance_mode: false,
        contact_email: 'sales@elloria.ca',
        google_analytics_id: null,
        enable_cookie_consent: false,
        enable_https_redirect: false,
        max_upload_size: 10, // Changed from string to number
        enable_user_avatars: false,
        logo_url: null
      };
      
      const { error: insertError } = await supabase
        .from('site_settings')
        .insert(defaultSettings);
        
      if (insertError) {
        console.error('Error inserting default settings:', insertError);
        return { success: false, message: `Error inserting settings: ${insertError.message}` };
      }
      
      return { success: true, message: 'Default site settings imported successfully' };
    }
  } catch (error) {
    console.error('Error in importDefaultSiteSettings:', error);
    return { 
      success: false, 
      message: `Error importing settings: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
};
