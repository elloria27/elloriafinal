import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { StoreBrands } from "@/components/StoreBrands";
import { Sustainability } from "@/components/Sustainability";
import { ProductCarousel } from "@/components/ProductCarousel";
import { Testimonials } from "@/components/Testimonials";
import { Newsletter } from "@/components/Newsletter";
import { supabase } from "@/integrations/supabase/client";
import { ContentBlock, HeroBlockContent, FeaturesBlockContent } from "@/types/content-blocks";

const Index = () => {
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContentBlocks = async () => {
      try {
        console.log('Fetching content blocks for home page');
        const { data: pageData, error: pageError } = await supabase
          .from('pages')
          .select('id')
          .eq('slug', 'home')
          .single();

        if (pageError) {
          console.error('Error fetching home page:', pageError);
          return;
        }

        if (!pageData) {
          console.log('Home page not found');
          return;
        }

        console.log('Found home page:', pageData);

        const { data: blocks, error: blocksError } = await supabase
          .from('content_blocks')
          .select('*')
          .eq('page_id', pageData.id)
          .order('order_index');

        if (blocksError) {
          console.error('Error fetching content blocks:', blocksError);
          return;
        }

        console.log('Fetched content blocks:', blocks);
        setContentBlocks(blocks as ContentBlock[]);
      } catch (error) {
        console.error('Error in fetchContentBlocks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContentBlocks();
  }, []);

  const renderBlock = (block: ContentBlock) => {
    console.log('Rendering block:', block);
    
    switch (block.type) {
      case 'hero':
        return <Hero key={block.id} content={block.content as HeroBlockContent} />;
      case 'features':
        return <Features key={block.id} content={block.content as FeaturesBlockContent} />;
      case 'store_brands':
        return <StoreBrands key={block.id} />;
      case 'sustainability':
        return <Sustainability key={block.id} />;
      case 'product_carousel':
        return <ProductCarousel key={block.id} />;
      case 'testimonials':
        return <Testimonials key={block.id} />;
      case 'newsletter':
        return <Newsletter key={block.id} />;
      default:
        console.warn('Unknown block type:', block.type);
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen overflow-hidden pt-16"
      >
        {contentBlocks.map(block => renderBlock(block))}
      </motion.main>
    </>
  );
};

export default Index;