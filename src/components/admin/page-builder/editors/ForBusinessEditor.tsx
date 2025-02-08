import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { 
  ContentBlock, 
  ForBusinessHeroContent, 
  BusinessSolutionsContent, 
  BusinessContactContent,
  BulkHeroContent,
  BulkBenefitsContent,
  BulkProcessContent,
  BulkCtaContent,
  FeatureItem
} from "@/types/content-blocks";

interface ForBusinessEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: any) => void;
}

export const ForBusinessEditor = ({ block, onUpdate }: ForBusinessEditorProps) => {
  const handleContentChange = (updates: Partial<any>) => {
    onUpdate(block.id, {
      ...block.content,
      ...updates,
    });
  };

  const handleFeatureChange = (index: number, field: string, value: string) => {
    const features = [...((block.content as any).features || [])];
    features[index] = {
      ...features[index],
      [field]: value,
    };
    
    handleContentChange({ features });
  };

  const addFeature = () => {
    const features = [...((block.content as any).features || [])];
    features.push({
      icon: "Package",
      title: "New Feature",
      description: "Description of the feature",
    });
    
    handleContentChange({ features });
  };

  const removeFeature = (index: number) => {
    const features = [...((block.content as any).features || [])];
    features.splice(index, 1);
    
    handleContentChange({ features });
  };

  switch (block.type) {
    case "business_hero":
      const heroContent = block.content as ForBusinessHeroContent;
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
            <Label>Description</Label>
            <Textarea
              value={heroContent.description || ""}
              onChange={(e) => handleContentChange({ description: e.target.value })}
              placeholder="Enter description"
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
          <div>
            <Label>Button Link</Label>
            <Input
              value={heroContent.buttonLink || ""}
              onChange={(e) => handleContentChange({ buttonLink: e.target.value })}
              placeholder="Enter button link"
            />
          </div>
        </div>
      );

    case "business_solutions":
      const solutionsContent = block.content as BusinessSolutionsContent;
      return (
        <div className="space-y-6">
          <div>
            <Label>Title</Label>
            <Input
              value={solutionsContent.title || ""}
              onChange={(e) => handleContentChange({ title: e.target.value })}
              placeholder="Enter section title"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={solutionsContent.description || ""}
              onChange={(e) => handleContentChange({ description: e.target.value })}
              placeholder="Enter section description"
            />
          </div>
          
          <div className="space-y-4">
            <Label>Solutions</Label>
            {solutionsContent.solutions?.map((solution, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSolution(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <Label>Icon</Label>
                  <Input
                    value={solution.icon}
                    onChange={(e) =>
                      handleSolutionChange(index, "icon", e.target.value)
                    }
                    placeholder="Icon name"
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={solution.title}
                    onChange={(e) =>
                      handleSolutionChange(index, "title", e.target.value)
                    }
                    placeholder="Solution title"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={solution.description}
                    onChange={(e) =>
                      handleSolutionChange(index, "description", e.target.value)
                    }
                    placeholder="Solution description"
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSolution}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Solution
            </Button>
          </div>
        </div>
      );

    case "business_contact":
      const contactContent = block.content as BusinessContactContent;
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={contactContent.title || ""}
              onChange={(e) => handleContentChange({ title: e.target.value })}
              placeholder="Enter section title"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={contactContent.description || ""}
              onChange={(e) => handleContentChange({ description: e.target.value })}
              placeholder="Enter description"
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              value={contactContent.email || ""}
              onChange={(e) => handleContentChange({ email: e.target.value })}
              placeholder="Enter contact email"
            />
          </div>
          <div>
            <Label>Button Text</Label>
            <Input
              value={contactContent.buttonText || ""}
              onChange={(e) => handleContentChange({ buttonText: e.target.value })}
              placeholder="Enter button text"
            />
          </div>
          <div>
            <Label>Button Link</Label>
            <Input
              value={contactContent.buttonLink || ""}
              onChange={(e) => handleContentChange({ buttonLink: e.target.value })}
              placeholder="Enter button link"
            />
          </div>
        </div>
      );

    case "bulk_hero":
      const bulkHeroContent = block.content as BulkHeroContent;
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={bulkHeroContent.title || ""}
              onChange={(e) => handleContentChange({ title: e.target.value })}
              placeholder="Enter hero title"
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              value={bulkHeroContent.subtitle || ""}
              onChange={(e) => handleContentChange({ subtitle: e.target.value })}
              placeholder="Enter subtitle"
            />
          </div>
          <div>
            <Label>Button Text</Label>
            <Input
              value={bulkHeroContent.buttonText || ""}
              onChange={(e) => handleContentChange({ buttonText: e.target.value })}
              placeholder="Enter button text"
            />
          </div>
        </div>
      );

    case "bulk_benefits":
      const benefitsContent = block.content as BulkBenefitsContent;
      return (
        <div className="space-y-6">
          <div>
            <Label>Title</Label>
            <Input
              value={benefitsContent.title || ""}
              onChange={(e) => handleContentChange({ title: e.target.value })}
              placeholder="Enter section title"
            />
          </div>
          
          <div className="space-y-4">
            <Label>Features</Label>
            {benefitsContent.features?.map((feature, index) => (
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

    case "bulk_process":
      const processContent = block.content as BulkProcessContent;
      return (
        <div className="space-y-6">
          <div>
            <Label>Title</Label>
            <Input
              value={processContent.title || ""}
              onChange={(e) => handleContentChange({ title: e.target.value })}
              placeholder="Enter section title"
            />
          </div>
          
          <div className="space-y-4">
            <Label>Features</Label>
            {processContent.features?.map((feature, index) => (
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
              placeholder="Enter section title"
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
