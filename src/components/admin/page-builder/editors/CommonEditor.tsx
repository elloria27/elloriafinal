import { useEffect, useState } from "react";
import { ContentBlock, BlockContent } from "@/types/content-blocks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CommonEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const CommonEditor = ({ block, onUpdate }: CommonEditorProps) => {
  const [content, setContent] = useState<BlockContent>(block.content);

  // Reset content when block changes
  useEffect(() => {
    console.log('Block changed in CommonEditor:', block);
    setContent(block.content);
  }, [block.id, block.content]);

  const handleChange = (key: string, value: any) => {
    const updatedContent = { ...content, [key]: value };
    setContent(updatedContent);
    onUpdate(block.id, updatedContent);
  };

  console.log('Rendering CommonEditor with block type:', block.type);
  console.log('Current content:', content);

  switch (block.type) {
    case 'heading':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text">Heading Text</Label>
            <Input
              id="text"
              value={content.text || ''}
              onChange={(e) => handleChange('text', e.target.value)}
              placeholder="Enter heading text"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="size">Heading Size</Label>
            <select
              id="size"
              value={content.size || 'h2'}
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
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text">Text Content</Label>
            <Textarea
              id="text"
              value={content.text || ''}
              onChange={(e) => handleChange('text', e.target.value)}
              placeholder="Enter text content"
            />
          </div>
        </div>
      );

    case 'image':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Image URL</Label>
            <Input
              id="url"
              value={content.url || ''}
              onChange={(e) => handleChange('url', e.target.value)}
              placeholder="Enter image URL"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="alt">Alt Text</Label>
            <Input
              id="alt"
              value={content.alt || ''}
              onChange={(e) => handleChange('alt', e.target.value)}
              placeholder="Enter alt text"
            />
          </div>
        </div>
      );

    case 'video':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">Video URL</Label>
            <Input
              id="url"
              value={content.url || ''}
              onChange={(e) => handleChange('url', e.target.value)}
              placeholder="Enter video URL"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Video Title</Label>
            <Input
              id="title"
              value={content.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter video title"
            />
          </div>
        </div>
      );

    case 'button':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text">Button Text</Label>
            <Input
              id="text"
              value={content.text || ''}
              onChange={(e) => handleChange('text', e.target.value)}
              placeholder="Enter button text"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="url">Button URL</Label>
            <Input
              id="url"
              value={content.url || ''}
              onChange={(e) => handleChange('url', e.target.value)}
              placeholder="Enter button URL"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="variant">Button Variant</Label>
            <select
              id="variant"
              value={content.variant || 'default'}
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
        <div className="p-4 text-center text-gray-500">
          No properties available for this component type
        </div>
      );
  }
};
