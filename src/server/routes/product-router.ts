import express, { Request, Response } from 'express';
import { Product } from '../models/product';

const router = express.Router();

// Sample product data for demo purposes
const sampleProducts: Product[] = [
  {
    id: '1',
    name: 'Eco-Friendly Water Bottle',
    slug: 'eco-friendly-water-bottle',
    description: 'Reusable water bottle made from sustainable materials.',
    price: 25.00,
    image: 'https://example.com/images/water-bottle.jpg',
    specifications: {
      material: 'Stainless Steel',
      capacity: '750ml',
      weight: '300g'
    },
    media: [],
    why_choose_features: []
  },
  {
    id: '2',
    name: 'Organic Cotton T-Shirt',
    slug: 'organic-cotton-t-shirt',
    description: 'Comfortable t-shirt made from 100% organic cotton.',
    price: 35.00,
    image: 'https://example.com/images/t-shirt.jpg',
    specifications: {
      material: 'Organic Cotton',
      sizes: 'S, M, L, XL',
      color: 'White'
    },
    media: [],
    why_choose_features: []
  },
  {
    id: '3',
    name: 'Bamboo Toothbrush',
    slug: 'bamboo-toothbrush',
    description: 'Sustainable toothbrush with a bamboo handle and soft bristles.',
    price: 8.00,
    image: 'https://example.com/images/toothbrush.jpg',
    specifications: {
      handle: 'Bamboo',
      bristles: 'Nylon',
      lifespan: '3 months'
    },
    media: [],
    why_choose_features: []
  },
];

// Get all products
router.get('/', async (req: Request, res: Response) => {
  try {
    // In a real app, we would fetch products from a database
    // For demo purposes, we'll just return some sample data
    return res.status(200).json(sampleProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get product by slug
router.get('/:slug', async (req: Request<{ slug: string }>, res: Response) => {
  try {
    const { slug } = req.params;
    
    // In a real app, we would fetch the product from a database
    // For demo purposes, we'll just simulate finding a product
    const product = sampleProducts.find(p => p.slug === slug);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    return res.status(200).json(product);
  } catch (error) {
    console.error(`Error fetching product with slug ${req.params.slug}:`, error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
