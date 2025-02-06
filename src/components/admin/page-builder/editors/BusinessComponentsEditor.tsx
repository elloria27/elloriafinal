import { ContentBlock, BlockContent } from "@/types/content-blocks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface BusinessComponentsEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const BusinessComponentsEditor = ({ block, onUpdate }: BusinessComponentsEditorProps) => {
  const [content, setContent] = useState(block.content);

  const handleUpdate = (updates: Partial<BlockContent>) => {
    const newContent = { ...content, ...updates };
    setContent(newContent);
    onUpdate(block.id, newContent);
  };

  if (block.type === "business_solutions") {
    return (
      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            value={content.title || ""}
            onChange={(e) => handleUpdate({ title: e.target.value })}
          />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea
            value={content.description || ""}
            onChange={(e) => handleUpdate({ description: e.target.value })}
          />
        </div>
        <div className="space-y-4">
          <Label>Solutions</Label>
          {(content.solutions || []).map((solution, index) => (
            <div key={index} className="space-y-2 p-4 border rounded">
              <Input
                placeholder="Title"
                value={solution.title}
                onChange={(e) => {
                  const newSolutions = [...(content.solutions || [])];
                  newSolutions[index] = { ...solution, title: e.target.value };
                  handleUpdate({ solutions: newSolutions });
                }}
              />
              <Textarea
                placeholder="Description"
                value={solution.description}
                onChange={(e) => {
                  const newSolutions = [...(content.solutions || [])];
                  newSolutions[index] = { ...solution, description: e.target.value };
                  handleUpdate({ solutions: newSolutions });
                }}
              />
              <Input
                placeholder="Button Text"
                value={solution.buttonText}
                onChange={(e) => {
                  const newSolutions = [...(content.solutions || [])];
                  newSolutions[index] = { ...solution, buttonText: e.target.value };
                  handleUpdate({ solutions: newSolutions });
                }}
              />
              <Input
                placeholder="Link"
                value={solution.link}
                onChange={(e) => {
                  const newSolutions = [...(content.solutions || [])];
                  newSolutions[index] = { ...solution, link: e.target.value };
                  handleUpdate({ solutions: newSolutions });
                }}
              />
            </div>
          ))}
          <Button
            type="button"
            onClick={() => {
              const newSolutions = [
                ...(content.solutions || []),
                { title: "", description: "", buttonText: "", link: "" }
              ];
              handleUpdate({ solutions: newSolutions });
            }}
          >
            Add Solution
          </Button>
        </div>
      </div>
    );
  }

  if (block.type === "business_contact_form") {
    return (
      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            value={content.title || ""}
            onChange={(e) => handleUpdate({ title: e.target.value })}
          />
        </div>
        <div>
          <Label>Description</Label>
          <Textarea
            value={content.description || ""}
            onChange={(e) => handleUpdate({ description: e.target.value })}
          />
        </div>
        <div>
          <Label>Button Text</Label>
          <Input
            value={content.buttonText || ""}
            onChange={(e) => handleUpdate({ buttonText: e.target.value })}
          />
        </div>
      </div>
    );
  }

  return null;
};