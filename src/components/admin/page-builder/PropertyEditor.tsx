import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ContentBlock, BlockContent } from "@/types/content-blocks";

interface PropertyEditorProps {
  block: ContentBlock;
  onUpdate: (id: string, content: BlockContent) => void;
}

export const PropertyEditor = ({ block, onUpdate }: PropertyEditorProps) => {
  const [content, setContent] = useState<BlockContent>(block.content);

  const handleChange = (key: string, value: string) => {
    const newContent = { ...content, [key]: value };
    setContent(newContent);
    onUpdate(block.id, newContent);
  };

  const renderFields = () => {
    switch (block.type) {
      case 'heading':
        return (
          <div className="space-y-4">
            <div>
              <Label>Text</Label>
              <Input
                value={content.text || ''}
                onChange={(e) => handleChange('text', e.target.value)}
              />
            </div>
            <div>
              <Label>Size</Label>
              <select
                className="w-full border rounded-md p-2"
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
          <div>
            <Label>Content</Label>
            <Input
              value={content.text || ''}
              onChange={(e) => handleChange('text', e.target.value)}
            />
          </div>
        );

      case 'image':
        return (
          <div className="space-y-4">
            <div>
              <Label>Image URL</Label>
              <Input
                value={content.url || ''}
                onChange={(e) => handleChange('url', e.target.value)}
              />
            </div>
            <div>
              <Label>Alt Text</Label>
              <Input
                value={content.alt || ''}
                onChange={(e) => handleChange('alt', e.target.value)}
              />
            </div>
          </div>
        );

      case 'button':
        return (
          <div className="space-y-4">
            <div>
              <Label>Text</Label>
              <Input
                value={content.text || ''}
                onChange={(e) => handleChange('text', e.target.value)}
              />
            </div>
            <div>
              <Label>URL</Label>
              <Input
                value={content.url || ''}
                onChange={(e) => handleChange('url', e.target.value)}
              />
            </div>
            <div>
              <Label>Style</Label>
              <select
                className="w-full border rounded-md p-2"
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