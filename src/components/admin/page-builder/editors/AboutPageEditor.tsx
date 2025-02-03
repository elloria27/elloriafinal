import { useEffect, useState } from "react";
import { ContentBlock, BlockContent } from "@/types/content-blocks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AboutPageEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const AboutPageEditor = ({ block, onUpdate }: AboutPageEditorProps) => {
  const [content, setContent] = useState<BlockContent>(block.content);

  // Reset content when block changes
  useEffect(() => {
    console.log('Block changed in AboutPageEditor:', block);
    setContent(block.content);
  }, [block.id, block.content]);

  const handleChange = (key: string, value: string | number | boolean | string[] | null) => {
    const updatedContent = { ...content, [key]: value };
    setContent(updatedContent);
    onUpdate(block.id, updatedContent);
  };

  console.log('Rendering AboutPageEditor with block type:', block.type);
  console.log('Current content:', content);

  switch (block.type) {
    case 'about_hero_section':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={(content.title as string) || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter section title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={(content.subtitle as string) || ''}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              placeholder="Enter section subtitle"
            />
          </div>
        </div>
      );

    case 'about_story':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="content">Story Content</Label>
            <Textarea
              id="content"
              value={(content.content as string) || ''}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="Enter the story content"
            />
          </div>
        </div>
      );

    case 'about_mission':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="mission">Mission Statement</Label>
            <Textarea
              id="mission"
              value={(content.description as string) || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter the mission statement"
            />
          </div>
        </div>
      );

    case 'about_team':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="team">Team Description</Label>
            <Textarea
              id="team"
              value={(content.description as string) || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter team description"
            />
          </div>
        </div>
      );

    case 'about_customer_impact':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="impact">Customer Impact</Label>
            <Textarea
              id="impact"
              value={(content.description as string) || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter customer impact description"
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