import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ContentBlock, BlockContent } from "@/types/content-blocks";

interface PropertyEditorProps {
  block: ContentBlock;
  onUpdate: (id: string, content: BlockContent) => void;
}

export const PropertyEditor = ({ block, onUpdate }: PropertyEditorProps) => {
  const [content, setContent] = useState<BlockContent>(block.content);

  const handleChange = (key: string, value: string) => {
    console.log('Updating content:', key, value);
    const newContent = { ...content, [key]: value };
    setContent(newContent);
    onUpdate(block.id, newContent);
  };

  const getContentValue = (key: string): string => {
    return (content as any)[key]?.toString() || '';
  };

  const renderFields = () => {
    console.log('Rendering fields for block type:', block.type);
    console.log('Current content:', content);

    switch (block.type) {
      case 'hero':
      case 'elevating_essentials':
      case 'game_changer':
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={getContentValue('title')}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter title"
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={getContentValue('subtitle')}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                placeholder="Enter subtitle"
              />
            </div>
            {block.type === 'hero' && (
              <div>
                <Label>Video URL</Label>
                <Input
                  value={getContentValue('videoUrl')}
                  onChange={(e) => handleChange('videoUrl', e.target.value)}
                  placeholder="Enter video URL"
                />
              </div>
            )}
          </div>
        );

      case 'features':
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={getContentValue('title')}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter features section title"
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={getContentValue('subtitle')}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                placeholder="Enter features section subtitle"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={getContentValue('description')}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter features section description"
              />
            </div>
          </div>
        );

      case 'heading':
        return (
          <div className="space-y-4">
            <div>
              <Label>Text</Label>
              <Input
                value={getContentValue('text')}
                onChange={(e) => handleChange('text', e.target.value)}
                placeholder="Enter heading text"
              />
            </div>
            <div>
              <Label>Size</Label>
              <select
                className="w-full border rounded-md p-2"
                value={getContentValue('size') || 'h2'}
                onChange={(e) => handleChange('size', e.target.value)}
              >
                <option value="h1">H1</option>
                <option value="h2">H2</option>
                <option value="h3">H3</option>
                <option value="h4">H4</option>
              </select>
            </div>
          </div>
        );

      case 'text':
        return (
          <div>
            <Label>Content</Label>
            <Textarea
              value={getContentValue('text')}
              onChange={(e) => handleChange('text', e.target.value)}
              placeholder="Enter text content"
              className="min-h-[100px]"
            />
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <Label>Image URL</Label>
              <Input
                value={getContentValue('url')}
                onChange={(e) => handleChange('url', e.target.value)}
                placeholder="Enter image URL"
              />
            </div>
            <div>
              <Label>Alt Text</Label>
              <Input
                value={getContentValue('alt')}
                onChange={(e) => handleChange('alt', e.target.value)}
                placeholder="Enter alt text"
              />
            </div>
            {getContentValue('url') && (
              <div className="mt-4">
                <img
                  src={getContentValue('url')}
                  alt={getContentValue('alt')}
                  className="max-w-full h-auto rounded-md"
                />
              </div>
            )}
          </div>
        );

      case 'video':
        return (
          <div className="space-y-4">
            <div>
              <Label>Video URL</Label>
              <Input
                value={getContentValue('url')}
                onChange={(e) => handleChange('url', e.target.value)}
                placeholder="Enter video URL (YouTube, Vimeo, etc.)"
              />
            </div>
            <div>
              <Label>Title</Label>
              <Input
                value={getContentValue('title')}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter video title"
              />
            </div>
            {getContentValue('url') && (
              <div className="mt-4 aspect-video">
                <iframe
                  src={getContentValue('url')}
                  title={getContentValue('title')}
                  className="w-full h-full rounded-md"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        );

      case 'button':
        return (
          <div className="space-y-4">
            <div>
              <Label>Text</Label>
              <Input
                value={getContentValue('text')}
                onChange={(e) => handleChange('text', e.target.value)}
                placeholder="Enter button text"
              />
            </div>
            <div>
              <Label>URL</Label>
              <Input
                value={getContentValue('url')}
                onChange={(e) => handleChange('url', e.target.value)}
                placeholder="Enter button URL"
              />
            </div>
            <div>
              <Label>Style</Label>
              <select
                className="w-full border rounded-md p-2"
                value={getContentValue('variant') || 'default'}
                onChange={(e) => handleChange('variant', e.target.value)}
              >
                <option value="default">Default</option>
                <option value="outline">Outline</option>
                <option value="ghost">Ghost</option>
              </select>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-gray-500 italic">
            No editable properties for this component type.
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">
        Edit {block.type.charAt(0).toUpperCase() + block.type.slice(1)}
      </h3>
      {renderFields()}
    </div>
  );
};