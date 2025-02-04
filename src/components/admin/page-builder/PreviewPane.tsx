import { ContentBlock, BlockContent, HeroContent, FeaturesContent } from "@/types/content-blocks";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { HomeHero } from "@/components/home/HomeHero";
import { Features } from "@/components/Features";

interface PreviewPaneProps {
  blocks: ContentBlock[];
  onSelectBlock: (block: ContentBlock) => void;
  selectedBlockId?: string;
  isAdmin?: boolean;
}

export const PreviewPane = ({ blocks, onSelectBlock, selectedBlockId, isAdmin = false }: PreviewPaneProps) => {
  const getContentValue = (content: BlockContent, key: string): any => {
    return (content as any)[key];
  };

  const renderBlock = (block: ContentBlock) => {
    console.log('Rendering block:', block);
    
    const blockContent = (
      <div className="group relative">
        {isAdmin && (
          <Button
            variant={selectedBlockId === block.id ? "default" : "ghost"}
            size="sm"
            className={`absolute right-2 top-2 ${
              selectedBlockId === block.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            } transition-opacity`}
            onClick={() => onSelectBlock(block)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        )}

        {isAdmin ? (
          <div className={`p-4 border border-dashed rounded-lg ${
            selectedBlockId === block.id ? 'border-primary bg-primary/5' : 'border-gray-300'
          }`}>
            {block.type} component
          </div>
        ) : (
          (() => {
            switch (block.type) {
              case 'hero':
                return <HomeHero content={block.content as HeroContent} />;

              case 'features':
                return <Features content={block.content as FeaturesContent} />;

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
                  <div className="p-4 border border-dashed rounded-lg border-gray-300">
                    {block.type} component
                  </div>
                );
            }
          })()
        )}
      </div>
    );

    return (
      <div 
        key={block.id} 
        className={`mb-6 relative rounded-lg p-2 transition-colors ${
          selectedBlockId === block.id ? 'bg-gray-50 ring-2 ring-primary ring-opacity-50' : 'hover:bg-gray-50'
        }`}
      >
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