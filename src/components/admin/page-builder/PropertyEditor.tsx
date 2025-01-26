import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ContentBlock, BlockContent, CompetitorComparisonContent } from "@/types/content-blocks";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface PropertyEditorProps {
  block: ContentBlock;
  onUpdate: (id: string, content: BlockContent) => void;
}

const availableIcons = ["Shield", "Leaf", "Heart", "Sparkles"];

export const PropertyEditor = ({ block, onUpdate }: PropertyEditorProps) => {
  const [content, setContent] = useState<BlockContent>(block.content);

  const handleChange = (key: string, value: any) => {
    console.log('Updating content:', key, value);
    const newContent = { ...content, [key]: value };
    setContent(newContent);
    onUpdate(block.id, newContent);
  };

  const handleMetricChange = (index: number, field: string, value: any) => {
    if (!content || !('metrics' in content)) return;
    
    const metrics = [...(content as CompetitorComparisonContent).metrics || []];
    metrics[index] = { ...metrics[index], [field]: value };
    handleChange('metrics', metrics);
  };

  const addMetric = () => {
    if (!content || !('metrics' in content)) {
      const newMetric = {
        category: "New Category",
        elloria: 90,
        competitors: 70,
        icon: "Shield",
        description: "Description"
      };
      handleChange('metrics', [newMetric]);
    } else {
      const metrics = [...((content as CompetitorComparisonContent).metrics || [])];
      const newMetric = {
        category: "New Category",
        elloria: 90,
        competitors: 70,
        icon: "Shield",
        description: "Description"
      };
      metrics.push(newMetric);
      handleChange('metrics', metrics);
    }
  };

  const removeMetric = (index: number) => {
    if (!content || !('metrics' in content)) return;
    
    const metrics = [...(content as CompetitorComparisonContent).metrics || []];
    metrics.splice(index, 1);
    handleChange('metrics', metrics);
  };

  const getContentValue = (key: string): string => {
    if (!content) return '';
    return (content as any)[key]?.toString() || '';
  };

  const renderFields = () => {
    console.log('Rendering fields for block type:', block.type);
    console.log('Current content:', content);

    switch (block.type) {
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
                      onClick={() => removeMetric(index)}
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
                      onChange={(e) => handleMetricChange(index, 'elloria', parseInt(e.target.value))}
                      placeholder="Enter Elloria score"
                    />
                  </div>
                  <div>
                    <Label>Competitors Score (%)</Label>
                    <Input
                      type="number"
                      value={metric.competitors}
                      onChange={(e) => handleMetricChange(index, 'competitors', parseInt(e.target.value))}
                      placeholder="Enter competitors score"
                    />
                  </div>
                </div>
              ))}
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