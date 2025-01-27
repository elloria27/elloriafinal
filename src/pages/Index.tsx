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
import { GameChanger } from "@/components/GameChanger";
import { ContentBlock } from "@/types/content-blocks";

const Index = () => {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomePageContent = async () => {
      try {
        // First, get the homepage slug from site settings
        const { data: settingsData, error: settingsError } = await supabase
          .from('site_settings')
          .select('homepage_slug')
          .single();

        if (settingsError) {
          console.error('Error fetching homepage slug:', settingsError);
          return;
        }

        if (!settingsData?.homepage_slug) {
          console.error('No homepage slug found in settings');
          return;
        }

        // Then fetch the page content using the slug
        const { data: pageData, error: pageError } = await supabase
          .from('pages')
          .select('id')
          .eq('slug', settingsData.homepage_slug)
          .single();

        if (pageError) {
          console.error('Error fetching page:', pageError);
          return;
        }

        // Finally, fetch the content blocks for this page
        const { data: blocksData, error: blocksError } = await supabase
          .from('content_blocks')
          .select('*')
          .eq('page_id', pageData.id)
          .order('order_index');

        if (blocksError) {
          console.error('Error fetching content blocks:', blocksError);
          return;
        }

        console.log('Fetched content blocks:', blocksData);
        setBlocks(blocksData || []);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHomePageContent();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'content_blocks' },
        () => {
          console.log('Content blocks updated, refreshing...');
          fetchHomePageContent();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const renderBlock = (block: ContentBlock) => {
    const content = block.content;
    
    switch (block.type) {
      case 'hero':
        return <Hero content={content} />;
      case 'features':
        return <Features content={content} />;
      case 'game_changer':
        return <GameChanger content={content} />;
      case 'store_brands':
        return <StoreBrands content={content} />;
      case 'sustainability':
        return <Sustainability content={content} />;
      case 'product_carousel':
        return <ProductCarousel content={content} />;
      case 'competitor_comparison':
        return <CompetitorComparison content={content} />;
      case 'testimonials':
        return <Testimonials content={content} />;
      case 'blog_preview':
        return <BlogPreview content={content} />;
      case 'newsletter':
        return <Newsletter content={content} />;
      default:
        console.warn(`Unknown block type: ${block.type}`);
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
    <main className="flex-grow">
      {blocks.map((block) => (
        <div key={block.id}>
          {renderBlock(block)}
        </div>
      ))}
    </main>
  );
};

export default Index;