import { motion } from "framer-motion";
import { ContentBlock } from "@/types/content-blocks";
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
    
    const blockContent = (() => {
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
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          );

        case 'video':
          return (
            <div className="mb-4 aspect-video">
              <iframe
                src={String(block.content.url)}
                title={String(block.content.title) || 'Video'}
                className="w-full h-full rounded-lg"
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
          return <Testimonials content={block.content} />;
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
          return <AboutSustainability content={block.content as any} />;
        case 'about_team':
          return <AboutTeam content={block.content} />;
        case 'about_customer_impact':
          return <AboutCustomerImpact content={block.content as any} />;
        case 'contact_hero':
          return <ContactHero content={block.content} />;
        case 'contact_details':
          return <ContactDetails content={block.content} />;
        case 'contact_form':
          return <ContactForm content={block.content} />;
        case 'contact_faq':
          return <ContactFAQ content={block.content} />;
        default:
          return null;
      }
    })();

    return (
      <motion.div 
        key={block.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "w-full transition-all duration-200",
          selectedBlockId === block.id && "ring-2 ring-primary ring-opacity-50 rounded-lg"
        )}
        onClick={() => onSelectBlock(block)}
      >
        {blockContent}
      </motion.div>
    );
  };

  return (
    <div className="w-full space-y-4">
      {blocks.length > 0 ? (
        blocks.map((block) => renderBlock(block))
      ) : (
        <div className="text-center text-muted-foreground py-8">
          No content blocks yet. Click "Add Component" to get started.
        </div>
      )}
    </div>
  );
};
