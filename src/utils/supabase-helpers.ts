import { Json } from "@/integrations/supabase/types";
import { Product } from "@/types/product";

export const parseSpecifications = (specs: Json) => {
  if (typeof specs !== 'object' || !specs) {
    return {
      length: '',
      absorption: '',
      quantity: '',
      material: '',
      features: ''
    };
  }

  return {
    length: String(specs.length || ''),
    absorption: String(specs.absorption || ''),
    quantity: String(specs.quantity || ''),
    material: String(specs.material || ''),
    features: String(specs.features || '')
  };
};

export const parseMedia = (media: Json): Product['media'] => {
  if (!Array.isArray(media)) return [];
  
  return media.map(item => ({
    type: (item.type === 'video' || item.type === 'image') ? item.type : 'image',
    url: String(item.url || ''),
    thumbnail: item.thumbnail ? String(item.thumbnail) : undefined
  }));
};

export const parseWhyChooseFeatures = (features: Json): Product['why_choose_features'] => {
  if (!Array.isArray(features)) return [];
  
  return features.map(feature => ({
    icon: String(feature.icon || ''),
    title: String(feature.title || ''),
    description: String(feature.description || '')
  }));
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
    updated_at: data.updated_at
  };
};