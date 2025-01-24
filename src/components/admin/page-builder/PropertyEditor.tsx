import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ContentBlock } from "@/types/content-blocks";

interface PropertyEditorProps {
  block: ContentBlock;
  onUpdate: (id: string, content: ContentBlock['content']) => void;
}

export const PropertyEditor = ({ block, onUpdate }: PropertyEditorProps) => {
  const [content, setContent] = useState<typeof block.content>(block.content);

  const handleChange = (key: string, value: string) => {
    console.log('Updating content:', key, value);
    const newContent = { ...content, [key]: value };
    setContent(newContent);
    onUpdate(block.id, newContent);
  };

  const renderFields = () => {
    console.log('Rendering fields for block type:', block.type);
    console.log('Current content:', content);

    switch (block.type) {
      case 'heading':
        return (
          <div className="space-y-4">
            <div>
              <Label>Text</Label>
              <Input
                value={content.text?.toString() || ''}
                onChange={(e) => handleChange('text', e.target.value)}
                placeholder="Enter heading text"
              />
            </div>
            <div>
              <Label>Size</Label>
              <select
                className="w-full border rounded-md p-2"
                value={content.size?.toString() || 'h2'}
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
              value={content.text?.toString() || ''}
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
                value={content.url?.toString() || ''}
                onChange={(e) => handleChange('url', e.target.value)}
                placeholder="Enter image URL"
              />
            </div>
            <div>
              <Label>Alt Text</Label>
              <Input
                value={content.alt?.toString() || ''}
                onChange={(e) => handleChange('alt', e.target.value)}
                placeholder="Enter alt text"
              />
            </div>
            {content.url && (
              <div className="mt-4">
                <img
                  src={content.url.toString()}
                  alt={content.alt?.toString() || ''}
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
                value={content.url?.toString() || ''}
                onChange={(e) => handleChange('url', e.target.value)}
                placeholder="Enter video URL (YouTube, Vimeo, etc.)"
              />
            </div>
            <div>
              <Label>Title</Label>
              <Input
                value={content.title?.toString() || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter video title"
              />
            </div>
            {content.url && (
              <div className="mt-4 aspect-video">
                <iframe
                  src={content.url.toString()}
                  title={content.title?.toString() || 'Video'}
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
                value={content.text?.toString() || ''}
                onChange={(e) => handleChange('text', e.target.value)}
                placeholder="Enter button text"
              />
            </div>
            <div>
              <Label>URL</Label>
              <Input
                value={content.url?.toString() || ''}
                onChange={(e) => handleChange('url', e.target.value)}
                placeholder="Enter button URL"
              />
            </div>
            <div>
              <Label>Style</Label>
              <select
                className="w-full border rounded-md p-2"
                value={content.variant?.toString() || 'default'}
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