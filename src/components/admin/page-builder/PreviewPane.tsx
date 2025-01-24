import { ContentBlock } from "@/types/content-blocks";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";

interface PreviewPaneProps {
  blocks: ContentBlock[];
  onSelectBlock: (block: ContentBlock) => void;
}

export const PreviewPane = ({ blocks, onSelectBlock }: PreviewPaneProps) => {
  const renderBlock = (block: ContentBlock) => {
    const blockContent = (
      <div className="group relative">
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onSelectBlock(block)}
        >
          <Edit2 className="h-4 w-4" />
        </Button>

        {(() => {
          switch (block.type) {
            case 'heading':
              const HeadingTag = (block.content.size?.toString() || 'h2') as keyof JSX.IntrinsicElements;
              return (
                <HeadingTag className="text-4xl font-bold mb-4">
                  {block.content.text?.toString() || 'Heading'}
                </HeadingTag>
              );

            case 'text':
              return (
                <p className="text-gray-600 mb-4 whitespace-pre-wrap">
                  {block.content.text?.toString() || 'Text block'}
                </p>
              );

            case 'image':
              return (
                <div className="mb-4">
                  <img
                    src={block.content.url?.toString() || '/placeholder.svg'}
                    alt={block.content.alt?.toString() || ''}
                    className="max-w-full h-auto rounded-lg shadow-md"
                  />
                </div>
              );

            case 'video':
              return (
                <div className="mb-4 aspect-video">
                  <iframe
                    src={block.content.url?.toString()}
                    title={block.content.title?.toString() || 'Video'}
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
                  {block.content.text?.toString() || 'Button'}
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
      {blocks.map((block) => renderBlock(block))}
      {blocks.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          No content blocks yet. Click "Add Component" to get started.
        </div>
      )}
    </div>
  );
};