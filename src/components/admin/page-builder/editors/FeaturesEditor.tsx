import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { ContentBlock, FeaturesContent, FeatureItem } from "@/types/content-blocks";
import { Json } from "@/integrations/supabase/types";
import { convertToFeatureItems } from "@/utils/contentConverters";

interface FeaturesEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: FeaturesContent) => void;
}

export const FeaturesEditor = ({ block, onUpdate }: FeaturesEditorProps) => {
  const content = block.content as FeaturesContent;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    console.log('Updating features field:', field, 'with value:', e.target.value);
    onUpdate(block.id, {
      ...content,
      [field]: e.target.value
    });
  };

  const handleFeatureAdd = () => {
    const features = getFeatures();
      
    const newFeature: FeatureItem = {
      icon: "Droplets",
      title: "New Feature",
      description: "Feature description"
    };

    const updatedFeatures = [...features, newFeature];
    onUpdate(block.id, {
      ...content,
      features: updatedFeatures as unknown as Json
    });
  };

  const handleFeatureRemove = (index: number) => {
    const features = getFeatures();
    features.splice(index, 1);
    onUpdate(block.id, { 
      ...content, 
      features: features as unknown as Json
    });
  };

  const handleFeatureUpdate = (index: number, field: string, value: string) => {
    const features = getFeatures();
    const feature = features[index];
    const updatedFeature = { ...feature, [field]: value };
    features[index] = updatedFeature;
    onUpdate(block.id, { 
      ...content, 
      features: features as unknown as Json
    });
  };

  const getFeatures = (): FeatureItem[] => {
    return convertToFeatureItems(content.features);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Title</Label>
        <Input
          value={String(content.title || "")}
          onChange={(e) => handleInputChange(e, "title")}
        />
      </div>
      <div>
        <Label>Subtitle</Label>
        <Input
          value={String(content.subtitle || "")}
          onChange={(e) => handleInputChange(e, "subtitle")}
        />
      </div>
      <div>
        <Label>Description</Label>
        <Input
          value={String(content.description || "")}
          onChange={(e) => handleInputChange(e, "description")}
        />
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Features</Label>
          <Button
            type="button"
            variant="outline"
            onClick={handleFeatureAdd}
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Feature
          </Button>
        </div>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
          {getFeatures().map((feature, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-3 bg-white">
              <div className="flex justify-between items-center">
                <span className="font-medium">Feature {index + 1}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleFeatureRemove(index)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
              <div>
                <Label>Icon</Label>
                <Input
                  value={String(feature.icon || "")}
                  onChange={(e) => handleFeatureUpdate(index, "icon", e.target.value)}
                  placeholder="Droplets, Leaf, or Heart"
                />
              </div>
              <div>
                <Label>Title</Label>
                <Input
                  value={String(feature.title || "")}
                  onChange={(e) => handleFeatureUpdate(index, "title", e.target.value)}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={String(feature.description || "")}
                  onChange={(e) => handleFeatureUpdate(index, "description", e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};