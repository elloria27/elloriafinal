
import express from 'express';
import { Request, Response } from 'express';
import { Product } from '../models/product';

const router = express.Router();

// Get all products
router.get('/', async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll();
    
    if (!products || products.length === 0) {
      return res.status(200).json([]);
    }
    
    return res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Get product by slug
router.get('/:slug', async (req: Request<{ slug: string }>, res: Response) => {
  try {
    const { slug } = req.params;
    
    if (!slug) {
      return res.status(400).json({ error: 'Product slug is required' });
    }
    
    const product = await Product.findBySlug(slug);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    return res.status(200).json(product);
  } catch (error) {
    console.error(`Error fetching product with slug ${req.params.slug}:`, error);
    return res.status(500).json({ error: 'Server error' });
  }
});

export default router;
