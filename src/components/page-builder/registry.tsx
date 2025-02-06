import { ComponentRegistryItem } from '@/types/page-builder';
import { Type, Image, FileText, Layout, Blocks, Newspaper } from 'lucide-react';
import { Features } from '@/components/Features';
import { Hero } from '@/components/Hero';
import { ProductCarousel } from '@/components/ProductCarousel';

export const componentRegistry: ComponentRegistryItem[] = [
  {
    type: 'text',
    name: 'Text Block',
    description: 'A simple text block with formatting options',
    icon: <Type className="w-4 h-4" />,
    component: ({ content }) => <div>{content.text}</div>,
    defaultContent: { text: 'Enter your text here' }
  },
  {
    type: 'hero',
    name: 'Hero Section',
    description: 'Add a hero section with title, subtitle and background',
    icon: <Layout className="w-4 h-4" />,
    component: Hero,
    defaultContent: {
      title: 'Welcome to Your Page',
      subtitle: 'Add a compelling subtitle here',
      backgroundImage: '',
      primaryButtonText: 'Get Started',
      secondaryButtonText: 'Learn More'
    }
  },
  {
    type: 'features',
    name: 'Features Grid',
    description: 'Display features in a grid layout',
    icon: <Blocks className="w-4 h-4" />,
    component: Features,
    defaultContent: {
      title: 'Our Features',
      subtitle: 'What makes us different',
      features: [
        {
          icon: 'Star',
          title: 'Feature 1',
          description: 'Description of feature 1'
        }
      ]
    }
  },
  {
    type: 'product-carousel',
    name: 'Product Carousel',
    description: 'Display products in a carousel',
    icon: <Image className="w-4 h-4" />,
    component: ProductCarousel,
    defaultContent: {
      title: 'Our Products'
    }
  }
];