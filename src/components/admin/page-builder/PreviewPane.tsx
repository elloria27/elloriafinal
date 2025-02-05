import { motion } from "framer-motion";
import { ContentBlock, BlockContent } from "@/types/content-blocks";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { DonationHero } from "@/components/donation/DonationHero";
import { DonationImpact } from "@/components/donation/DonationImpact";
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
  isAdmin = false,
}: PreviewPaneProps) => {
  const renderBlock = (block: ContentBlock) => {
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
                className="p-8 border border-dashed rounded-lg border-gray-300 bg-gray-50/50"
                onClick={() => onSelectBlock(block)}
              >
                <div className="font-medium text-lg mb-1">{block.type}</div>
                <div className="text-sm text-gray-500">Click to edit content</div>
              </div>
            );
          }

          switch (block.type) {
            case "donation_hero":
              return <DonationHero content={block.content} />;
            case "donation_impact":
              return <DonationImpact content={block.content} />;
            case "donation_stories":
              return <DonationStories content={block.content} />;
            case "donation_partners":
              return <DonationPartners content={block.content} />;
            case "donation_faq":
              return <DonationFAQ content={block.content} />;
            case "donation_join_movement":
              return <DonationJoinMovement content={block.content} />;
            default:
              return (
                <div className="p-4 border border-dashed rounded-lg">
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