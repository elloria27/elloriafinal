
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
      // Instead of using exec_sql RPC which doesn't exist, we'll use direct SQL with the REST API
      try {
        // First try to create the table directly with an insert operation
        const { error: insertError } = await supabase
          .from('site_settings')
          .insert({
            id: crypto.randomUUID(),
            site_title: 'My Website',
            default_language: 'en',
            enable_registration: true,
            enable_search_indexing: true,
            homepage_slug: 'index',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        
        if (insertError && insertError.code === '42P01') {
          console.error('Cannot create site_settings table automatically:', insertError);
          toast.error('Failed to create site_settings table. Please create it manually in Supabase dashboard.');
          return null;
        }
      } catch (sqlError) {
        console.error('Error executing table creation:', sqlError);
        toast.error('Failed to create site_settings table');
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

// Helper function to check if a table exists
// This version works with TypeScript by using a more generic approach
export const tableExists = async (tableName: string) => {
  try {
    // Use a direct query to the system catalog instead
    // This avoids TypeScript errors with dynamic table names
    const { error } = await supabase
      .rpc('check_table_exists', { table_name: tableName })
      .single();
      
    if (error) {
      // If the RPC function doesn't exist, fall back to error code checking
      console.log(`check_table_exists RPC not available: ${error.message}`);
      
      // Make any query to the table and check if we get a '42P01' error
      // We use 'site_settings' as a safe default to check first
      if (tableName === 'site_settings') {
        const { error: tableError } = await supabase
          .from('site_settings')
          .select('count(*)', { count: 'exact', head: true });
          
        return !tableError || tableError.code !== '42P01';
      } else {
        // For any other table, we have to use a type assertion to bypass TypeScript's type checking
        // This is not ideal but necessary for dynamic table checking
        // @ts-ignore: Bypassing TypeScript's type checking for dynamic table names
        const { error: tableError } = await supabase
          .from(tableName)
          .select('count(*)', { count: 'exact', head: true });
          
        return !tableError || tableError.code !== '42P01';
      }
    }
    
    return true;
  } catch (err) {
    console.error(`Error checking if table ${tableName} exists:`, err);
    return false;
  }
};
