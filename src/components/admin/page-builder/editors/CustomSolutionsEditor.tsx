import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { ContentBlock, CustomSolutionsProcessContent, CustomSolutionsProcessStep } from "@/types/content-blocks";

interface CustomSolutionsEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: any) => void;
}

export const CustomSolutionsEditor = ({ block, onUpdate }: CustomSolutionsEditorProps) => {
  const handleContentChange = (updates: Partial<CustomSolutionsProcessContent>) => {
    onUpdate(block.id, {
      ...block.content,
      ...updates,
    });
  };

  const handleProcessStepAdd = () => {
    const content = block.content as CustomSolutionsProcessContent;
    const steps = Array.isArray(content.steps) ? content.steps : [];
    handleContentChange({
      steps: [
        ...steps,
        {
          number: steps.length + 1,
          title: "New Step",
          description: "Step description",
          icon: "Package"
        },
      ],
    });
  };

  const handleProcessStepRemove = (index: number) => {
    const content = block.content as CustomSolutionsProcessContent;
    const steps = Array.isArray(content.steps) ? [...content.steps] : [];
    steps.splice(index, 1);
    // Update step numbers
    steps.forEach((step, i) => {
      step.number = i + 1;
    });
    handleContentChange({ steps });
  };

  const handleProcessStepUpdate = (index: number, updates: Partial<{ title: string; description: string }>) => {
    const content = block.content as CustomSolutionsProcessContent;
    const steps = Array.isArray(content.steps) ? [...content.steps] : [];
    steps[index] = { ...steps[index], ...updates };
    handleContentChange({ steps });
  };

  switch (block.type) {
    case "custom_solutions_process":
      const processContent = block.content as CustomSolutionsProcessContent;
      return (
        <div className="space-y-6">
          <div>
            <Label htmlFor="title">Section Title</Label>
            <Input
              id="title"
              value={processContent.title || ""}
              onChange={(e) => handleContentChange({ title: e.target.value })}
            />
          </div>
          <div className="space-y-4">
            <Label>Process Steps</Label>
            {Array.isArray(processContent.steps) && processContent.steps.map((step, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Step {step.number}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleProcessStepRemove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={step.title}
                    onChange={(e) => handleProcessStepUpdate(index, { title: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={step.description}
                    onChange={(e) => handleProcessStepUpdate(index, { description: e.target.value })}
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={handleProcessStepAdd}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Process Step
            </Button>
          </div>
        </div>
      );

    default:
      return null;
  }
};
