export interface Product {
  id: string;  // Changed from number to string
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