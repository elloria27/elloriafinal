import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { ContentBlock, BlockContent } from "@/types/content-blocks";

interface SustainabilityProgramEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const SustainabilityProgramEditor = ({
  block,
  onUpdate,
}: SustainabilityProgramEditorProps) => {
  const content = block.content as any;

  const handleContentChange = (
    key: string,
    value: string | number | boolean | any[]
  ) => {
    onUpdate(block.id, {
      ...content,
      [key]: value,
    });
  };

  const handleBenefitChange = (index: number, field: string, value: string) => {
    const benefits = [...(content.benefits || [])];
    benefits[index] = {
      ...benefits[index],
      [field]: value,
    };
    handleContentChange("benefits", benefits);
  };

  const handleStepChange = (index: number, field: string, value: string) => {
    const steps = [...(content.steps || [])];
    steps[index] = {
      ...steps[index],
      [field]: value,
    };
    handleContentChange("steps", steps);
  };

  const addBenefit = () => {
    const benefits = [...(content.benefits || [])];
    benefits.push({
      icon: "Leaf",
      title: "",
      description: "",
    });
    handleContentChange("benefits", benefits);
  };

  const removeBenefit = (index: number) => {
    const benefits = [...(content.benefits || [])];
    benefits.splice(index, 1);
    handleContentChange("benefits", benefits);
  };

  const addStep = () => {
    const steps = [...(content.steps || [])];
    steps.push({
      step: steps.length + 1,
      title: "",
      description: "",
    });
    handleContentChange("steps", steps);
  };

  const removeStep = (index: number) => {
    const steps = [...(content.steps || [])];
    steps.splice(index, 1);
    // Update step numbers
    steps.forEach((step, i) => {
      step.step = i + 1;
    });
    handleContentChange("steps", steps);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Hero Section</h3>
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={content.title || ""}
              onChange={(e) => handleContentChange("title", e.target.value)}
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              value={content.subtitle || ""}
              onChange={(e) => handleContentChange("subtitle", e.target.value)}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={content.description || ""}
              onChange={(e) => handleContentChange("description", e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Program Benefits</h3>
          <Button onClick={addBenefit} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Benefit
          </Button>
        </div>
        <div className="space-y-6">
          {(content.benefits || []).map((benefit: any, index: number) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => removeBenefit(index)}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
              <div>
                <Label>Icon</Label>
                <select
                  className="w-full border rounded-md p-2"
                  value={benefit.icon}
                  onChange={(e) =>
                    handleBenefitChange(index, "icon", e.target.value)
                  }
                >
                  <option value="Leaf">Leaf</option>
                  <option value="TreePine">Tree</option>
                  <option value="Recycle">Recycle</option>
                  <option value="Globe">Globe</option>
                </select>
              </div>
              <div>
                <Label>Title</Label>
                <Input
                  value={benefit.title}
                  onChange={(e) =>
                    handleBenefitChange(index, "title", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={benefit.description}
                  onChange={(e) =>
                    handleBenefitChange(index, "description", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Steps Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">How It Works</h3>
          <Button onClick={addStep} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Step
          </Button>
        </div>
        <div className="space-y-6">
          {(content.steps || []).map((step: any, index: number) => (
            <div key={index} className="space-y-4 p-4 border rounded-lg relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => removeStep(index)}
              >
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
              <div>
                <Label>Title</Label>
                <Input
                  value={step.title}
                  onChange={(e) =>
                    handleStepChange(index, "title", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={step.description}
                  onChange={(e) =>
                    handleStepChange(index, "description", e.target.value)
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Call to Action</h3>
        <div className="space-y-4">
          <div>
            <Label>CTA Title</Label>
            <Input
              value={content.ctaTitle || ""}
              onChange={(e) => handleContentChange("ctaTitle", e.target.value)}
            />
          </div>
          <div>
            <Label>CTA Description</Label>
            <Textarea
              value={content.ctaDescription || ""}
              onChange={(e) =>
                handleContentChange("ctaDescription", e.target.value)
              }
            />
          </div>
          <div>
            <Label>Primary Button Text</Label>
            <Input
              value={content.primaryButtonText || ""}
              onChange={(e) =>
                handleContentChange("primaryButtonText", e.target.value)
              }
            />
          </div>
          <div>
            <Label>Secondary Button Text</Label>
            <Input
              value={content.secondaryButtonText || ""}
              onChange={(e) =>
                handleContentChange("secondaryButtonText", e.target.value)
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};