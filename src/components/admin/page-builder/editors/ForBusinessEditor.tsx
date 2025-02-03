import { useEffect, useState } from "react";
import { ContentBlock, BlockContent } from "@/types/content-blocks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ForBusinessEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const ForBusinessEditor = ({ block, onUpdate }: ForBusinessEditorProps) => {
  const [content, setContent] = useState<BlockContent>(block.content);

  // Reset content when block changes
  useEffect(() => {
    console.log('Block changed in ForBusinessEditor:', block);
    setContent(block.content);
  }, [block.id, block.content]);

  const handleChange = (key: string, value: string | number | boolean | string[] | null) => {
    const updatedContent = { ...content, [key]: value };
    setContent(updatedContent);
    onUpdate(block.id, updatedContent);
  };

  console.log('Rendering ForBusinessEditor with block type:', block.type);
  console.log('Current content:', content);

  switch (block.type) {
    case "business_hero":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={(content.title as string) || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={(content.subtitle as string) || ''}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              placeholder="Enter subtitle"
            />
          </div>
        </div>
      );

    case "business_solutions":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={(content.title as string) || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={(content.description as string) || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter description"
            />
          </div>
        </div>
      );

    case "business_contact":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={(content.email as string) || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Enter email"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="buttonText">Button Text</Label>
            <Input
              id="buttonText"
              value={(content.buttonText as string) || ''}
              onChange={(e) => handleChange('buttonText', e.target.value)}
              placeholder="Enter button text"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="buttonLink">Button Link</Label>
            <Input
              id="buttonLink"
              value={(content.buttonLink as string) || ''}
              onChange={(e) => handleChange('buttonLink', e.target.value)}
              placeholder="Enter button link"
            />
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