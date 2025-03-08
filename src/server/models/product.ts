
// Product model, matching the structure in Supabase
export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  slug: string;
  features: string[];
  specifications: Record<string, any>;
  media?: any[];
  why_choose_features?: any[];
}

// Function to parse product data from database to Product type
export const parseProduct = (data: any): Product => {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    image: data.image,
    price: data.price,
    slug: data.slug,
    features: data.features || [],
    specifications: data.specifications || {},
    media: data.media || [],
    why_choose_features: data.why_choose_features || []
  };
};
