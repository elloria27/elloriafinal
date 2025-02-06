import { motion } from "framer-motion";
import { ContentBlock, BlockContent, DonationHeroContent, DonationImpactContent, DonationFormContent, DonationStoriesContent, DonationPartnersContent, DonationFAQContent, DonationJoinMovementContent, SustainabilityContent, TestimonialsContent, AboutCustomerImpactContent } from "@/types/content-blocks";
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
import { BusinessContact } from "@/components/contact/BusinessContact";
import { DonationHero } from "@/components/donation/DonationHero";
import { DonationImpact } from "@/components/donation/DonationImpact";
import { DonationForm } from "@/components/donation/DonationForm";
import { DonationStories } from "@/components/donation/DonationStories";
import { DonationPartners } from "@/components/donation/DonationPartners";
import { DonationFAQ } from "@/components/donation/DonationFAQ";
import { DonationJoinMovement } from "@/components/donation/DonationJoinMovement";
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
          if (isAdmin) {
            return (
              <div 
                className="p-4 border border-dashed rounded-lg border-gray-300 bg-gray-50/50"
                onClick={() => onSelectBlock(block)}
              >
                <div className="font-medium text-lg mb-1">{block.type}</div>
                <div className="text-sm text-gray-500">Click to edit content</div>
              </div>
            );
          }

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

            case 'spacer': {
              const height = block.content.height;
              const indent = block.content.indent;
              
              const getPixelValue = (value: unknown): string => {
                if (typeof value === 'number') return `${value}px`;
                if (typeof value === 'string') return value.includes('px') ? value : `${value}px`;
                return '32px'; // Default value
              };

              return (
                <div style={{ 
                  height: getPixelValue(height),
                  marginLeft: getPixelValue(indent),
                  marginRight: getPixelValue(indent)
                }} />
              );
            }

            case 'contact_business':
              return <BusinessContact content={block.content} />;

            case 'hero':
              return <HomeHero content={block.content} />;

            case 'features':
              return <Features content={block.content} />;

            case 'game_changer':
              return <GameChanger content={block.content} />;

            case 'store_brands':
              return <StoreBrands content={block.content} />;

            case 'sustainability':
              const sustainabilityContent = block.content as SustainabilityContent;
              return <Sustainability content={sustainabilityContent} />;

            case 'testimonials':
              const testimonialsContent = block.content as TestimonialsContent;
              return <Testimonials content={testimonialsContent} />;

            case 'about_customer_impact':
              const customerImpactContent = block.content;
              return <AboutCustomerImpact content={{
                title: String(customerImpactContent.title || ''),
                description: String(customerImpactContent.description || ''),
                stats: customerImpactContent.stats?.map(stat => ({
                  value: String(stat.value || ''),
                  label: String(stat.label || '')
                })) || [],
                testimonials: customerImpactContent.testimonials?.map(t => ({
                  quote: String(t.quote || ''),
                  author: String(t.author || ''),
                  role: String(t.role || ''),
                  rating: Number(t.rating || 5)
                })) || []
              }} />;

            case 'donation_hero':
              return <DonationHero content={block.content as DonationHeroContent} />;

            case 'donation_impact':
              return <DonationImpact content={block.content as DonationImpactContent} />;

            case 'donation_form':
              return <DonationForm content={block.content as DonationFormContent} />;

            case 'donation_stories':
              return <DonationStories content={block.content as DonationStoriesContent} />;

            case 'donation_partners':
              return <DonationPartners content={block.content as DonationPartnersContent} />;

            case 'donation_faq':
              return <DonationFAQ content={block.content as DonationFAQContent} />;

            case 'donation_join_movement':
              return <DonationJoinMovement content={block.content as DonationJoinMovementContent} />;

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
          "relative w-full mb-4",
          selectedBlockId === block.id && "ring-2 ring-primary ring-opacity-50"
        )}
      >
        {blockContent}
      </div>
    );
  };

  return (
    <div className="w-full min-h-0 relative bg-white">
      {blocks.length > 0 ? (
        <div>
          {blocks.map((block) => renderBlock(block))}
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-gray-500 text-center">
            <p className="text-lg font-medium">No content blocks yet.</p>
            <p className="mt-2">Click "Add Component" to get started.</p>
          </div>
        </div>
      )}
    </div>
  );
};
