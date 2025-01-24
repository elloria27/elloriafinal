export interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  features: string[];
  specifications: {
    length: string;
    absorption: string;
    quantity: string;
    material: string;
    features: string;
  };
  created_at?: string;
  updated_at?: string;
}