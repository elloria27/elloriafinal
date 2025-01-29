import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { BlockContent, ContentBlock } from "@/types/content-blocks";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PropertyEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const PropertyEditor = ({ block, onUpdate }: PropertyEditorProps) => {
  const [content, setContent] = useState<BlockContent>(block.content);

  const handleChange = (key: string, value: any) => {
    const updatedContent = { ...content, [key]: value };
    setContent(updatedContent);
    onUpdate(block.id, updatedContent);
  };

  const handleArrayChange = (key: string, index: number, field: string, value: any) => {
    const array = [...(content[key] || [])];
    array[index] = { ...array[index], [field]: value };
    handleChange(key, array);
  };

  const renderFields = () => {
    switch (block.type) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={content.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={content.subtitle || ''}
                onChange={(e) => handleChange('subtitle', e.target.value)}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={content.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>
            <div>
              <Label>Button Text</Label>
              <Input
                value={content.buttonText || ''}
                onChange={(e) => handleChange('buttonText', e.target.value)}
              />
            </div>
            <div>
              <Label>Button Link</Label>
              <Input
                value={content.buttonLink || ''}
                onChange={(e) => handleChange('buttonLink', e.target.value)}
              />
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={content.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={content.subtitle || ''}
                onChange={(e) => handleChange('subtitle', e.target.value)}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={content.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>
            <div className="space-y-4">
              <Label>Features</Label>
              {(content.features || []).map((feature: any, index: number) => (
                <div key={index} className="space-y-2 p-4 border rounded">
                  <Input
                    placeholder="Icon name"
                    value={feature.icon || ''}
                    onChange={(e) => handleArrayChange('features', index, 'icon', e.target.value)}
                  />
                  <Input
                    placeholder="Title"
                    value={feature.title || ''}
                    onChange={(e) => handleArrayChange('features', index, 'title', e.target.value)}
                  />
                  <Textarea
                    placeholder="Description"
                    value={feature.description || ''}
                    onChange={(e) => handleArrayChange('features', index, 'description', e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'game_changer':
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={content.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={content.subtitle || ''}
                onChange={(e) => handleChange('subtitle', e.target.value)}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={content.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>
            <div className="space-y-4">
              <Label>Features</Label>
              {(content.features || []).map((feature: any, index: number) => (
                <div key={index} className="space-y-2 p-4 border rounded">
                  <Input
                    placeholder="Icon name"
                    value={feature.icon || ''}
                    onChange={(e) => handleArrayChange('features', index, 'icon', e.target.value)}
                  />
                  <Input
                    placeholder="Title"
                    value={feature.title || ''}
                    onChange={(e) => handleArrayChange('features', index, 'title', e.target.value)}
                  />
                  <Input
                    placeholder="Description"
                    value={feature.description || ''}
                    onChange={(e) => handleArrayChange('features', index, 'description', e.target.value)}
                  />
                  <Input
                    placeholder="Detail"
                    value={feature.detail || ''}
                    onChange={(e) => handleArrayChange('features', index, 'detail', e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'store_brands':
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={content.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={content.subtitle || ''}
                onChange={(e) => handleChange('subtitle', e.target.value)}
              />
            </div>
            <div className="space-y-4">
              <Label>Features (Brands)</Label>
              {(content.features || []).map((feature: any, index: number) => (
                <div key={index} className="space-y-2 p-4 border rounded">
                  <Input
                    placeholder="Title"
                    value={feature.title || ''}
                    onChange={(e) => handleArrayChange('features', index, 'title', e.target.value)}
                  />
                  <Input
                    placeholder="Description (Logo URL)"
                    value={feature.description || ''}
                    onChange={(e) => handleArrayChange('features', index, 'description', e.target.value)}
                  />
                  <Input
                    placeholder="Detail (Link)"
                    value={feature.detail || ''}
                    onChange={(e) => handleArrayChange('features', index, 'detail', e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'sustainability':
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={content.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={content.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>
            <div className="space-y-4">
              <Label>Stats</Label>
              {(content.stats || []).map((stat: any, index: number) => (
                <div key={index} className="space-y-2 p-4 border rounded">
                  <Input
                    placeholder="Icon"
                    value={stat.icon || ''}
                    onChange={(e) => handleArrayChange('stats', index, 'icon', e.target.value)}
                  />
                  <Input
                    placeholder="Title"
                    value={stat.title || ''}
                    onChange={(e) => handleArrayChange('stats', index, 'title', e.target.value)}
                  />
                  <Input
                    placeholder="Description"
                    value={stat.description || ''}
                    onChange={(e) => handleArrayChange('stats', index, 'description', e.target.value)}
                  />
                  <Input
                    placeholder="Color"
                    value={stat.color || ''}
                    onChange={(e) => handleArrayChange('stats', index, 'color', e.target.value)}
                  />
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <Label>Timeline Items</Label>
              {(content.timelineItems || []).map((item: string, index: number) => (
                <Input
                  key={index}
                  value={item}
                  onChange={(e) => {
                    const newItems = [...(content.timelineItems || [])];
                    newItems[index] = e.target.value;
                    handleChange('timelineItems', newItems);
                  }}
                />
              ))}
            </div>
          </div>
        );

      case 'product_carousel':
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={content.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={content.subtitle || ''}
                onChange={(e) => handleChange('subtitle', e.target.value)}
              />
            </div>
          </div>
        );

      case 'testimonials':
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={content.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            <div className="space-y-4">
              <Label>Testimonials</Label>
              {(content.testimonials || []).map((testimonial: any, index: number) => (
                <div key={index} className="space-y-2 p-4 border rounded">
                  <Input
                    placeholder="Name"
                    value={testimonial.name || ''}
                    onChange={(e) => handleArrayChange('testimonials', index, 'name', e.target.value)}
                  />
                  <Input
                    placeholder="Rating (1-5)"
                    type="number"
                    min="1"
                    max="5"
                    value={testimonial.rating || 5}
                    onChange={(e) => handleArrayChange('testimonials', index, 'rating', parseInt(e.target.value))}
                  />
                  <Textarea
                    placeholder="Text"
                    value={testimonial.text || ''}
                    onChange={(e) => handleArrayChange('testimonials', index, 'text', e.target.value)}
                  />
                  <Input
                    placeholder="Source"
                    value={testimonial.source || ''}
                    onChange={(e) => handleArrayChange('testimonials', index, 'source', e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'blog_preview':
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={content.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={content.subtitle || ''}
                onChange={(e) => handleChange('subtitle', e.target.value)}
              />
            </div>
            <div className="space-y-4">
              <Label>Articles</Label>
              {(content.articles || []).map((article: any, index: number) => (
                <div key={index} className="space-y-2 p-4 border rounded">
                  <Input
                    placeholder="Title"
                    value={article.title || ''}
                    onChange={(e) => handleArrayChange('articles', index, 'title', e.target.value)}
                  />
                  <Input
                    placeholder="Category"
                    value={article.category || ''}
                    onChange={(e) => handleArrayChange('articles', index, 'category', e.target.value)}
                  />
                  <Input
                    placeholder="Image URL"
                    value={article.image || ''}
                    onChange={(e) => handleArrayChange('articles', index, 'image', e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>
        );

      case 'newsletter':
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={content.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={content.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>
            <div>
              <Label>Button Text</Label>
              <Input
                value={content.buttonText || ''}
                onChange={(e) => handleChange('buttonText', e.target.value)}
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

  return (
    <ScrollArea className="h-[calc(100vh-8rem)] px-4">
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Edit {block.type}</h3>
        </div>
        {renderFields()}
      </div>
    </ScrollArea>
  );
};