
import { motion } from "framer-motion";
import { ContentBlock, BlockContent } from "@/types/content-blocks";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
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
  
  const renderPlaceholder = (block: ContentBlock) => {
    return (
      <div className={cn(
        "p-6 border-2 border-dashed rounded-lg flex flex-col items-center justify-center space-y-2",
        selectedBlockId === block.id ? "border-primary bg-primary/5" : "border-gray-300"
      )}>
        <div className="text-lg font-medium capitalize">
          {block.type.split('_').join(' ')}
        </div>
        <div className="text-sm text-gray-500">
          Click to edit properties
        </div>
      </div>
    );
  };

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

        {isAdmin ? renderPlaceholder(block) : (
          <>
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

                default:
                  try {
                    // Dynamic import for custom components
                    const path = `@/components/${block.type.split('_').join('/')}`;
                    console.log('Attempting to load component from path:', path);
                    
                    // Use dynamic require for components
                    try {
                      const Component = require(path).default;
                      if (!Component) {
                        throw new Error(`Component not found at path: ${path}`);
                      }
                      return <Component content={block.content} />;
                    } catch (importError) {
                      console.error(`Error importing component from ${path}:`, importError);
                      // For non-admin view, render nothing if component fails to load
                      if (!isAdmin) return null;
                      // For admin view, show error state
                      return (
                        <div className="p-4 border border-red-300 bg-red-50 text-red-700 rounded-lg">
                          Error loading component: {block.type}
                        </div>
                      );
                    }
                  } catch (error) {
                    console.error(`Error in component rendering for ${block.type}:`, error);
                    return null;
                  }
              }
            })()}
          </>
        )}
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

