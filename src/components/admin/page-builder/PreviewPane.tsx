import { ContentBlock, BlockContent } from "@/types/content-blocks";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";

interface PreviewPaneProps {
  blocks: ContentBlock[];
  onSelectBlock: (block: ContentBlock) => void;
}

interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

export const PreviewPane = ({ blocks, onSelectBlock }: PreviewPaneProps) => {
  const getContentValue = (content: BlockContent, key: string): any => {
    return (content as any)[key];
  };

  const getTimelineItems = (content: BlockContent): TimelineItem[] => {
    if (!content || !('timeline' in content)) {
      return [];
    }
    const timeline = content.timeline;
    if (!Array.isArray(timeline)) {
      return [];
    }
    return timeline.map(item => ({
      year: String(item.year || ''),
      title: String(item.title || ''),
      description: String(item.description || '')
    }));
  };

  const renderBlock = (block: ContentBlock) => {
    console.log('Rendering block:', block);
    
    const blockContent = (
      <div className="group relative">
        <Button
          variant="ghost"
          size="sm"
          className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
          onClick={() => onSelectBlock(block)}
        >
          <Edit2 className="h-4 w-4" />
        </Button>

        {(() => {
          switch (block.type) {
            case 'about_story':
              return (
                <div className="p-6 bg-white rounded-lg border border-gray-200 space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">
                      {getContentValue(block.content, 'title') || 'Our Story'}
                    </h3>
                    <p className="text-gray-600">
                      {getContentValue(block.content, 'subtitle') || 'Our journey through the years'}
                    </p>
                  </div>
                  
                  {getContentValue(block.content, 'videoUrl') && (
                    <div className="bg-gray-50 rounded p-3">
                      <p className="text-sm text-gray-600">
                        Video URL: {getContentValue(block.content, 'videoUrl')}
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    <h4 className="font-medium">Timeline Milestones:</h4>
                    {getTimelineItems(block.content).map((item, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-semibold text-primary">{item.year}</span>
                          <span className="text-gray-900">{item.title}</span>
                        </div>
                        <p className="text-sm text-gray-600">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );

            case 'heading':
              const HeadingTag = (getContentValue(block.content, 'size') || 'h2') as keyof JSX.IntrinsicElements;
              return (
                <div className="p-6 bg-white rounded-lg border border-gray-200">
                  <HeadingTag className="text-4xl font-bold">
                    {getContentValue(block.content, 'text') || 'Heading'}
                  </HeadingTag>
                </div>
              );

            case 'text':
              return (
                <div className="p-6 bg-white rounded-lg border border-gray-200">
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {getContentValue(block.content, 'text') || 'Text block'}
                  </p>
                </div>
              );

            case 'image':
              return (
                <div className="p-6 bg-white rounded-lg border border-gray-200">
                  <img
                    src={getContentValue(block.content, 'url') || '/placeholder.svg'}
                    alt={getContentValue(block.content, 'alt') || ''}
                    className="max-w-full h-auto rounded-lg"
                  />
                </div>
              );

            case 'video':
              return (
                <div className="p-6 bg-white rounded-lg border border-gray-200">
                  <div className="aspect-video">
                    <iframe
                      src={getContentValue(block.content, 'url')}
                      title={getContentValue(block.content, 'title') || 'Video'}
                      className="w-full h-full rounded-lg"
                      allowFullScreen
                    />
                  </div>
                </div>
              );

            case 'button':
              return (
                <div className="p-6 bg-white rounded-lg border border-gray-200">
                  <button
                    className={`px-4 py-2 rounded ${
                      getContentValue(block.content, 'variant') === 'outline'
                        ? 'border border-primary text-primary'
                        : getContentValue(block.content, 'variant') === 'ghost'
                        ? 'text-primary hover:bg-primary/10'
                        : 'bg-primary text-white'
                    }`}
                  >
                    {getContentValue(block.content, 'text') || 'Button'}
                  </button>
                </div>
              );

            default:
              return (
                <div className="p-6 bg-white rounded-lg border border-gray-200">
                  <div className="text-gray-500 italic">
                    {block.type} component
                  </div>
                </div>
              );
          }
        })()}
      </div>
    );

    return (
      <div key={block.id} className="mb-6">
        {blockContent}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
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
