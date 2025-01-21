export interface Product {
  id: number;
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
}