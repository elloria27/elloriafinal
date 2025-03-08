
import express, { Request, Response } from 'express';
import { Product } from '../models/product';

const router = express.Router();

// Sample product data (in production, use a real database)
const products: Product[] = [];

// Get all products endpoint
router.get('/', async (req: Request, res: Response) => {
  try {
    // In a real implementation, you would fetch products from a database
    return res.status(200).json({ products });
  } catch (error) {
    console.error('Get products error:', error);
    return res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get product by slug endpoint
router.get('/:slug', async (req: Request<{ slug: string }>, res: Response) => {
  try {
    const { slug } = req.params;
    
    // Find product by slug
    const product = products.find(product => product.slug === slug);
    
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
