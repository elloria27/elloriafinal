
import { supabase } from '@/integrations/supabase/client';

export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*, inventory(quantity)');

  if (error) throw error;
  return data;
}

export async function getProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*, inventory(quantity)')
    .eq('slug', slug)
    .single();

  if (error) throw error;
  return data;
}

export async function searchProducts(query: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*, inventory(quantity)')
    .ilike('name', `%${query}%`);

  if (error) throw error;
  return data;
}

export async function getProductInventory(productId: string) {
  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .eq('product_id', productId)
    .single();

  if (error) throw error;
  return data;
}
