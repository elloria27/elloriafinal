
import express, { Request, Response } from 'express';
import { Product } from '../models/product';

const router = express.Router();

// Sample product data (in production, use a database)
const products: Product[] = [];

// Get all products
router.get('/products', async (req: Request, res: Response) => {
  try {
    return res.status(200).json({ products });
  } catch (error) {
    console.error('Get products error:', error);
    return res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get product by slug
router.get('/products/:slug', async (req: Request<{ slug: string }>, res: Response) => {
  try {
    const { slug } = req.params;
    const product = products.find(p => p.slug === slug);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    return res.status(200).json({ product });
  } catch (error) {
    console.error('Get product error:', error);
    return res.status(500).json({ error: 'Failed to fetch product' });
  }
});

export default router;
