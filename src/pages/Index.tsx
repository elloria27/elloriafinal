import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
import { ContentBlock, HeroBlockContent, FeaturesBlockContent } from "@/types/content-blocks";

const Index = () => {
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        console.log('Fetching home page content');
        const { data: pages, error: pageError } = await supabase
          .from('pages')
          .select('id')
          .eq('slug', 'home')
          .single();

        if (pageError) {
          console.error('Error fetching home page:', pageError);
          return;
        }

        if (!pages) {
          console.log('Home page not found');
          return;
        }

        console.log('Found home page:', pages);

        const { data: blocks, error: blocksError } = await supabase
          .from('content_blocks')
          .select('*')
          .eq('page_id', pages.id)
          .order('order_index');

        if (blocksError) {
          console.error('Error fetching content blocks:', blocksError);
          return;
        }

        console.log('Fetched content blocks:', blocks);
        setContentBlocks(blocks as ContentBlock[] || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPageContent();
  }, []);

  const renderBlock = (block: ContentBlock) => {
    console.log('Rendering block:', block);
    
    switch (block.type) {
      case 'hero':
        return <Hero content={block.content as HeroBlockContent} />;
      case 'features':
        return <Features content={block.content as FeaturesBlockContent} />;
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
      case 'elevating_essentials':
        return <ElevatingEssentials />;
      case 'game_changer':
        return <GameChanger />;
      default:
        console.warn('Unknown block type:', block.type);
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
        {contentBlocks.map((block) => (
          <div key={block.id}>
            {renderBlock(block)}
          </div>
        ))}
      </motion.main>
    </>
  );
};

export default Index;