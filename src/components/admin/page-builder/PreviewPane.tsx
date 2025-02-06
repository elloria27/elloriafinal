import { motion } from "framer-motion";
import { ContentBlock, BlockContent } from "@/types/content-blocks";
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
import { cn } from "@/lib/utils";
import { SustainabilityHero } from "@/components/sustainability/SustainabilityHero";
import { SustainabilityMission } from "@/components/sustainability/SustainabilityMission";
import { SustainabilityMaterials } from "@/components/sustainability/SustainabilityMaterials";
import { SustainabilityFAQ } from "@/components/sustainability/SustainabilityFAQ";
import { SustainabilityCTA } from "@/components/sustainability/SustainabilityCTA";
import { Json } from "@/integrations/supabase/types";

const defaultContent = {
  sustainability_hero: {
    title: "Caring for Women, Caring for the Planet",
    description: "Discover how Elloria is leading the way in sustainable feminine care",
    backgroundImage: "/lovable-uploads/033d3c83-3a91-4fee-a121-d5e700b8768d.png"
  },
  sustainability_mission: {
    title: "Our Sustainability Mission",
    description: "At Elloria, we believe that premium feminine care shouldn't come at the cost of our planet.",
    stats: [
      {
        icon: "Leaf",
        value: "72%",
        label: "Recyclable Materials",
        description: "Our products are made with eco-friendly materials"
      }
    ]
  },
  sustainability_materials: {
    title: "Sustainable Materials",
    description: "Our products are crafted with carefully selected materials that minimize environmental impact.",
    materials: [
      {
        icon: "TreePine",
        title: "Eco-Friendly Materials",
        description: "Sustainable and comfortable materials"
      }
    ]
  },
  sustainability_faq: {
    title: "Frequently Asked Questions",
    description: "Get answers to common questions about our sustainable practices and products.",
    faqs: [
      {
        question: "Are Elloria products sustainable?",
        answer: "Yes, our products are made with eco-friendly materials and sustainable practices."
      }
    ]
  },
  sustainability_cta: {
    title: "Join Our Sustainable Journey",
    description: "Subscribe to our newsletter for updates on our latest sustainability initiatives.",
    buttonText: "Learn More",
    buttonLink: "/sustainability"
  }
} as const;

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
    
    const getDefaultContent = (type: string): Json => {
      return defaultContent[type as keyof typeof defaultContent] as unknown as Json || {};
    };

    const mergedContent = {
      ...getDefaultContent(block.type),
      ...block.content
    } as Json;

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
            case 'sustainability_hero':
              return <SustainabilityHero content={mergedContent} />;
            
            case 'sustainability_mission':
              return <SustainabilityMission content={mergedContent} />;
            
            case 'sustainability_materials':
              return <SustainabilityMaterials content={mergedContent} />;
            
            case 'sustainability_faq':
              return <SustainabilityFAQ content={mergedContent} />;
            
            case 'sustainability_cta':
              return <SustainabilityCTA content={mergedContent} />;

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
