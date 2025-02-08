
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ContentBlock, BulkHeroContent, BulkBenefitsContent, BulkProcessContent, BulkCtaContent, FeatureItem } from "@/types/content-blocks";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface BulkEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: any) => void;
}

export const BulkEditor = ({ block, onUpdate }: BulkEditorProps) => {
  const handleContentChange = (updates: Partial<BulkHeroContent | BulkBenefitsContent | BulkProcessContent | BulkCtaContent>) => {
    onUpdate(block.id, {
      ...block.content,
      ...updates,
    });
  };

  const handleFeatureChange = (index: number, field: string, value: string) => {
    if (block.type !== "bulk_benefits" && block.type !== "bulk_process") return;
    
    const features = [...((block.content as BulkBenefitsContent | BulkProcessContent).features || [])];
    features[index] = {
      ...features[index],
      [field]: value,
    } as FeatureItem;
    
    handleContentChange({ features });
  };

  const addFeature = () => {
    if (block.type !== "bulk_benefits" && block.type !== "bulk_process") return;
    
    const features = [...((block.content as BulkBenefitsContent | BulkProcessContent).features || [])];
    features.push({
      icon: "Package",
      title: "New Feature",
      description: "Description of the feature",
    });
    
    handleContentChange({ features });
  };

  const removeFeature = (index: number) => {
    if (block.type !== "bulk_benefits" && block.type !== "bulk_process") return;
    
    const features = [...((block.content as BulkBenefitsContent | BulkProcessContent).features || [])];
    features.splice(index, 1);
    
    handleContentChange({ features });
  };

  switch (block.type) {
    case "bulk_hero":
      const heroContent = block.content as BulkHeroContent;
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={heroContent.title || ""}
              onChange={(e) => handleContentChange({ title: e.target.value })}
              placeholder="Enter hero title"
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              value={heroContent.subtitle || ""}
              onChange={(e) => handleContentChange({ subtitle: e.target.value })}
              placeholder="Enter subtitle"
            />
          </div>
          <div>
            <Label>Button Text</Label>
            <Input
              value={heroContent.buttonText || ""}
              onChange={(e) => handleContentChange({ buttonText: e.target.value })}
              placeholder="Enter button text"
            />
          </div>
        </div>
      );

    case "bulk_benefits":
    case "bulk_process":
      const content = block.content as BulkBenefitsContent | BulkProcessContent;
      return (
        <div className="space-y-6">
          <div>
            <Label>Title</Label>
            <Input
              value={content.title || ""}
              onChange={(e) => handleContentChange({ title: e.target.value })}
              placeholder="Enter section title"
            />
          </div>
          
          <div className="space-y-4">
            <Label>Features</Label>
            {content.features?.map((feature, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFeature(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <Label>Icon</Label>
                  <Input
                    value={feature.icon}
                    onChange={(e) =>
                      handleFeatureChange(index, "icon", e.target.value)
                    }
                    placeholder="Icon name"
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={feature.title}
                    onChange={(e) =>
                      handleFeatureChange(index, "title", e.target.value)
                    }
                    placeholder="Feature title"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={feature.description}
                    onChange={(e) =>
                      handleFeatureChange(index, "description", e.target.value)
                    }
                    placeholder="Feature description"
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addFeature}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Feature
            </Button>
          </div>
        </div>
      );

    case "bulk_cta":
      const ctaContent = block.content as BulkCtaContent;
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={ctaContent.title || ""}
              onChange={(e) => handleContentChange({ title: e.target.value })}
              placeholder="Enter title"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={ctaContent.description || ""}
              onChange={(e) => handleContentChange({ description: e.target.value })}
              placeholder="Enter description"
            />
          </div>
          <div>
            <Label>Button Text</Label>
            <Input
              value={ctaContent.buttonText || ""}
              onChange={(e) => handleContentChange({ buttonText: e.target.value })}
              placeholder="Enter button text"
            />
          </div>
        </div>
      );

    default:
      return null;
  }
};
