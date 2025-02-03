import { ContentBlock, BusinessHeroContent, BusinessSolutionsContent, BusinessContactContent } from "@/types/content-blocks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface ForBusinessEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: any) => void;
}

export const ForBusinessEditor = ({ block, onUpdate }: ForBusinessEditorProps) => {
  const handleContentChange = (updates: Partial<BusinessHeroContent | BusinessSolutionsContent | BusinessContactContent>) => {
    onUpdate(block.id, {
      ...block.content,
      ...updates,
    });
  };

  const handleFeatureAdd = () => {
    const content = block.content as BusinessSolutionsContent;
    const solutions = Array.isArray(content.solutions) ? [...content.solutions] : [];
    solutions.push({
      icon: "Star",
      title: "New Solution",
      description: "Description",
    });
    handleContentChange({ solutions });
  };

  const handleFeatureRemove = (index: number) => {
    const content = block.content as BusinessSolutionsContent;
    const solutions = Array.isArray(content.solutions) ? [...content.solutions] : [];
    solutions.splice(index, 1);
    handleContentChange({ solutions });
  };

  const handleFeatureUpdate = (index: number, field: string, value: string) => {
    const content = block.content as BusinessSolutionsContent;
    const solutions = Array.isArray(content.solutions) ? [...content.solutions] : [];
    const solution = { ...solutions[index], [field]: value };
    solutions[index] = solution;
    handleContentChange({ solutions });
  };

  switch (block.type) {
    case "business_hero":
      const heroContent = block.content as BusinessHeroContent;
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={heroContent.title || ""}
              onChange={(e) => handleContentChange({ title: e.target.value })}
              placeholder="Enter title"
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
            <Input
              value={heroContent.description || ""}
              onChange={(e) => handleContentChange({ description: e.target.value })}
              placeholder="Enter description"
            />
          </div>
          <div>
            <Label>Button Text</Label>
            <Input
              value={typeof heroContent.buttonText === 'string' ? heroContent.buttonText : ''}
              onChange={(e) => handleContentChange({ buttonText: e.target.value })}
              placeholder="Enter button text"
            />
          </div>
          <div>
            <Label>Button Link</Label>
            <Input
              value={typeof heroContent.buttonLink === 'string' ? heroContent.buttonLink : ''}
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
              placeholder="Enter title"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              value={solutionsContent.description || ""}
              onChange={(e) => handleContentChange({ description: e.target.value })}
              placeholder="Enter description"
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Solutions</Label>
              <Button
                type="button"
                variant="outline"
                onClick={handleFeatureAdd}
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Solution
              </Button>
            </div>
            
            {Array.isArray(solutionsContent.solutions) && solutionsContent.solutions.map((solution, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Solution {index + 1}</span>
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
                    value={solution.icon}
                    onChange={(e) => handleFeatureUpdate(index, "icon", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={solution.title}
                    onChange={(e) => handleFeatureUpdate(index, "title", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={solution.description}
                    onChange={(e) => handleFeatureUpdate(index, "description", e.target.value)}
                  />
                </div>
              </div>
            ))}
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
              placeholder="Enter title"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
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
              placeholder="Enter email"
            />
          </div>
          <div>
            <Label>Button Text</Label>
            <Input
              value={typeof contactContent.buttonText === 'string' ? contactContent.buttonText : ''}
              onChange={(e) => handleContentChange({ buttonText: e.target.value })}
              placeholder="Enter button text"
            />
          </div>
          <div>
            <Label>Button Link</Label>
            <Input
              value={typeof contactContent.buttonLink === 'string' ? contactContent.buttonLink : ''}
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