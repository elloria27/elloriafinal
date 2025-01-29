import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BlockContent, ContentBlock, FeatureItem, CompetitorComparisonContent } from "@/types/content-blocks";
import { Json } from "@/integrations/supabase/types";

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
    if (!Array.isArray(content[key])) return;
    
    const array = [...content[key] as any[]];
    if (array[index] && typeof array[index] === 'object') {
      array[index] = { ...array[index], [field]: value };
      handleChange(key, array);
    }
  };

  const renderFields = () => {
    switch (block.type) {
      case 'features':
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={String(content.title || '')}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={String(content.subtitle || '')}
                onChange={(e) => handleChange('subtitle', e.target.value)}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={String(content.description || '')}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>
            <div className="space-y-4">
              <Label>Features</Label>
              {Array.isArray(content.features) && (content.features as FeatureItem[]).map((feature: FeatureItem, index: number) => (
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

      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={String(content.title || '')}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={String(content.subtitle || '')}
                onChange={(e) => handleChange('subtitle', e.target.value)}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={String(content.description || '')}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>
            <div>
              <Label>Video URL</Label>
              <Input
                value={String(content.videoUrl || '')}
                onChange={(e) => handleChange('videoUrl', e.target.value)}
              />
            </div>
          </div>
        );

      case 'game_changer':
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={String(content.title || '')}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={String(content.subtitle || '')}
                onChange={(e) => handleChange('subtitle', e.target.value)}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={String(content.description || '')}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>
            <div className="space-y-4">
              <Label>Features</Label>
              {Array.isArray(content.features) && content.features.map((feature: any, index: number) => (
                <div key={index} className="space-y-2 p-4 border rounded">
                  <Input
                    placeholder="Icon name"
                    value={String(feature.icon || '')}
                    onChange={(e) => handleArrayChange('features', index, 'icon', e.target.value)}
                  />
                  <Input
                    placeholder="Title"
                    value={String(feature.title || '')}
                    onChange={(e) => handleArrayChange('features', index, 'title', e.target.value)}
                  />
                  <Textarea
                    placeholder="Description"
                    value={String(feature.description || '')}
                    onChange={(e) => handleArrayChange('features', index, 'description', e.target.value)}
                  />
                  <Input
                    placeholder="Detail"
                    value={String(feature.detail || '')}
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
                value={String(content.title || '')}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={String(content.subtitle || '')}
                onChange={(e) => handleChange('subtitle', e.target.value)}
              />
            </div>
            <div className="space-y-4">
              <Label>Features (Brands)</Label>
              {Array.isArray(content.features) && content.features.map((feature: any, index: number) => (
                <div key={index} className="space-y-2 p-4 border rounded">
                  <Input
                    placeholder="Title"
                    value={String(feature.title || '')}
                    onChange={(e) => handleArrayChange('features', index, 'title', e.target.value)}
                  />
                  <Input
                    placeholder="Description (Logo URL)"
                    value={String(feature.description || '')}
                    onChange={(e) => handleArrayChange('features', index, 'description', e.target.value)}
                  />
                  <Input
                    placeholder="Detail (Link)"
                    value={String(feature.detail || '')}
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
                value={String(content.title || '')}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={String(content.description || '')}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>
            <div className="space-y-4">
              <Label>Stats</Label>
              {Array.isArray(content.stats) && content.stats.map((stat: any, index: number) => (
                <div key={index} className="space-y-2 p-4 border rounded">
                  <Input
                    placeholder="Icon"
                    value={String(stat.icon || '')}
                    onChange={(e) => handleArrayChange('stats', index, 'icon', e.target.value)}
                  />
                  <Input
                    placeholder="Title"
                    value={String(stat.title || '')}
                    onChange={(e) => handleArrayChange('stats', index, 'title', e.target.value)}
                  />
                  <Input
                    placeholder="Description"
                    value={String(stat.description || '')}
                    onChange={(e) => handleArrayChange('stats', index, 'description', e.target.value)}
                  />
                  <Input
                    placeholder="Color"
                    value={String(stat.color || '')}
                    onChange={(e) => handleArrayChange('stats', index, 'color', e.target.value)}
                  />
                </div>
              ))}
            </div>
            <div className="space-y-4">
              <Label>Timeline Items</Label>
              {Array.isArray(content.timelineItems) && content.timelineItems.map((item: string, index: number) => (
                <Input
                  key={index}
                  value={String(item)}
                  onChange={(e) => {
                    const newItems = [...(Array.isArray(content.timelineItems) ? content.timelineItems : [])];
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
                value={String(content.title || '')}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={String(content.subtitle || '')}
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
                value={String(content.title || '')}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            <div className="space-y-4">
              <Label>Testimonials</Label>
              {Array.isArray(content.testimonials) && content.testimonials.map((testimonial: any, index: number) => (
                <div key={index} className="space-y-2 p-4 border rounded">
                  <Input
                    placeholder="Name"
                    value={String(testimonial.name || '')}
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
                    value={String(testimonial.text || '')}
                    onChange={(e) => handleArrayChange('testimonials', index, 'text', e.target.value)}
                  />
                  <Input
                    placeholder="Source"
                    value={String(testimonial.source || '')}
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
                value={String(content.title || '')}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={String(content.subtitle || '')}
                onChange={(e) => handleChange('subtitle', e.target.value)}
              />
            </div>
            <div className="space-y-4">
              <Label>Articles</Label>
              {Array.isArray(content.articles) && content.articles.map((article: any, index: number) => (
                <div key={index} className="space-y-2 p-4 border rounded">
                  <Input
                    placeholder="Title"
                    value={String(article.title || '')}
                    onChange={(e) => handleArrayChange('articles', index, 'title', e.target.value)}
                  />
                  <Input
                    placeholder="Category"
                    value={String(article.category || '')}
                    onChange={(e) => handleArrayChange('articles', index, 'category', e.target.value)}
                  />
                  <Input
                    placeholder="Image URL"
                    value={String(article.image || '')}
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
                value={String(content.title || '')}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={String(content.description || '')}
                onChange={(e) => handleChange('description', e.target.value)}
              />
            </div>
            <div>
              <Label>Button Text</Label>
              <Input
                value={String(content.buttonText || '')}
                onChange={(e) => handleChange('buttonText', e.target.value)}
              />
            </div>
          </div>
        );

      case 'competitor_comparison':
        const comparisonContent = content as CompetitorComparisonContent;
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={String(comparisonContent.title || '')}
                onChange={(e) => handleChange('title', e.target.value)}
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={String(comparisonContent.subtitle || '')}
                onChange={(e) => handleChange('subtitle', e.target.value)}
              />
            </div>
            <div>
              <Label>Button Text</Label>
              <Input
                value={String(comparisonContent.buttonText || '')}
                onChange={(e) => handleChange('buttonText', e.target.value)}
              />
            </div>
            <div>
              <Label>Button URL</Label>
              <Input
                value={String(comparisonContent.buttonUrl || '')}
                onChange={(e) => handleChange('buttonUrl', e.target.value)}
              />
            </div>
            <div className="space-y-4">
              <Label>Metrics</Label>
              {Array.isArray(comparisonContent.metrics) && comparisonContent.metrics.map((metric, index) => (
                <div key={index} className="space-y-2 p-4 border rounded">
                  <Input
                    placeholder="Category"
                    value={String(metric.category || '')}
                    onChange={(e) => handleArrayChange('metrics', index, 'category', e.target.value)}
                  />
                  <Input
                    placeholder="Elloria Score"
                    type="number"
                    value={metric.elloria || 0}
                    onChange={(e) => handleArrayChange('metrics', index, 'elloria', parseInt(e.target.value))}
                  />
                  <Input
                    placeholder="Competitors Score"
                    type="number"
                    value={metric.competitors || 0}
                    onChange={(e) => handleArrayChange('metrics', index, 'competitors', parseInt(e.target.value))}
                  />
                  <Input
                    placeholder="Icon"
                    value={String(metric.icon || '')}
                    onChange={(e) => handleArrayChange('metrics', index, 'icon', e.target.value)}
                  />
                  <Input
                    placeholder="Description"
                    value={String(metric.description || '')}
                    onChange={(e) => handleArrayChange('metrics', index, 'description', e.target.value)}
                  />
                </div>
              ))}
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
