
import express, { Request, Response } from 'express';
import { supabase } from '../../integrations/supabase/client';
import { parseProduct } from '../../utils/supabase-helpers';

const router = express.Router();

// GET all products
router.get('/products', async (req: Request, res: Response) => {
  try {
    console.log('API: Fetching all products');
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching products:', error);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
    
    const products = data.map(parseProduct);
    console.log(`API: Successfully fetched ${products.length} products`);
    res.json(products);
  } catch (error) {
    console.error('Server error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET product by slug
router.get('/products/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    console.log(`API: Fetching product with slug: ${slug}`);
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      console.error(`Error fetching product with slug ${slug}:`, error);
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const product = parseProduct(data);
    console.log(`API: Successfully fetched product: ${product.name}`);
    res.json(product);
  } catch (error) {
    console.error('Server error fetching product by slug:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
