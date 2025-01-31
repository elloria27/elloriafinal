import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { ContentBlock } from "@/types/content-blocks";

interface ForBusinessEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: any) => void;
}

export const ForBusinessEditor = ({ block, onUpdate }: ForBusinessEditorProps) => {
  const handleContentChange = (updates: any) => {
    onUpdate(block.id, {
      ...block.content,
      ...updates,
    });
  };

  const handleSolutionChange = (index: number, field: string, value: string) => {
    if (block.type !== "business_solutions") return;
    
    const solutions = [...(block.content.solutions || [])];
    solutions[index] = {
      ...solutions[index],
      [field]: value,
    };
    
    handleContentChange({ solutions });
  };

  const addSolution = () => {
    if (block.type !== "business_solutions") return;
    
    const solutions = [...(block.content.solutions || [])];
    solutions.push({
      icon: "Briefcase",
      title: "New Solution",
      description: "Description of the solution",
    });
    
    handleContentChange({ solutions });
  };

  const removeSolution = (index: number) => {
    if (block.type !== "business_solutions") return;
    
    const solutions = [...(block.content.solutions || [])];
    solutions.splice(index, 1);
    
    handleContentChange({ solutions });
  };

  switch (block.type) {
    case "business_hero":
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={block.content.title || ""}
              onChange={(e) => handleContentChange({ title: e.target.value })}
              placeholder="Enter hero title"
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              value={block.content.subtitle || ""}
              onChange={(e) => handleContentChange({ subtitle: e.target.value })}
              placeholder="Enter subtitle"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={block.content.description || ""}
              onChange={(e) => handleContentChange({ description: e.target.value })}
              placeholder="Enter description"
            />
          </div>
          <div>
            <Label>Button Text</Label>
            <Input
              value={block.content.buttonText || ""}
              onChange={(e) => handleContentChange({ buttonText: e.target.value })}
              placeholder="Enter button text"
            />
          </div>
          <div>
            <Label>Button Link</Label>
            <Input
              value={block.content.buttonLink || ""}
              onChange={(e) => handleContentChange({ buttonLink: e.target.value })}
              placeholder="Enter button link"
            />
          </div>
        </div>
      );

    case "business_solutions":
      return (
        <div className="space-y-6">
          <div>
            <Label>Title</Label>
            <Input
              value={block.content.title || ""}
              onChange={(e) => handleContentChange({ title: e.target.value })}
              placeholder="Enter section title"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={block.content.description || ""}
              onChange={(e) => handleContentChange({ description: e.target.value })}
              placeholder="Enter section description"
            />
          </div>
          
          <div className="space-y-4">
            <Label>Solutions</Label>
            {block.content.solutions?.map((solution: any, index: number) => (
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
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={block.content.title || ""}
              onChange={(e) => handleContentChange({ title: e.target.value })}
              placeholder="Enter section title"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={block.content.description || ""}
              onChange={(e) => handleContentChange({ description: e.target.value })}
              placeholder="Enter description"
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              value={block.content.email || ""}
              onChange={(e) => handleContentChange({ email: e.target.value })}
              placeholder="Enter contact email"
            />
          </div>
          <div>
            <Label>Button Text</Label>
            <Input
              value={block.content.buttonText || ""}
              onChange={(e) => handleContentChange({ buttonText: e.target.value })}
              placeholder="Enter button text"
            />
          </div>
          <div>
            <Label>Button Link</Label>
            <Input
              value={block.content.buttonLink || ""}
              onChange={(e) => handleContentChange({ buttonLink: e.target.value })}
              placeholder="Enter button link"
            />
          </div>
        </div>
      );

    default:
      return null;
  }
};