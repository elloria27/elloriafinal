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

export const getSiteSettings = async () => {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        console.error('No site settings found:', error);
        return null;
      } else if (error.code === '42P01') {
        console.error('Table site_settings doesn\'t exist:', error);
        return null;
      } else {
        throw error;
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return null;
  }
};

export const createDefaultSiteSettings = async () => {
  try {
    const { error: tableCheckError } = await supabase
      .from('site_settings')
      .select('id')
      .limit(1);
    
    if (tableCheckError && tableCheckError.code === '42P01') {
      const { error: sqlError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS public.site_settings (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            site_title TEXT NOT NULL DEFAULT 'My Website',
            default_language TEXT NOT NULL DEFAULT 'en',
            enable_registration BOOLEAN NOT NULL DEFAULT true,
            enable_search_indexing BOOLEAN NOT NULL DEFAULT true,
            meta_description TEXT,
            meta_keywords TEXT,
            custom_scripts JSONB DEFAULT '[]'::jsonb,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
            homepage_slug TEXT DEFAULT 'index',
            logo_url TEXT
          );
          
          INSERT INTO public.site_settings (id, site_title, default_language)
          VALUES (gen_random_uuid(), 'My Website', 'en')
          ON CONFLICT DO NOTHING;
        `
      });
      
      if (sqlError) {
        console.error('Error creating site_settings table:', sqlError);
        return null;
      }
    }
    
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        const { data: insertData, error: insertError } = await supabase
          .from('site_settings')
          .insert({
            site_title: 'My Website',
            default_language: 'en',
            enable_registration: true,
            enable_search_indexing: true,
            homepage_slug: 'index',
            custom_scripts: []
          })
          .select()
          .single();
          
        if (insertError) {
          console.error('Error inserting default site settings:', insertError);
          return null;
        }
        
        return insertData;
      } else {
        throw error;
      }
    }
    
    return data;
  } catch (error) {
    console.error('Error setting up site settings:', error);
    toast.error('Failed to set up site settings');
    return null;
  }
};
