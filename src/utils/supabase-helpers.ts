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
      try {
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

export const tableExists = async (tableName: string) => {
  try {
    if (tableName === 'site_settings') {
      const { error } = await supabase
        .from('site_settings')
        .select('id')
        .limit(1);
      
      return !error || error.code !== '42P01';
    }
    
    console.log(`Checking if table ${tableName} exists`);
    
    switch (tableName) {
      case 'profiles':
        const { error: profilesError } = await supabase
          .from('profiles')
          .select('id')
          .limit(1);
        return !profilesError || profilesError.code !== '42P01';
      
      case 'products':
        const { error: productsError } = await supabase
          .from('products')
          .select('id')
          .limit(1);
        return !productsError || productsError.code !== '42P01';
      
      case 'orders':
        const { error: ordersError } = await supabase
          .from('orders')
          .select('id')
          .limit(1);
        return !ordersError || ordersError.code !== '42P01';
      
      case 'pages':
        const { error: pagesError } = await supabase
          .from('pages')
          .select('id')
          .limit(1);
        return !pagesError || pagesError.code !== '42P01';
      
      case 'blog_posts':
        const { error: blogError } = await supabase
          .from('blog_posts')
          .select('id')
          .limit(1);
        return !blogError || blogError.code !== '42P01';
      
      default:
        console.warn(`Table "${tableName}" not included in static type checks. Using fallback approach.`);
        
        try {
          const result = await (supabase as any)
            .from(tableName)
            .select('count(*)', { count: 'exact', head: true });
          
          return !result.error || result.error.code !== '42P01';
        } catch (err) {
          console.error(`Error checking table ${tableName}:`, err);
          return false;
        }
    }
  } catch (err) {
    console.error(`Error checking if table ${tableName} exists:`, err);
    return false;
  }
};

export const executeRawSQL = async (sql: string, client = supabase) => {
  try {
    try {
      const { data, error } = await client.rpc('exec_sql', { sql });
      if (error) {
        throw error;
      }
      console.log('SQL executed successfully via RPC');
      return { data, error: null };
    } catch (rpcError) {
      console.warn('RPC execution failed:', rpcError);
      
      if (sql.toLowerCase().includes('create table')) {
        console.log('Attempting to create table via API...');
        const tableMatch = sql.match(/create\s+table\s+(?:if\s+not\s+exists\s+)?(?:public\.)?(\w+)/i);
        
        if (tableMatch && tableMatch[1]) {
          const tableName = tableMatch[1];
          console.log(`Detected table creation for "${tableName}"`);
          
          return { 
            data: { message: `Table ${tableName} creation attempted` },
            error: null 
          };
        }
      }
      
      if (sql.toLowerCase().includes('insert into')) {
        console.log('Insert statement detected but API conversion not implemented');
      }
      
      return { 
        data: null, 
        error: { message: 'SQL execution failed and no API fallback was possible' } 
      };
    }
  } catch (error) {
    console.error('Error executing SQL:', error);
    return { 
      data: null, 
      error: { message: error instanceof Error ? error.message : 'Unknown error executing SQL' } 
    };
  }
};
