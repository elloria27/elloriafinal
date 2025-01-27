import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ContentBlock, BlockContent } from "@/types/content-blocks";
import { ArrowUp, ArrowDown, Trash2, Plus, X } from "lucide-react";
import { toast } from "sonner";

interface PropertyEditorProps {
  selectedBlock: ContentBlock;
  onUpdateBlock: (block: ContentBlock) => void;
  onMoveBlock: (blockId: string, direction: "up" | "down") => void;
  onDeleteBlock: (blockId: string) => void;
}

export const PropertyEditor = ({
  selectedBlock,
  onUpdateBlock,
  onMoveBlock,
  onDeleteBlock,
}: PropertyEditorProps) => {
  const [newFeature, setNewFeature] = useState({
    icon: "",
    title: "",
    description: "",
    detail: ""
  });

  const [newMetric, setNewMetric] = useState({
    category: "",
    elloria: 0,
    competitors: 0,
    icon: "",
    description: ""
  });

  const handleContentChange = (
    key: string,
    value: string | number | boolean | any[]
  ) => {
    const updatedContent = {
      ...selectedBlock.content,
      [key]: value,
    };
    onUpdateBlock({ ...selectedBlock, content: updatedContent });
  };

  const handleFeatureChange = (index: number, key: string, value: string) => {
    const features = [...(selectedBlock.content.features || [])];
    features[index] = { ...features[index], [key]: value };
    handleContentChange("features", features);
  };

  const handleAddFeature = () => {
    if (!newFeature.title || !newFeature.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const features = [...(selectedBlock.content.features || [])];
    features.push(newFeature);
    handleContentChange("features", features);
    setNewFeature({ icon: "", title: "", description: "", detail: "" });
  };

  const handleRemoveFeature = (index: number) => {
    const features = [...(selectedBlock.content.features || [])];
    features.splice(index, 1);
    handleContentChange("features", features);
  };

  const handleMetricChange = (index: number, key: string, value: string | number) => {
    const metrics = [...(selectedBlock.content.metrics || [])];
    metrics[index] = { ...metrics[index], [key]: value };
    handleContentChange("metrics", metrics);
  };

  const handleAddMetric = () => {
    if (!newMetric.category || !newMetric.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    const metrics = [...(selectedBlock.content.metrics || [])];
    metrics.push(newMetric);
    handleContentChange("metrics", metrics);
    setNewMetric({
      category: "",
      elloria: 0,
      competitors: 0,
      icon: "",
      description: ""
    });
  };

  const handleRemoveMetric = (index: number) => {
    const metrics = [...(selectedBlock.content.metrics || [])];
    metrics.splice(index, 1);
    handleContentChange("metrics", metrics);
  };

  const renderControls = () => (
    <div className="flex justify-between items-center mb-6 pb-4 border-b">
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onMoveBlock(selectedBlock.id, "up")}
        >
          <ArrowUp className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onMoveBlock(selectedBlock.id, "down")}
        >
          <ArrowDown className="w-4 h-4" />
        </Button>
      </div>
      <Button
        variant="destructive"
        size="sm"
        onClick={() => onDeleteBlock(selectedBlock.id)}
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Delete Block
      </Button>
    </div>
  );

  const renderBasicFields = () => (
    <>
      <div className="space-y-4 mb-6">
        <div>
          <Label>Title</Label>
          <Input
            value={selectedBlock.content.title || ""}
            onChange={(e) => handleContentChange("title", e.target.value)}
          />
        </div>
        <div>
          <Label>Subtitle</Label>
          <Input
            value={selectedBlock.content.subtitle || ""}
            onChange={(e) => handleContentChange("subtitle", e.target.value)}
          />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea
            value={selectedBlock.content.description || ""}
            onChange={(e) => handleContentChange("description", e.target.value)}
          />
        </div>
      </div>
    </>
  );

  const renderFeaturesList = () => (
    <div className="space-y-6">
      <h3 className="font-semibold">Features</h3>
      {(selectedBlock.content.features || []).map((feature: any, index: number) => (
        <div key={index} className="space-y-4 p-4 bg-gray-50 rounded-lg relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => handleRemoveFeature(index)}
          >
            <X className="w-4 h-4" />
          </Button>
          <div>
            <Label>Icon</Label>
            <Input
              value={feature.icon}
              onChange={(e) => handleFeatureChange(index, "icon", e.target.value)}
            />
          </div>
          <div>
            <Label>Title</Label>
            <Input
              value={feature.title}
              onChange={(e) => handleFeatureChange(index, "title", e.target.value)}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={feature.description}
              onChange={(e) => handleFeatureChange(index, "description", e.target.value)}
            />
          </div>
          <div>
            <Label>Detail</Label>
            <Textarea
              value={feature.detail || ""}
              onChange={(e) => handleFeatureChange(index, "detail", e.target.value)}
            />
          </div>
        </div>
      ))}

      <div className="space-y-4 p-4 bg-gray-50 rounded-lg border-2 border-dashed">
        <h4 className="font-medium">Add New Feature</h4>
        <div>
          <Label>Icon</Label>
          <Input
            value={newFeature.icon}
            onChange={(e) => setNewFeature({ ...newFeature, icon: e.target.value })}
          />
        </div>
        <div>
          <Label>Title</Label>
          <Input
            value={newFeature.title}
            onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })}
          />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea
            value={newFeature.description}
            onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
          />
        </div>
        <div>
          <Label>Detail</Label>
          <Textarea
            value={newFeature.detail}
            onChange={(e) => setNewFeature({ ...newFeature, detail: e.target.value })}
          />
        </div>
        <Button onClick={handleAddFeature} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Feature
        </Button>
      </div>
    </div>
  );

  const renderMetricsList = () => (
    <div className="space-y-6">
      <h3 className="font-semibold">Comparison Metrics</h3>
      {(selectedBlock.content.metrics || []).map((metric: any, index: number) => (
        <div key={index} className="space-y-4 p-4 bg-gray-50 rounded-lg relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => handleRemoveMetric(index)}
          >
            <X className="w-4 h-4" />
          </Button>
          <div>
            <Label>Category</Label>
            <Input
              value={metric.category}
              onChange={(e) => handleMetricChange(index, "category", e.target.value)}
            />
          </div>
          <div>
            <Label>Elloria Score</Label>
            <Input
              type="number"
              value={metric.elloria}
              onChange={(e) => handleMetricChange(index, "elloria", parseInt(e.target.value))}
            />
          </div>
          <div>
            <Label>Competitors Score</Label>
            <Input
              type="number"
              value={metric.competitors}
              onChange={(e) => handleMetricChange(index, "competitors", parseInt(e.target.value))}
            />
          </div>
          <div>
            <Label>Icon</Label>
            <Input
              value={metric.icon}
              onChange={(e) => handleMetricChange(index, "icon", e.target.value)}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={metric.description}
              onChange={(e) => handleMetricChange(index, "description", e.target.value)}
            />
          </div>
        </div>
      ))}

      <div className="space-y-4 p-4 bg-gray-50 rounded-lg border-2 border-dashed">
        <h4 className="font-medium">Add New Metric</h4>
        <div>
          <Label>Category</Label>
          <Input
            value={newMetric.category}
            onChange={(e) => setNewMetric({ ...newMetric, category: e.target.value })}
          />
        </div>
        <div>
          <Label>Elloria Score</Label>
          <Input
            type="number"
            value={newMetric.elloria}
            onChange={(e) => setNewMetric({ ...newMetric, elloria: parseInt(e.target.value) })}
          />
        </div>
        <div>
          <Label>Competitors Score</Label>
          <Input
            type="number"
            value={newMetric.competitors}
            onChange={(e) => setNewMetric({ ...newMetric, competitors: parseInt(e.target.value) })}
          />
        </div>
        <div>
          <Label>Icon</Label>
          <Input
            value={newMetric.icon}
            onChange={(e) => setNewMetric({ ...newMetric, icon: e.target.value })}
          />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea
            value={newMetric.description}
            onChange={(e) => setNewMetric({ ...newMetric, description: e.target.value })}
          />
        </div>
        <Button onClick={handleAddMetric} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Metric
        </Button>
      </div>
    </div>
  );

  const renderBlockProperties = () => {
    switch (selectedBlock.type) {
      case "hero":
      case "features":
      case "game_changer":
      case "store_brands":
      case "sustainability":
      case "product_carousel":
      case "testimonials":
      case "blog_preview":
      case "newsletter":
        return (
          <>
            {renderBasicFields()}
            {(selectedBlock.type === "features" || 
              selectedBlock.type === "game_changer") && renderFeaturesList()}
            {selectedBlock.type === "competitor_comparison" && renderMetricsList()}
          </>
        );
      default:
        return <p>No editable properties for this component type.</p>;
    }
  };

  return (
    <div className="p-6 border-l overflow-y-auto h-full">
      <h2 className="text-lg font-semibold mb-6">Edit {selectedBlock.type}</h2>
      {renderControls()}
      {renderBlockProperties()}
    </div>
  );
};