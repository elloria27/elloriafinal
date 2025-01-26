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
import { GameChanger } from "@/components/GameChanger";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ContentBlock, BlockType, HeroContent } from "@/types/content-blocks";
import { toast } from "sonner";

const Index = () => {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomePageContent = async () => {
      try {
        console.log('Fetching home page content');
        
        const { data: page, error: pageError } = await supabase
          .from('pages')
          .select('id')
          .eq('slug', '/')
          .maybeSingle();

        if (pageError) {
          console.error('Error fetching home page:', pageError);
          throw pageError;
        }

        if (!page) {
          console.log('Creating home page...');
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
          
          const defaultBlocks = [
            { type: 'hero' as BlockType, content: {}, order_index: 0, page_id: newPage.id },
            { type: 'elevating_essentials' as BlockType, content: {}, order_index: 1, page_id: newPage.id },
            { type: 'game_changer' as BlockType, content: {}, order_index: 2, page_id: newPage.id },
            { type: 'features' as BlockType, content: {}, order_index: 3, page_id: newPage.id },
            { type: 'store_brands' as BlockType, content: {}, order_index: 4, page_id: newPage.id },
            { type: 'sustainability' as BlockType, content: {}, order_index: 5, page_id: newPage.id },
            { type: 'product_carousel' as BlockType, content: {}, order_index: 6, page_id: newPage.id },
            { type: 'competitor_comparison' as BlockType, content: {}, order_index: 7, page_id: newPage.id },
            { type: 'testimonials' as BlockType, content: {}, order_index: 8, page_id: newPage.id },
            { type: 'blog_preview' as BlockType, content: {}, order_index: 9, page_id: newPage.id },
            { type: 'newsletter' as BlockType, content: {}, order_index: 10, page_id: newPage.id }
          ];

          const { error: blocksError } = await supabase
            .from('content_blocks')
            .insert(defaultBlocks);

          if (blocksError) throw blocksError;
          
          toast.success('Home page created with default content blocks');
        }

        const pageId = page?.id;
        console.log('Fetching content blocks for page:', pageId);

        const { data: blocks, error: blocksError } = await supabase
          .from('content_blocks')
          .select('*')
          .eq('page_id', pageId)
          .order('order_index');

        if (blocksError) {
          console.error('Error fetching content blocks:', blocksError);
          throw blocksError;
        }

        console.log('Content blocks fetched:', blocks);
        setBlocks(blocks as ContentBlock[]);
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
        return <Hero content={block.content as HeroContent} />;
      case 'elevating_essentials':
        return <Features content={block.content} />;
      case 'features':
        return <Features content={block.content} />;
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
    <div className="flex flex-col min-h-screen">
      <Header />
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex-grow pt-16"
      >
        {blocks.map((block) => (
          <div key={block.id}>
            {renderBlock(block)}
          </div>
        ))}
      </motion.main>
    </div>
  );
};

export default Index;