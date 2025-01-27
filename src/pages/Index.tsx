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
import { 
  ContentBlock, 
  BlockContent,
  HeroContent,
  FeaturesContent,
  GameChangerContent,
  StoreBrandsContent,
  SustainabilityContent,
  ProductCarouselContent,
  TestimonialsContent,
  BlogPreviewContent,
  NewsletterContent
} from "@/types/content-blocks";
import { toast } from "sonner";

const Index = () => {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHomePageContent = async () => {
      try {
        console.log('Fetching homepage content...');
        
        // First, get the homepage slug from site settings
        const { data: settingsData, error: settingsError } = await supabase
          .from('site_settings')
          .select('homepage_slug')
          .limit(1)
          .maybeSingle();

        if (settingsError) {
          console.error('Error fetching homepage slug:', settingsError);
          toast.error("Error loading homepage content");
          return;
        }

        // If no settings found or no homepage_slug set, use 'index' as default
        const homepageSlug = settingsData?.homepage_slug || 'index';
        console.log('Homepage slug:', homepageSlug);

        // Then fetch the page content using the slug
        const { data: pageData, error: pageError } = await supabase
          .from('pages')
          .select('id')
          .eq('slug', homepageSlug)
          .maybeSingle();

        if (pageError) {
          console.error('Error fetching page:', pageError);
          toast.error("Error loading page content");
          return;
        }

        if (!pageData) {
          console.log('No page found with slug:', homepageSlug);
          setBlocks([]);
          return;
        }

        console.log('Page ID:', pageData.id);

        // Finally, fetch the content blocks for this page
        const { data: blocksData, error: blocksError } = await supabase
          .from('content_blocks')
          .select('*')
          .eq('page_id', pageData.id)
          .order('order_index');

        if (blocksError) {
          console.error('Error fetching content blocks:', blocksError);
          toast.error("Error loading page content");
          return;
        }

        console.log('Content blocks:', blocksData);

        // Transform the blocks data to match ContentBlock type
        const transformedBlocks = blocksData?.map(block => ({
          ...block,
          content: block.content as BlockContent
        })) || [];

        setBlocks(transformedBlocks);
      } catch (error) {
        console.error('Error:', error);
        toast.error("Error loading page content");
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
    switch (block.type) {
      case 'hero':
        return <Hero content={block.content as HeroContent} />;
      case 'features':
        return <Features content={block.content as FeaturesContent} />;
      case 'game_changer':
        return <GameChanger content={block.content as GameChangerContent} />;
      case 'store_brands':
        return <StoreBrands content={block.content as StoreBrandsContent} />;
      case 'sustainability':
        return <Sustainability content={block.content as SustainabilityContent} />;
      case 'product_carousel':
        return <ProductCarousel content={block.content as ProductCarouselContent} />;
      case 'competitor_comparison':
        return <CompetitorComparison content={block.content as BlockContent} />;
      case 'testimonials':
        return <Testimonials content={block.content as TestimonialsContent} />;
      case 'blog_preview':
        return <BlogPreview content={block.content as BlogPreviewContent} />;
      case 'newsletter':
        return <Newsletter content={block.content as NewsletterContent} />;
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