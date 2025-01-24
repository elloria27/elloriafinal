import { ContentBlock } from "@/types/content-blocks";

interface PreviewPaneProps {
  blocks: ContentBlock[];
}

export const PreviewPane = ({ blocks }: PreviewPaneProps) => {
  const renderBlock = (block: ContentBlock) => {
    switch (block.type) {
      case 'heading':
        return (
          <div className={`text-4xl font-bold mb-4 ${block.content.size?.toString() || 'h2'}`}>
            {block.content.text?.toString() || 'Heading'}
          </div>
        );

      case 'text':
        return (
          <p className="text-gray-600 mb-4">
            {block.content.text?.toString() || 'Text block'}
          </p>
        );

      case 'image':
        return (
          <img
            src={block.content.url?.toString() || '/placeholder.svg'}
            alt={block.content.alt?.toString() || ''}
            className="max-w-full h-auto mb-4"
          />
        );

      case 'button':
        return (
          <button
            className={`px-4 py-2 rounded ${
              block.content.variant === 'outline'
                ? 'border border-primary text-primary'
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
  };

  return (
    <div className="p-8 bg-white">
      {blocks.map((block) => (
        <div key={block.id} className="mb-6">
          {renderBlock(block)}
        </div>
      ))}
    </div>
  );
};