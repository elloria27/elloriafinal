import { useEffect, useState } from "react";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { CompetitorComparison } from "@/components/CompetitorComparison";
import { ProductCarousel } from "@/components/ProductCarousel";
import { Testimonials } from "@/components/Testimonials";
import { Newsletter } from "@/components/Newsletter";
import { StoreBrands } from "@/components/StoreBrands";
import { GameChanger } from "@/components/GameChanger";
import { Sustainability } from "@/components/Sustainability";
import { supabase } from "@/integrations/supabase/client";
import { ContentBlock } from "@/types/content-blocks";

export const Index = () => {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('content_blocks')
          .select('*')
          .eq('page_id', 'home')
          .order('order_index');

        if (error) throw error;

        setBlocks(data || []);
      } catch (err) {
        console.error('Error fetching content:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const renderBlock = (block: ContentBlock) => {
    console.log('Rendering block:', block.type, block.content);

    switch (block.type) {
      case 'hero':
        return <Hero content={block.content} />;
      case 'features':
        return <Features 
          features={block.content.features}
          title={block.content.title}
          subtitle={block.content.subtitle}
          description={block.content.description}
        />;
      case 'competitor-comparison':
        return <CompetitorComparison content={block.content} />;
      case 'product-carousel':
        return <ProductCarousel content={block.content} />;
      case 'testimonials':
        return <Testimonials content={block.content} />;
      case 'newsletter':
        return <Newsletter content={block.content} />;
      case 'store-brands':
        return <StoreBrands content={block.content} />;
      case 'game-changer':
        return <GameChanger content={block.content} />;
      case 'sustainability':
        return <Sustainability content={block.content} />;
      default:
        console.warn(`Unknown block type: ${block.type}`);
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <main>
      {blocks.map((block) => (
        <div key={block.id}>
          {renderBlock(block)}
        </div>
      ))}
    </main>
  );
};

export default Index;