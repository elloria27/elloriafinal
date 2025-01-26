import { ContentBlock, BlockContent } from "@/types/content-blocks";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";

interface PreviewPaneProps {
  blocks: ContentBlock[];
  onSelectBlock: (block: ContentBlock) => void;
}

export const PreviewPane = ({ blocks, onSelectBlock }: PreviewPaneProps) => {
  const getContentValue = (content: BlockContent, key: string): any => {
    return (content as any)[key];
  };

  const renderBlock = (block: ContentBlock) => {
    console.log('Rendering block in preview:', block);
    
    const blockContent = (
      <div className="p-4 border border-dashed border-gray-300 rounded-lg">
        {(() => {
          switch (block.type) {
            case 'store_brands':
              const brands = getContentValue(block.content, 'brands') || [];
              return (
                <div className="space-y-2">
                  <h3 className="font-semibold">
                    {getContentValue(block.content, 'title') || 'Store Brands'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {getContentValue(block.content, 'subtitle') || 'Available at retailers'}
                  </p>
                  <div className="text-sm text-gray-500">
                    {Array.isArray(brands) ? (
                      `${brands.length} brands configured`
                    ) : (
                      'No brands configured'
                    )}
                  </div>
                </div>
              );
              
            case 'heading':
              const HeadingTag = (getContentValue(block.content, 'size') || 'h2') as keyof JSX.IntrinsicElements;
              return (
                <HeadingTag className="text-4xl font-bold mb-4">
                  {getContentValue(block.content, 'text') || 'Heading'}
                </HeadingTag>
              );

            case 'text':
              return (
                <p className="text-gray-600 mb-4 whitespace-pre-wrap">
                  {getContentValue(block.content, 'text') || 'Text block'}
                </p>
              );

            case 'image':
              return (
                <div className="mb-4">
                  <img
                    src={getContentValue(block.content, 'url') || '/placeholder.svg'}
                    alt={getContentValue(block.content, 'alt') || ''}
                    className="max-w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              );

            case 'video':
              return (
                <div className="mb-4 aspect-video">
                  <iframe
                    src={getContentValue(block.content, 'url')}
                    title={getContentValue(block.content, 'title') || 'Video'}
                    className="w-full h-full rounded-lg shadow-md"
                    allowFullScreen
                  />
                </div>
              );

            case 'button':
              return (
                <button
                  className={`px-4 py-2 rounded mb-4 ${
                    getContentValue(block.content, 'variant') === 'outline'
                      ? 'border border-primary text-primary'
                      : getContentValue(block.content, 'variant') === 'ghost'
                      ? 'text-primary hover:bg-primary/10'
                      : 'bg-primary text-white'
                  }`}
                >
                  {getContentValue(block.content, 'text') || 'Button'}
                </button>
              );

            default:
              return (
                <div className="p-4 border border-dashed border-gray-300 rounded-lg">
                  {block.type} component
                </div>
              );
          }
        })()}
      </div>
    );

    return (
      <div key={block.id} className="mb-6 relative group">
        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onSelectBlock(block)}
            className="h-8 w-8"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        </div>
        {blockContent}
      </div>
    );
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-sm">
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