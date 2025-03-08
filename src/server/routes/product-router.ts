
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Product } from '../models/product';

const router = express.Router();

// Mock product database
const products: Product[] = [
  {
    id: '1',
    name: 'Ultra-Thin Comfort Day Pads',
    slug: 'ultra-thin-comfort-day-pads',
    description: 'Designed for superior comfort and protection during your regular flow days.',
    price: 8.99,
    compareAtPrice: 10.99,
    images: [
      '/lovable-uploads/33dd3c83-3a91-4fee-a121-d5e700b8768d.png',
      '/lovable-uploads/a8273123-9231-4d63-8d6f-1802dbe5df98.png'
    ],
    category: 'Pads',
    tags: ['Comfort', 'Day Use', 'Regular Flow'],
    stockQuantity: 150,
    rating: 4.8,
    reviewCount: 325,
    features: [
      'Ultra-thin design',
      'Superior absorption',
      'Breathable top layer'
    ],
    dimensions: {
      length: '24cm',
      width: '7cm',
      height: '0.5cm'
    },
    weight: '15g',
    materials: [
      'Soft cotton top layer',
      'Absorbent core',
      'Leak-proof backing'
    ],
    packageContents: '36 pads',
    usage: 'For day use during regular flow',
    specifications: {
      absorbency: 'Regular',
      size: 'Regular',
      type: 'Ultra-thin',
      withWings: true
    },
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: '2',
    name: 'Overnight Protection Pads',
    slug: 'overnight-protection-pads',
    description: 'Extra-long pads designed for maximum protection during sleep.',
    price: 9.99,
    compareAtPrice: 12.99,
    images: [
      '/lovable-uploads/ba8d9a77-42de-4ec9-8666-53e795a2673c.png',
      '/lovable-uploads/bf7261ba-df57-413d-b280-3b4b56528e73.png'
    ],
    category: 'Pads',
    tags: ['Overnight', 'Extra Protection', 'Heavy Flow'],
    stockQuantity: 120,
    rating: 4.9,
    reviewCount: 187,
    features: [
      'Extra-long design',
      'Maximum absorption',
      'Comfortable for sleep'
    ],
    dimensions: {
      length: '32cm',
      width: '8cm',
      height: '0.8cm'
    },
    weight: '22g',
    materials: [
      'Soft cotton top layer',
      'Extra-absorbent core',
      'Leak-proof backing'
    ],
    packageContents: '28 pads',
    usage: 'For overnight use or heavy flow days',
    specifications: {
      absorbency: 'Heavy',
      size: 'Extra-Long',
      type: 'Overnight',
      withWings: true
    },
    created_at: new Date(),
    updated_at: new Date()
  }
];

// Get all products
router.get('/', async (req, res) => {
  try {
    // In a real implementation, this would query a database
    return res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a product by slug
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    // Find product by slug
    const product = products.find(p => p.slug === slug);
    
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
