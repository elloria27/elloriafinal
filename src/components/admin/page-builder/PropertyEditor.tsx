import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContentBlock, BlockContent, CompetitorComparisonContent, HeroContent, FeaturesContent, GameChangerContent, StoreBrandsContent, SustainabilityContent, ProductCarouselContent } from "@/types/content-blocks";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface PropertyEditorProps {
  block: ContentBlock;
  onUpdate: (id: string, content: BlockContent) => void;
}

const availableIcons = ["Shield", "Leaf", "Heart", "Sparkles"];

export const PropertyEditor = ({ block, onUpdate }: PropertyEditorProps) => {
  const [content, setContent] = useState<BlockContent>(block.content);

  useEffect(() => {
    console.log('Block content updated:', block.content);
    setContent(block.content);
  }, [block.content]);

  const handleChange = (key: string, value: any) => {
    console.log('Updating content:', key, value);
    const newContent = { ...content, [key]: value };
    setContent(newContent);
    onUpdate(block.id, newContent);
  };

  const handleMetricChange = (index: number, field: string, value: any) => {
    if (!content || !('metrics' in content)) return;
    
    const metrics = [...(content as CompetitorComparisonContent).metrics || []];
    metrics[index] = { ...metrics[index], [field]: field === 'elloria' || field === 'competitors' ? Number(value) : value };
    handleChange('metrics', metrics);
  };

  const handleFeatureChange = (index: number, field: string, value: string) => {
    const features = [...((content as FeaturesContent).features || [])];
    features[index] = { ...features[index], [field]: value };
    handleChange('features', features);
  };

  const handleBrandChange = (index: number, field: string, value: string) => {
    const brands = [...((content as StoreBrandsContent).brands || [])];
    brands[index] = { ...brands[index], [field]: value };
    handleChange('brands', brands);
  };

  const handleStatChange = (index: number, field: string, value: string) => {
    const stats = [...((content as SustainabilityContent).stats || [])];
    stats[index] = { ...stats[index], [field]: value };
    handleChange('stats', stats);
  };

  const addMetric = () => {
    const newMetric = {
      category: "New Category",
      elloria: 90,
      competitors: 70,
      icon: "Shield",
      description: "Description"
    };

    if (!content || !('metrics' in content)) {
      handleChange('metrics', [newMetric]);
    } else {
      const metrics = [...((content as CompetitorComparisonContent).metrics || [])];
      metrics.push(newMetric);
      handleChange('metrics', metrics);
    }
  };

  const addFeature = () => {
    const newFeature = {
      icon: "Shield",
      title: "New Feature",
      description: "Feature Description"
    };

    const features = [...((content as FeaturesContent).features || [])];
    features.push(newFeature);
    handleChange('features', features);
  };

  const addBrand = () => {
    const newBrand = {
      name: "New Brand",
      logo: "/placeholder.svg",
      link: "#"
    };

    const brands = [...((content as StoreBrandsContent).brands || [])];
    brands.push(newBrand);
    handleChange('brands', brands);
  };

  const addStat = () => {
    const newStat = {
      icon: "Shield",
      title: "New Stat",
      description: "Stat Description",
      color: "blue"
    };

    const stats = [...((content as SustainabilityContent).stats || [])];
    stats.push(newStat);
    handleChange('stats', stats);
  };

  const removeItem = (key: string, index: number) => {
    const items = [...(content as any)[key]];
    items.splice(index, 1);
    handleChange(key, items);
  };

  const getContentValue = (key: string): string => {
    if (!content) return '';
    return (content as any)[key]?.toString() || '';
  };

  const renderHeroFields = () => (
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

  const renderFeaturesFields = () => (
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
          <Button onClick={addFeature} size="sm" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Feature
          </Button>
        </div>
        {(content as FeaturesContent)?.features?.map((feature, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <Label>Feature {index + 1}</Label>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => removeItem('features', index)}
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

  const renderStoreBrandsFields = () => (
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
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Brands</Label>
          <Button onClick={addBrand} size="sm" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Brand
          </Button>
        </div>
        {(content as StoreBrandsContent)?.brands?.map((brand, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <Label>Brand {index + 1}</Label>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => removeItem('brands', index)}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
            <div>
              <Label>Name</Label>
              <Input
                value={brand.name}
                onChange={(e) => handleBrandChange(index, 'name', e.target.value)}
                placeholder="Enter brand name"
              />
            </div>
            <div>
              <Label>Logo URL</Label>
              <Input
                value={brand.logo}
                onChange={(e) => handleBrandChange(index, 'logo', e.target.value)}
                placeholder="Enter logo URL"
              />
            </div>
            <div>
              <Label>Link</Label>
              <Input
                value={brand.link}
                onChange={(e) => handleBrandChange(index, 'link', e.target.value)}
                placeholder="Enter brand link"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSustainabilityFields = () => (
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
        <Label>Description</Label>
        <Textarea
          value={getContentValue('description')}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Enter section description"
        />
      </div>
      <div>
        <Label>Stats Title</Label>
        <Input
          value={getContentValue('statsTitle')}
          onChange={(e) => handleChange('statsTitle', e.target.value)}
          placeholder="Enter stats title"
        />
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Stats</Label>
          <Button onClick={addStat} size="sm" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Stat
          </Button>
        </div>
        {(content as SustainabilityContent)?.stats?.map((stat, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <Label>Stat {index + 1}</Label>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => removeItem('stats', index)}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
            <div>
              <Label>Icon</Label>
              <Select
                value={stat.icon}
                onValueChange={(value) => handleStatChange(index, 'icon', value)}
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
                value={stat.title}
                onChange={(e) => handleStatChange(index, 'title', e.target.value)}
                placeholder="Enter stat title"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={stat.description}
                onChange={(e) => handleStatChange(index, 'description', e.target.value)}
                placeholder="Enter stat description"
              />
            </div>
            <div>
              <Label>Color</Label>
              <Input
                value={stat.color}
                onChange={(e) => handleStatChange(index, 'color', e.target.value)}
                placeholder="Enter color (e.g., blue, green)"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCompetitorComparisonFields = () => (
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
        <Label>Button Link</Label>
        <Input
          value={getContentValue('buttonLink')}
          onChange={(e) => handleChange('buttonLink', e.target.value)}
          placeholder="Enter button link (e.g., /shop)"
        />
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Comparison Metrics</Label>
          <Button onClick={addMetric} size="sm" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Metric
          </Button>
        </div>
        {(content as CompetitorComparisonContent)?.metrics?.map((metric, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <Label>Metric {index + 1}</Label>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => removeItem('metrics', index)}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
            <div>
              <Label>Icon</Label>
              <Select
                value={metric.icon}
                onValueChange={(value) => handleMetricChange(index, 'icon', value)}
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
              <Label>Category</Label>
              <Input
                value={metric.category}
                onChange={(e) => handleMetricChange(index, 'category', e.target.value)}
                placeholder="Enter category name"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea
                value={metric.description}
                onChange={(e) => handleMetricChange(index, 'description', e.target.value)}
                placeholder="Enter metric description"
              />
            </div>
            <div>
              <Label>Elloria Score (%)</Label>
              <Input
                type="number"
                value={metric.elloria}
                onChange={(e) => handleMetricChange(index, 'elloria', e.target.value)}
                placeholder="Enter Elloria score"
              />
            </div>
            <div>
              <Label>Competitors Score (%)</Label>
              <Input
                type="number"
                value={metric.competitors}
                onChange={(e) => handleMetricChange(index, 'competitors', e.target.value)}
                placeholder="Enter competitors score"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderFields = () => {
    console.log('Rendering fields for block type:', block.type);
    console.log('Current content:', content);

    switch (block.type) {
      case 'hero':
        return renderHeroFields();
      case 'elevating_essentials':
      case 'features':
      case 'game_changer':
        return renderFeaturesFields();
      case 'store_brands':
        return renderStoreBrandsFields();
      case 'sustainability':
        return renderSustainabilityFields();
      case 'competitor_comparison':
        return renderCompetitorComparisonFields();
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
            <div>
              <Label>Subtitle</Label>
              <Input
                value={getContentValue('subtitle')}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                placeholder="Enter section subtitle"
              />
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
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 p-4">
      {renderFields()}
    </div>
  );
};