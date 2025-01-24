import { ContentBlock } from "./PageBuilder";

interface PreviewPaneProps {
  blocks: ContentBlock[];
}

export const PreviewPane = ({ blocks }: PreviewPaneProps) => {
  const renderBlock = (block: ContentBlock) => {
    switch (block.type) {
      case 'heading':
        const HeadingTag = block.content.size || 'h2';
        return (
          <HeadingTag className="text-4xl font-bold mb-4">
            {block.content.text || 'Heading'}
          </HeadingTag>
        );

      case 'text':
        return (
          <p className="text-gray-600 mb-4">
            {block.content.text || 'Text block'}
          </p>
        );

      case 'image':
        return (
          <img
            src={block.content.url || '/placeholder.svg'}
            alt={block.content.alt || ''}
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
            {block.content.text || 'Button'}
          </button>
        );

      // Add more cases for other component types

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