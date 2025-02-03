import { useEffect, useState } from "react";
import { ContentBlock, BlockContent } from "@/types/content-blocks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CustomSolutionsEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const CustomSolutionsEditor = ({ block, onUpdate }: CustomSolutionsEditorProps) => {
  const [content, setContent] = useState<BlockContent>(block.content);

  // Reset content when block changes
  useEffect(() => {
    console.log('Block changed in CustomSolutionsEditor:', block);
    setContent(block.content);
  }, [block.id, block.content]);

  const handleChange = (key: string, value: any) => {
    const updatedContent = { ...content, [key]: value };
    setContent(updatedContent);
    onUpdate(block.id, updatedContent);
  };

  console.log('Rendering CustomSolutionsEditor with block type:', block.type);
  console.log('Current content:', content);

  switch (block.type) {
    case "custom_solutions_hero":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={content.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter section title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={content.subtitle || ''}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              placeholder="Enter section subtitle"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={content.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter section description"
            />
          </div>
        </div>
      );

    case "custom_solutions_services":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={content.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter section title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={content.subtitle || ''}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              placeholder="Enter section subtitle"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="services">Services</Label>
            <Textarea
              id="services"
              value={content.services ? content.services.join(', ') : ''}
              onChange={(e) => handleChange('services', e.target.value.split(', '))}
              placeholder="Enter services, separated by commas"
            />
          </div>
        </div>
      );

    case "custom_solutions_process":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={content.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter section title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="steps">Steps</Label>
            <Textarea
              id="steps"
              value={content.steps ? content.steps.join(', ') : ''}
              onChange={(e) => handleChange('steps', e.target.value.split(', '))}
              placeholder="Enter steps, separated by commas"
            />
          </div>
        </div>
      );

    case "custom_solutions_cta":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={content.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter section title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={content.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter section description"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="buttonText">Button Text</Label>
            <Input
              id="buttonText"
              value={content.buttonText || ''}
              onChange={(e) => handleChange('buttonText', e.target.value)}
              placeholder="Enter button text"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="buttonLink">Button Link</Label>
            <Input
              id="buttonLink"
              value={content.buttonLink || ''}
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
