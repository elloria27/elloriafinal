
import express, { Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';
import { Product } from '@/types/product';
import { parseProduct } from '@/utils/supabase-helpers';

const router = express.Router();
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Get all products
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Map Supabase data to Product type using the parseProduct utility
    const products: Product[] = data.map(parseProduct);
    
    return res.status(200).json(products);
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ error: error.message || 'Failed to fetch products' });
  }
});

/**
 * Get product by slug
 */
router.get('/:slug', async (req: Request<{ slug: string }>, res: Response) => {
  try {
    const { slug } = req.params;
    
    if (!slug) {
      return res.status(400).json({ error: 'Product slug is required' });
    }
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Product not found' });
      }
      throw error;
    }
    
    // Parse the product data
    const product = parseProduct(data);
    
    return res.status(200).json(product);
  } catch (error: any) {
    console.error(`Error fetching product with slug ${req.params.slug}:`, error);
    return res.status(500).json({ error: error.message || 'Failed to fetch product' });
  }
});

export default router;
