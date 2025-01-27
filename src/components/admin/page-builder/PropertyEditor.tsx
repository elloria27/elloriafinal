import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContentBlock, BlockContent, FeatureItem, SustainabilityContent, CompetitorComparisonContent } from "@/types/content-blocks";
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

  const getSustainabilityStats = () => {
    if (!content || !('stats' in content)) return [];
    const sustainabilityContent = content as SustainabilityContent;
    return Array.isArray(sustainabilityContent.stats) ? sustainabilityContent.stats : [];
  };

  const getTimelineItems = () => {
    if (!content || !('timelineItems' in content)) return [];
    const sustainabilityContent = content as SustainabilityContent;
    return Array.isArray(sustainabilityContent.timelineItems) ? sustainabilityContent.timelineItems : [];
  };

  const getMetrics = () => {
    if (!content || !('metrics' in content)) {
      return [];
    }

    const metrics = (content as CompetitorComparisonContent).metrics;
    if (!Array.isArray(metrics)) {
      return [];
    }

    return metrics.map(metric => ({
      category: String(metric.category || ''),
      elloria: Number(metric.elloria || 0),
      competitors: Number(metric.competitors || 0),
      icon: String(metric.icon || 'Shield'),
      description: String(metric.description || '')
    }));
  };

  const renderFields = () => {
    console.log('Rendering fields for block type:', block.type);
    console.log('Current content:', content);

    switch (block.type) {
      case 'product_carousel':
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
            <div>
              <Label>Description</Label>
              <Textarea
                value={getContentValue('description')}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter section description"
              />
            </div>
          </div>
        );

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
            
            {/* Stats Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Stats</Label>
                <Button 
                  onClick={() => {
                    const currentStats = getSustainabilityStats();
                    handleChange('stats', [...currentStats, {
                      icon: "Recycle",
                      title: "New Stat Title",
                      description: "Enter description",
                      color: "bg-accent-green"
                    }]);
                  }} 
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Stat
                </Button>
              </div>
              
              {getSustainabilityStats().map((stat, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <Label>Stat {index + 1}</Label>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        const newStats = [...getSustainabilityStats()];
                        newStats.splice(index, 1);
                        handleChange('stats', newStats);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                  
                  <div>
                    <Label>Icon</Label>
                    <Select
                      value={stat.icon}
                      onValueChange={(value) => {
                        const newStats = [...getSustainabilityStats()];
                        newStats[index] = { ...newStats[index], icon: value };
                        handleChange('stats', newStats);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                      <SelectContent>
                        {['Recycle', 'Package', 'Factory', 'Leaf'].map((icon) => (
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
                      value={stat.title}
                      onChange={(e) => {
                        const newStats = [...getSustainabilityStats()];
                        newStats[index] = { ...newStats[index], title: e.target.value };
                        handleChange('stats', newStats);
                      }}
                      placeholder="Enter stat title"
                    />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={stat.description}
                      onChange={(e) => {
                        const newStats = [...getSustainabilityStats()];
                        newStats[index] = { ...newStats[index], description: e.target.value };
                        handleChange('stats', newStats);
                      }}
                      placeholder="Enter stat description"
                    />
                  </div>
                  
                  <div>
                    <Label>Color</Label>
                    <Select
                      value={stat.color}
                      onValueChange={(value) => {
                        const newStats = [...getSustainabilityStats()];
                        newStats[index] = { ...newStats[index], color: value };
                        handleChange('stats', newStats);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select color" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          { label: 'Green', value: 'bg-accent-green' },
                          { label: 'Purple', value: 'bg-accent-purple' },
                          { label: 'Peach', value: 'bg-accent-peach' }
                        ].map((color) => (
                          <SelectItem key={color.value} value={color.value}>
                            {color.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Timeline Items Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Timeline Items</Label>
                <Button 
                  onClick={() => {
                    const currentItems = getTimelineItems();
                    handleChange('timelineItems', [...currentItems, "New Timeline Item"]);
                  }} 
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Timeline Item
                </Button>
              </div>
              
              {getTimelineItems().map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={item}
                    onChange={(e) => {
                      const newItems = [...getTimelineItems()];
                      newItems[index] = e.target.value;
                      handleChange('timelineItems', newItems);
                    }}
                    placeholder="Enter timeline item"
                  />
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      const newItems = [...getTimelineItems()];
                      newItems.splice(index, 1);
                      handleChange('timelineItems', newItems);
                    }}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'competitor_comparison':
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
              <Label>Button Text</Label>
              <Input
                value={getContentValue('buttonText')}
                onChange={(e) => handleChange('buttonText', e.target.value)}
                placeholder="Enter button text"
              />
            </div>
            <div>
              <Label>Button URL</Label>
              <Input
                value={getContentValue('buttonUrl')}
                onChange={(e) => handleChange('buttonUrl', e.target.value)}
                placeholder="Enter button URL"
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Metrics</Label>
                <Button 
                  onClick={() => {
                    const currentMetrics = getMetrics();
                    handleChange('metrics', [...currentMetrics, {
                      category: "New Metric",
                      elloria: 90,
                      competitors: 70,
                      icon: "Shield",
                      description: "Enter description"
                    }]);
                  }} 
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Metric
                </Button>
              </div>
              
              {getMetrics().map((metric, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <Label>Metric {index + 1}</Label>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        const newMetrics = [...getMetrics()];
                        newMetrics.splice(index, 1);
                        handleChange('metrics', newMetrics);
                      }}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                  
                  <div>
                    <Label>Category</Label>
                    <Input
                      value={metric.category}
                      onChange={(e) => {
                        const newMetrics = [...getMetrics()];
                        newMetrics[index] = { ...newMetrics[index], category: e.target.value };
                        handleChange('metrics', newMetrics);
                      }}
                      placeholder="Enter category name"
                    />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={metric.description}
                      onChange={(e) => {
                        const newMetrics = [...getMetrics()];
                        newMetrics[index] = { ...newMetrics[index], description: e.target.value };
                        handleChange('metrics', newMetrics);
                      }}
                      placeholder="Enter metric description"
                    />
                  </div>

                  <div>
                    <Label>Icon</Label>
                    <Select
                      value={metric.icon}
                      onValueChange={(value) => {
                        const newMetrics = [...getMetrics()];
                        newMetrics[index] = { ...newMetrics[index], icon: value };
                        handleChange('metrics', newMetrics);
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select icon" />
                      </SelectTrigger>
                      <SelectContent>
                        {['Shield', 'Leaf', 'Heart', 'Sparkles'].map((icon) => (
                          <SelectItem key={icon} value={icon}>
                            {icon}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Elloria Score (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={metric.elloria}
                      onChange={(e) => {
                        const newMetrics = [...getMetrics()];
                        newMetrics[index] = { ...newMetrics[index], elloria: parseInt(e.target.value) || 0 };
                        handleChange('metrics', newMetrics);
                      }}
                    />
                  </div>

                  <div>
                    <Label>Competitors Score (%)</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={metric.competitors}
                      onChange={(e) => {
                        const newMetrics = [...getMetrics()];
                        newMetrics[index] = { ...newMetrics[index], competitors: parseInt(e.target.value) || 0 };
                        handleChange('metrics', newMetrics);
                      }}
                    />
                  </div>
                </div>
              ))}
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

