import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ContentBlock, BlockType, GameChangerContent, HeroContent, BlockContent } from "@/types/content-blocks";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { StoreBrands } from "@/components/StoreBrands";
import { Sustainability } from "@/components/Sustainability";
import { ProductCarousel } from "@/components/ProductCarousel";
import { CompetitorComparison } from "@/components/CompetitorComparison";
import { Testimonials } from "@/components/Testimonials";
import { BlogPreview } from "@/components/BlogPreview";
import { Newsletter } from "@/components/Newsletter";
import { GameChanger } from "@/components/GameChanger";

const Index = () => {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomePageContent = async () => {
      try {
        console.log('Fetching home page content');
        
        // First get the homepage slug from site settings
        const { data: settings, error: settingsError } = await supabase
          .from('site_settings')
          .select('homepage_slug')
          .maybeSingle();

        if (settingsError) {
          console.error('Error fetching site settings:', settingsError);
          throw settingsError;
        }

        const homepageSlug = settings?.homepage_slug || 'home';
        console.log('Homepage slug:', homepageSlug);

        // Get the page content for the homepage
        const { data: page, error: pageError } = await supabase
          .from('pages')
          .select('content_blocks')
          .eq('slug', homepageSlug)
          .maybeSingle();

        if (pageError) {
          console.error('Error fetching home page:', pageError);
          throw pageError;
        }

        if (!page) {
          console.error('Home page not found');
          toast.error('Home page content not found');
          return;
        }

        console.log('Home page content blocks:', page.content_blocks);
        
        // Transform the content blocks to ensure proper typing
        const typedBlocks: ContentBlock[] = (page.content_blocks || []).map((block: any) => ({
          id: block.id || crypto.randomUUID(),
          type: block.type as BlockType,
          content: block.content as BlockContent,
          order_index: block.order_index || 0,
          page_id: block.page_id,
          created_at: block.created_at,
          updated_at: block.updated_at
        }));
        
        setBlocks(typedBlocks);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load page content');
      } finally {
        setLoading(false);
      }
    };

    fetchHomePageContent();

    // Subscribe to pages changes
    const channel = supabase
      .channel('pages_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pages'
        },
        () => {
          console.log('Pages changed, refreshing...');
          fetchHomePageContent();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const renderBlock = (block: ContentBlock) => {
    console.log('Rendering block:', block.type, block.content);
    
    switch (block.type as BlockType) {
      case 'hero':
        return <Hero content={block.content as HeroContent} />;
      case 'elevating_essentials':
        return <Features content={block.content} />;
      case 'game_changer':
        return <GameChanger content={block.content as GameChangerContent} />;
      case 'features':
        return <Features content={block.content} />;
      case 'store_brands':
        return <StoreBrands content={block.content} />;
      case 'sustainability':
        return <Sustainability content={block.content} />;
      case 'product_carousel':
        return <ProductCarousel content={block.content} />;
      case 'competitor_comparison':
        return <CompetitorComparison />;
      case 'testimonials':
        return <Testimonials />;
      case 'blog_preview':
        return <BlogPreview />;
      case 'newsletter':
        return <Newsletter />;
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
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex-grow"
    >
      <div className="page-content">
        {blocks.map((block) => (
          <div key={block.id}>
            {renderBlock(block)}
          </div>
        ))}
      </div>
    </motion.main>
  );
};

export default Index;