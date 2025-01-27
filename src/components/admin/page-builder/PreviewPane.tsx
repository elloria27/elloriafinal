import { ContentBlock, BlockContent } from "@/types/content-blocks";
import { Button } from "@/components/ui/button";
import { Edit2, ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface PreviewPaneProps {
  blocks: ContentBlock[];
  onSelectBlock: (block: ContentBlock) => void;
  onMoveBlock?: (blockId: string, direction: 'up' | 'down') => void;
  onDeleteBlock?: (blockId: string) => void;
}

export const PreviewPane = ({ 
  blocks, 
  onSelectBlock, 
  onMoveBlock,
  onDeleteBlock 
}: PreviewPaneProps) => {
  const getContentValue = (content: BlockContent, key: string): any => {
    return (content as any)[key];
  };

  const handleMove = (blockId: string, direction: 'up' | 'down') => {
    if (onMoveBlock) {
      onMoveBlock(blockId, direction);
      toast.success(`Block moved ${direction}`);
    }
  };

  const handleDelete = (blockId: string) => {
    if (onDeleteBlock) {
      onDeleteBlock(blockId);
      toast.success("Block deleted");
    }
  };

  const renderBlock = (block: ContentBlock, index: number) => {
    console.log('Rendering block:', block);
    
    const blockContent = (
      <div className="group relative">
        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelectBlock(block)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          {index > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleMove(block.id, 'up')}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          )}
          {index < blocks.length - 1 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleMove(block.id, 'down')}
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(block.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {(() => {
          switch (block.type) {
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
      <div key={block.id} className="mb-6 relative hover:bg-gray-50 rounded-lg p-2 transition-colors">
        {blockContent}
      </div>
    );
  };

  return (
    <div className="p-8 bg-white rounded-lg shadow-sm">
      {blocks.length > 0 ? (
        blocks.map((block, index) => renderBlock(block, index))
      ) : (
        <div className="text-center text-gray-500 py-8">
          No content blocks yet. Click "Add Component" to get started.
        </div>
      )}
    </div>
  );
};
