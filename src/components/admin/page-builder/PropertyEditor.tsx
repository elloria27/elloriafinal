import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContentBlock, BlockContent, FeatureItem } from "@/types/content-blocks";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface PropertyEditorProps {
  block: ContentBlock;
  onUpdate: (id: string, content: BlockContent) => void;
}

const availableIcons = ["Shrink", "Shield", "Droplets", "Leaf", "Heart", "Sparkles", "Recycle", "Package", "Factory"];

export const PropertyEditor = ({ block, onUpdate }: PropertyEditorProps) => {
  const [content, setContent] = useState<BlockContent>(block.content);

  const handleChange = (key: string, value: any) => {
    console.log('Updating content:', key, value);
    const newContent = { ...content, [key]: value };
    setContent(newContent);
    onUpdate(block.id, newContent);
  };

  const getFeatures = (): FeatureItem[] => {
    if (!content || !('features' in content)) {
      return [];
    }

    const features = content.features;
    if (!Array.isArray(features)) {
      return [];
    }

    return features.map(feature => {
      if (typeof feature === 'object' && feature !== null) {
        return {
          icon: String(feature.icon || 'Shield'),
          title: String(feature.title || ''),
          description: String(feature.description || ''),
          detail: String(feature.detail || '')
        };
      }
      return {
        icon: 'Shield',
        title: '',
        description: '',
        detail: ''
      };
    });
  };

  const handleFeatureChange = (index: number, field: keyof FeatureItem, value: string) => {
    const features = getFeatures();
    const newFeatures = [...features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    handleChange('features', newFeatures);
  };

  const addFeature = () => {
    const newFeature: FeatureItem = {
      icon: "Shield",
      title: "New Feature",
      description: "Feature description",
      detail: ""
    };
    
    const features = getFeatures();
    handleChange('features', [...features, newFeature]);
  };

  const removeFeature = (index: number) => {
    const features = getFeatures();
    const newFeatures = features.filter((_, i) => i !== index);
    handleChange('features', newFeatures);
  };

  const getContentValue = (key: string): string => {
    if (!content) return '';
    return (content as any)[key]?.toString() || '';
  };

  const renderFields = () => {
    console.log('Rendering fields for block type:', block.type);
    console.log('Current content:', content);

    switch (block.type) {
      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={getContentValue('title')}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter hero title"
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={getContentValue('subtitle')}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                placeholder="Enter hero subtitle"
              />
            </div>
            <div>
              <Label>Video URL</Label>
              <Input
                value={getContentValue('videoUrl')}
                onChange={(e) => handleChange('videoUrl', e.target.value)}
                placeholder="Enter video URL"
              />
            </div>
          </div>
        );

      case 'features':
      case 'elevating_essentials':
        return (
          <div className="space-y-6">
            <div>
              <Label>Title</Label>
              <Input
                value={getContentValue('title')}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter section title"
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={getContentValue('subtitle')}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                placeholder="Enter section subtitle"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={getContentValue('description')}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter section description"
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Features</Label>
                <Button onClick={addFeature} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Feature
                </Button>
              </div>
              {getFeatures().map((feature, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <Label>Feature {index + 1}</Label>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeFeature(index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                  <div>
                    <Label>Icon</Label>
                    <Select
                      value={feature.icon}
                      onValueChange={(value) => handleFeatureChange(index, 'icon', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableIcons.map((icon) => (
                          <SelectItem key={icon} value={icon}>
                            {icon}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={feature.title}
                      onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                      placeholder="Enter feature title"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={feature.description}
                      onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                      placeholder="Enter feature description"
                    />
                  </div>
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
                value={getContentValue('title')}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter section title"
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={getContentValue('subtitle')}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                placeholder="Enter section subtitle"
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Features</Label>
                <Button onClick={addFeature} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Feature
                </Button>
              </div>
              {getFeatures().map((feature, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <Label>Feature {index + 1}</Label>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeFeature(index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                  <div>
                    <Label>Icon</Label>
                    <Select
                      value={feature.icon}
                      onValueChange={(value) => handleFeatureChange(index, 'icon', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableIcons.map((icon) => (
                          <SelectItem key={icon} value={icon}>
                            {icon}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={feature.title}
                      onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                      placeholder="Enter feature title"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={feature.description}
                      onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                      placeholder="Enter feature description"
                    />
                  </div>
                  <div>
                    <Label>Detail</Label>
                    <Textarea
                      value={feature.detail}
                      onChange={(e) => handleFeatureChange(index, 'detail', e.target.value)}
                      placeholder="Enter additional details"
                    />
                  </div>
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
                value={getContentValue('title')}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter section title"
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={getContentValue('subtitle')}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                placeholder="Enter section subtitle"
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Brands</Label>
                <Button onClick={addFeature} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Brand
                </Button>
              </div>
              {getFeatures().map((feature, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <Label>Brand {index + 1}</Label>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeFeature(index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={feature.title}
                      onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                      placeholder="Enter brand name"
                    />
                  </div>
                  <div>
                    <Label>Logo URL</Label>
                    <Input
                      value={feature.description}
                      onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                      placeholder="Enter logo URL"
                    />
                  </div>
                  <div>
                    <Label>Link</Label>
                    <Input
                      value={feature.detail || ''}
                      onChange={(e) => handleFeatureChange(index, 'detail', e.target.value)}
                      placeholder="Enter brand link"
                    />
                  </div>
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
                value={getContentValue('title')}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter section title"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={getContentValue('description')}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter section description"
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Stats</Label>
                <Button onClick={addFeature} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Stat
                </Button>
              </div>
              {getFeatures().map((feature, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <Label>Stat {index + 1}</Label>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeFeature(index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                  <div>
                    <Label>Icon</Label>
                    <Select
                      value={feature.icon}
                      onValueChange={(value) => handleFeatureChange(index, 'icon', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableIcons.map((icon) => (
                          <SelectItem key={icon} value={icon}>
                            {icon}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={feature.title}
                      onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                      placeholder="Enter stat title"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={feature.description}
                      onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                      placeholder="Enter stat description"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'testimonials':
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={getContentValue('title')}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter section title"
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Testimonials</Label>
                <Button onClick={addFeature} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Testimonial
                </Button>
              </div>
              {getFeatures().map((feature, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <Label>Testimonial {index + 1}</Label>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeFeature(index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                  <div>
                    <Label>Name</Label>
                    <Input
                      value={feature.title}
                      onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                      placeholder="Enter customer name"
                    />
                  </div>
                  <div>
                    <Label>Text</Label>
                    <Textarea
                      value={feature.description}
                      onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                      placeholder="Enter testimonial text"
                    />
                  </div>
                  <div>
                    <Label>Source</Label>
                    <Input
                      value={feature.detail || ''}
                      onChange={(e) => handleFeatureChange(index, 'detail', e.target.value)}
                      placeholder="Enter testimonial source"
                    />
                  </div>
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
                value={getContentValue('title')}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter section title"
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={getContentValue('subtitle')}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                placeholder="Enter section subtitle"
              />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Articles</Label>
                <Button onClick={addFeature} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Article
                </Button>
              </div>
              {getFeatures().map((feature, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <Label>Article {index + 1}</Label>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeFeature(index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={feature.title}
                      onChange={(e) => handleFeatureChange(index, 'title', e.target.value)}
                      placeholder="Enter article title"
                    />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Input
                      value={feature.description}
                      onChange={(e) => handleFeatureChange(index, 'description', e.target.value)}
                      placeholder="Enter article category"
                    />
                  </div>
                  <div>
                    <Label>Image URL</Label>
                    <Input
                      value={feature.detail || ''}
                      onChange={(e) => handleFeatureChange(index, 'detail', e.target.value)}
                      placeholder="Enter article image URL"
                    />
                  </div>
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
                value={getContentValue('title')}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter newsletter title"
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={getContentValue('subtitle')}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                placeholder="Enter newsletter subtitle"
              />
            </div>
            <div>
              <Label>Button Text</Label>
              <Input
                value={getContentValue('buttonText')}
                onChange={(e) => handleChange('buttonText', e.target.value)}
                placeholder="Enter button text"
              />
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