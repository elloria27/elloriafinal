import { Json } from '@/integrations/supabase/types';

export interface ProductSpecifications {
  length: string;
  absorption: string;
  quantity: string;
  material: string;
  features: string;
}

export const parseSpecifications = (specs: Json | null): ProductSpecifications => {
  if (!specs || typeof specs !== 'object') {
    return {
      length: '',
      absorption: '',
      quantity: '',
      material: '',
      features: ''
    };
  }

  const s = specs as Record<string, unknown>;
  
  return {
    length: String(s.length || ''),
    absorption: String(s.absorption || ''),
    quantity: String(s.quantity || ''),
    material: String(s.material || ''),
    features: String(s.features || '')
  };
};