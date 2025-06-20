
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
  custom_buy_button?: {
    enabled: boolean;
    url: string;
  };
  created_at?: string;
  updated_at?: string;
}
