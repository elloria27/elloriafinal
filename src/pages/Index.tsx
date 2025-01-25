import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { StoreBrands } from "@/components/StoreBrands";
import { Sustainability } from "@/components/Sustainability";
import { ProductCarousel } from "@/components/ProductCarousel";
import { CompetitorComparison } from "@/components/CompetitorComparison";
import { Testimonials } from "@/components/Testimonials";
import { BlogPreview } from "@/components/BlogPreview";
import { Newsletter } from "@/components/Newsletter";
import { Header } from "@/components/Header";
import { ElevatingEssentials } from "@/components/ElevatingEssentials";
import { GameChanger } from "@/components/GameChanger";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ContentBlock } from "@/types/content-blocks";
import { toast } from "sonner";

const Index = () => {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomePageContent = async () => {
      try {
        console.log('Fetching home page content');
        
        // First get the home page ID
        const { data: page, error: pageError } = await supabase
          .from('pages')
          .select('id')
          .eq('slug', '/')
          .single();

        if (pageError) {
          console.error('Error fetching home page:', pageError);
          throw pageError;
        }

        if (!page) {
          console.log('Creating home page...');
          // Create the home page if it doesn't exist
          const { data: newPage, error: createError } = await supabase
            .from('pages')
            .insert({
              title: 'Home',
              slug: '/',
              is_published: true
            })
            .select()
            .single();

          if (createError) throw createError;
          
          // Create default content blocks
          const defaultBlocks = [
            { type: 'hero', content: {}, order_index: 0 },
            { type: 'elevating_essentials', content: {}, order_index: 1 },
            { type: 'game_changer', content: {}, order_index: 2 },
            { type: 'features', content: {}, order_index: 3 },
            { type: 'store_brands', content: {}, order_index: 4 },
            { type: 'sustainability', content: {}, order_index: 5 },
            { type: 'product_carousel', content: {}, order_index: 6 },
            { type: 'competitor_comparison', content: {}, order_index: 7 },
            { type: 'testimonials', content: {}, order_index: 8 },
            { type: 'blog_preview', content: {}, order_index: 9 },
            { type: 'newsletter', content: {}, order_index: 10 }
          ].map(block => ({
            ...block,
            page_id: newPage.id
          }));

          const { error: blocksError } = await supabase
            .from('content_blocks')
            .insert(defaultBlocks);

          if (blocksError) throw blocksError;
          
          toast.success('Home page created with default content blocks');
        }

        // Now fetch the content blocks
        const { data: blocks, error: blocksError } = await supabase
          .from('content_blocks')
          .select('*')
          .eq('page_id', page?.id || '')
          .order('order_index');

        if (blocksError) {
          console.error('Error fetching content blocks:', blocksError);
          throw blocksError;
        }

        console.log('Content blocks fetched:', blocks);
        setBlocks(blocks);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load page content');
      } finally {
        setLoading(false);
      }
    };

    fetchHomePageContent();
  }, []);

  const renderBlock = (block: ContentBlock) => {
    switch (block.type) {
      case 'hero':
        return <Hero content={block.content} />;
      case 'features':
        return <Features content={block.content} />;
      case 'elevating_essentials':
        return <ElevatingEssentials />;
      case 'game_changer':
        return <GameChanger />;
      case 'store_brands':
        return <StoreBrands />;
      case 'sustainability':
        return <Sustainability />;
      case 'product_carousel':
        return <ProductCarousel />;
      case 'competitor_comparison':
        return <CompetitorComparison />;
      case 'testimonials':
        return <Testimonials />;
      case 'blog_preview':
        return <BlogPreview />;
      case 'newsletter':
        return <Newsletter />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
        {blocks.map((block) => (
          <div key={block.id}>
            {renderBlock(block)}
          </div>
        ))}
      </motion.main>
    </>
  );
};

export default Index;