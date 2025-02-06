import { motion } from "framer-motion";
import { ContentBlock, BlockContent, DonationHeroContent, DonationImpactContent, DonationFormContent, DonationStoriesContent, DonationPartnersContent, DonationFAQContent, DonationJoinMovementContent, SustainabilityContent, TestimonialsContent, AboutCustomerImpactContent } from "@/types/content-blocks";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, LayoutPanelLeft } from "lucide-react";
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

const PlaceholderComponent = ({ type, content }: { type: string; content: BlockContent }) => {
  return (
    <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
      <div className="flex items-center gap-2 text-gray-600">
        <LayoutPanelLeft className="h-5 w-5" />
        <span className="font-medium">{type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
      </div>
      {content && (
        <div className="mt-2 text-sm text-gray-500">
          {Object.entries(content).map(([key, value]) => {
            if (typeof value === 'string' && key !== 'type') {
              return (
                <div key={key} className="mt-1">
                  <span className="font-medium">{key}:</span> {value.substring(0, 50)}{value.length > 50 ? '...' : ''}
                </div>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
};

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
            return <PlaceholderComponent type={block.type} content={block.content} />;
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
              return <Sustainability content={block.content as SustainabilityContent} />;

            case 'testimonials':
              return <Testimonials content={block.content as TestimonialsContent} />;

            case 'about_customer_impact':
              return <AboutCustomerImpact content={block.content as AboutCustomerImpactContent} />;

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
            case 'business_hero':
              return (
                <div className="bg-primary-50 py-12 px-4 sm:px-6 lg:px-8">
                  <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                      {block.content.title}
                    </h1>
                    <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                      {block.content.subtitle}
                    </p>
                    {block.content.buttonText && (
                      <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                        <Button>
                          {block.content.buttonText}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );

            case 'business_solutions':
              return (
                <div className="py-12 bg-white">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                      <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        {block.content.title}
                      </h2>
                      <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                        {block.content.description}
                      </p>
                    </div>

                    <div className="mt-10">
                      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {block.content.solutions?.map((solution, index) => (
                          <div key={index} className="pt-6">
                            <div className="flow-root bg-gray-50 rounded-lg px-6 pb-8">
                              <div className="-mt-6">
                                <div>
                                  <span className="inline-flex items-center justify-center p-3 bg-primary rounded-md shadow-lg">
                                    {/* Use Lucide icon dynamically */}
                                    {solution.icon}
                                  </span>
                                </div>
                                <h3 className="mt-8 text-lg font-medium tracking-tight text-gray-900">
                                  {solution.title}
                                </h3>
                                <p className="mt-5 text-base text-gray-500">
                                  {solution.description}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );

            case 'business_contact':
              return (
                <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
                  <div className="max-w-7xl mx-auto text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                      {block.content.title}
                    </h2>
                    <p className="mt-4 text-lg text-gray-500">
                      {block.content.description}
                    </p>
                    {block.content.email && (
                      <p className="mt-2 text-lg font-medium text-primary">
                        {block.content.email}
                      </p>
                    )}
                    {block.content.buttonText && (
                      <div className="mt-8">
                        <Button>
                          {block.content.buttonText}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );

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
