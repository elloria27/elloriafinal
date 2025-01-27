import { ContentBlock, BlockContent } from "@/types/content-blocks";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";
import { motion } from "framer-motion";

interface PreviewPaneProps {
  blocks: ContentBlock[];
  onSelectBlock: (block: ContentBlock) => void;
}

export const PreviewPane = ({ blocks, onSelectBlock }: PreviewPaneProps) => {
  const getContentValue = (content: BlockContent, key: string): any => {
    return (content as any)[key];
  };

  const renderBlock = (block: ContentBlock) => {
    console.log('Rendering block:', block);
    
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
            case 'about_story':
              const timeline = Array.isArray(block.content.timeline) 
                ? block.content.timeline 
                : [];
              
              return (
                <section className="py-24 bg-white">
                  <div className="container px-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6 }}
                      className="max-w-6xl mx-auto text-center mb-24"
                    >
                      <h2 className="text-4xl font-bold mb-4">
                        {getContentValue(block.content, 'title') || 'Our Journey'}
                      </h2>
                      <p className="text-gray-600 mb-12">
                        {getContentValue(block.content, 'subtitle') || 'Milestones that shaped who we are today'}
                      </p>
                      <div className="aspect-video w-full">
                        <iframe
                          className="w-full h-full rounded-3xl shadow-2xl"
                          src={getContentValue(block.content, 'videoUrl') || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
                          title="Our Journey Video"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    </motion.div>
                    <div className="max-w-4xl mx-auto">
                      <div className="space-y-12">
                        {timeline.map((item: any, index: number) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className={`flex ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'} items-center gap-8`}
                          >
                            <div className="w-32 flex-shrink-0 text-center">
                              <span className="text-3xl font-bold text-primary">{item.year}</span>
                            </div>
                            <div className={`flex-1 p-6 bg-gray-50 rounded-lg shadow-sm ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
                              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                              <p className="text-gray-600">{item.description}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
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
      <div key={block.id} className="mb-6 relative hover:bg-gray-50 rounded-lg p-2 transition-colors">
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