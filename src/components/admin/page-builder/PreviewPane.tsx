import { motion } from "framer-motion";
import { ContentBlock, BlockContent, TestimonialsContent, AboutSustainabilityContent } from "@/types/content-blocks";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { HomeHero } from "@/components/home/HomeHero";
import { Features } from "@/components/Features";
import { GameChanger } from "@/components/GameChanger";
import { StoreBrands } from "@/components/StoreBrands";
import { Sustainability } from "@/components/Sustainability";
import { Testimonials } from "@/components/Testimonials";
import { BlogPreview } from "@/components/BlogPreview";
import { ProductCarousel } from "@/components/ProductCarousel";
import { CompetitorComparison } from "@/components/CompetitorComparison";
import { AboutHeroSection } from "@/components/about/AboutHeroSection";
import { AboutStory } from "@/components/about/AboutStory";
import { AboutMission } from "@/components/about/AboutMission";
import { AboutSustainability } from "@/components/about/AboutSustainability";
import { AboutTeam } from "@/components/about/AboutTeam";
import { AboutCustomerImpact } from "@/components/about/AboutCustomerImpact";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactDetails } from "@/components/contact/ContactDetails";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactFAQ } from "@/components/contact/ContactFAQ";
import { cn } from "@/lib/utils";

interface PreviewPaneProps {
  blocks: ContentBlock[];
  onSelectBlock: (block: ContentBlock) => void;
  selectedBlockId?: string;
  onDeleteBlock?: (blockId: string) => void;
  isAdmin?: boolean;
}

export const PreviewPane = ({ 
  blocks, 
  onSelectBlock, 
  selectedBlockId,
  onDeleteBlock,
  isAdmin = false
}: PreviewPaneProps) => {
  console.log('Rendering blocks:', blocks);
  
  const renderBlock = (block: ContentBlock) => {
    console.log('Rendering block:', block);
    
    const mapTestimonial = (t: any) => ({
      name: t.author || '',
      rating: t.rating || 5,
      text: t.quote || '',
      source: t.role || ''
    });

    const mapSustainabilityStats = (stats: any[]) => {
      return stats.map(stat => ({
        icon: stat.icon as "Leaf" | "Recycle" | "TreePine",
        value: String(stat.value || ''),
        label: String(stat.label || ''),
        description: String(stat.description || '')
      }));
    };

    const blockContent = (
      <div className="group relative w-full">
        {isAdmin && (
          <div className="absolute right-4 top-4 flex gap-2 z-10">
            <Button
              variant={selectedBlockId === block.id ? "default" : "ghost"}
              size="sm"
              className={cn(
                selectedBlockId === block.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
                "transition-opacity"
              )}
              onClick={() => onSelectBlock(block)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            
            {onDeleteBlock && (
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 hover:text-red-600"
                onClick={() => onDeleteBlock(block.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        {(() => {
          switch (block.type) {
            case 'heading':
              const HeadingTag = (block.content.size || 'h2') as keyof JSX.IntrinsicElements;
              return (
                <HeadingTag className="text-4xl font-bold mb-4">
                  {String(block.content.text || 'Heading')}
                </HeadingTag>
              );

            case 'text':
              return (
                <p className="text-gray-600 mb-4 whitespace-pre-wrap">
                  {String(block.content.text || 'Text block')}
                </p>
              );

            case 'image':
              return (
                <div className="mb-4">
                  <img
                    src={String(block.content.url) || '/placeholder.svg'}
                    alt={String(block.content.alt) || ''}
                    className="max-w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              );

            case 'video':
              return (
                <div className="mb-4 aspect-video">
                  <iframe
                    src={String(block.content.url)}
                    title={String(block.content.title) || 'Video'}
                    className="w-full h-full rounded-lg shadow-md"
                    allowFullScreen
                  />
                </div>
              );

            case 'button':
              return (
                <button
                  className={`px-4 py-2 rounded mb-4 ${
                    block.content.variant === 'outline'
                      ? 'border border-primary text-primary'
                      : block.content.variant === 'ghost'
                      ? 'text-primary hover:bg-primary/10'
                      : 'bg-primary text-white'
                  }`}
                >
                  {String(block.content.text) || 'Button'}
                </button>
              );

            case 'hero':
              return <HomeHero content={block.content} />;

            case 'features':
              return <Features content={block.content} />;

            case 'game_changer':
              return <GameChanger content={block.content} />;

            case 'store_brands':
              return <StoreBrands content={block.content} />;

            case 'sustainability':
              return <Sustainability content={block.content} />;

            case 'testimonials':
              const testimonials = Array.isArray(block.content.testimonials) 
                ? block.content.testimonials.map(mapTestimonial)
                : [];
              return <Testimonials content={{
                ...block.content as TestimonialsContent,
                testimonials
              }} />;

            case 'blog_preview':
              return <BlogPreview content={block.content} />;

            case 'product_carousel':
              return <ProductCarousel content={block.content} />;

            case 'competitor_comparison':
              return <CompetitorComparison content={block.content} />;

            case 'about_hero_section':
              return <AboutHeroSection content={block.content} />;

            case 'about_story':
              return <AboutStory content={block.content} />;

            case 'about_mission':
              return <AboutMission content={block.content} />;

            case 'about_sustainability':
              const stats = Array.isArray(block.content.stats) 
                ? mapSustainabilityStats(block.content.stats)
                : [];
              return <AboutSustainability content={{
                ...block.content as AboutSustainabilityContent,
                stats
              }} />;

            case 'about_team':
              return <AboutTeam content={block.content} />;

            case 'about_customer_impact':
              return <AboutCustomerImpact content={block.content} />;

            case 'contact_hero':
              return <ContactHero content={block.content} />;

            case 'contact_details':
              return <ContactDetails content={block.content} />;

            case 'contact_form':
              return <ContactForm content={block.content} />;

            case 'contact_faq':
              return <ContactFAQ content={block.content} />;

            default:
              return (
                <div className={`p-4 border border-dashed rounded-lg ${
                  selectedBlockId === block.id ? 'border-primary bg-primary/5' : 'border-gray-300'
                }`}>
                  {block.type} component
                </div>
              );
          }
        })()}
      </div>
    );

    return (
      <div 
        key={block.id} 
        className={cn(
          "relative w-full",
          selectedBlockId === block.id && "ring-2 ring-primary ring-opacity-50",
          !isAdmin && "mb-0"
        )}
      >
        {blockContent}
      </div>
    );
  };

  return (
    <div className="w-full">
      {blocks.length > 0 ? (
        blocks.map((block) => renderBlock(block))
      ) : (
        <div className="text-center text-gray-500 py-8">
          No content blocks yet. Click "Add Component" to get started.
        </div>
      )}
    </div>
  );
};
