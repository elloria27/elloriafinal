
// Модель продукту, яка відповідає структурі в Supabase
export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  features: string[];
  slug: string;
  specifications: {
    length: string;
    absorption: string;
    quantity: string;
    material: string;
    features: string;
  };
  media?: {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
  }[];
  why_choose_features?: {
    icon: string;
    title: string;
    description: string;
  }[];
  created_at?: string;
  updated_at?: string;
}

// Функція для перетворення даних з бази даних у модель Product
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

// Допоміжні функції для обробки специфічних полів
interface JsonObject {
  [key: string]: any;
}

export const parseSpecifications = (specs: any): Product['specifications'] => {
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

export const parseMedia = (media: any): Product['media'] => {
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

export const parseWhyChooseFeatures = (features: any): Product['why_choose_features'] => {
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
