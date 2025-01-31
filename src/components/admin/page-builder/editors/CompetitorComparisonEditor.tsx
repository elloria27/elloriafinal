import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { ContentBlock, CompetitorComparisonContent } from "@/types/content-blocks";

interface CompetitorComparisonEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: CompetitorComparisonContent) => void;
}

export const CompetitorComparisonEditor = ({ block, onUpdate }: CompetitorComparisonEditorProps) => {
  const content = block.content as CompetitorComparisonContent;

  const handleChange = (field: keyof CompetitorComparisonContent, value: any) => {
    console.log('Updating competitor comparison field:', field, value);
    onUpdate(block.id, {
      ...content,
      [field]: value,
    });
  };

  const handleMetricChange = (index: number, field: string, value: any) => {
    const updatedMetrics = [...(content.metrics || [])];
    updatedMetrics[index] = {
      ...updatedMetrics[index],
      [field]: field === 'elloria' || field === 'competitors' ? Number(value) : value,
    };
    handleChange('metrics', updatedMetrics);
  };

  const addMetric = () => {
    const newMetric = {
      category: '',
      elloria: 0,
      competitors: 0,
      icon: 'Shield',
      description: '',
    };
    handleChange('metrics', [...(content.metrics || []), newMetric]);
  };

  const removeMetric = (index: number) => {
    const updatedMetrics = [...(content.metrics || [])];
    updatedMetrics.splice(index, 1);
    handleChange('metrics', updatedMetrics);
  };

  return (
    <div className="space-y-6">
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
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Metrics</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addMetric}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Metric
          </Button>
        </div>

        {(content.metrics || []).map((metric, index) => (
          <div key={index} className="space-y-4 p-4 border rounded-lg relative">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              onClick={() => removeMetric(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            <div className="space-y-2">
              <Label>Category</Label>
              <Input
                value={metric.category}
                onChange={(e) => handleMetricChange(index, 'category', e.target.value)}
                placeholder="Enter category name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Elloria Score</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={metric.elloria}
                  onChange={(e) => handleMetricChange(index, 'elloria', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Competitors Score</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={metric.competitors}
                  onChange={(e) => handleMetricChange(index, 'competitors', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Icon</Label>
              <select
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={metric.icon}
                onChange={(e) => handleMetricChange(index, 'icon', e.target.value)}
              >
                <option value="Shield">Shield</option>
                <option value="Leaf">Leaf</option>
                <option value="Heart">Heart</option>
                <option value="Sparkles">Sparkles</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={metric.description}
                onChange={(e) => handleMetricChange(index, 'description', e.target.value)}
                placeholder="Enter metric description"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
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
          <Label htmlFor="buttonUrl">Button URL</Label>
          <Input
            id="buttonUrl"
            value={content.buttonUrl || ''}
            onChange={(e) => handleChange('buttonUrl', e.target.value)}
            placeholder="Enter button URL"
          />
        </div>
      </div>
    </div>
  );
};