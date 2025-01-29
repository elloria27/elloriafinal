import { ContentBlock, BlockContent } from "@/types/content-blocks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface ContactPageEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const ContactPageEditor = ({ block, onUpdate }: ContactPageEditorProps) => {
  const [content, setContent] = useState<BlockContent>(block.content);

  const handleChange = (key: string, value: any) => {
    const updatedContent = { ...content, [key]: value };
    setContent(updatedContent);
    onUpdate(block.id, updatedContent);
  };

  const handleArrayChange = (key: string, index: number, value: any) => {
    const array = [...(content[key] as any[] || [])];
    array[index] = { ...array[index], ...value };
    handleChange(key, array);
  };

  const addArrayItem = (key: string, defaultItem: any) => {
    const array = [...(content[key] as any[] || [])];
    array.push(defaultItem);
    handleChange(key, array);
  };

  const removeArrayItem = (key: string, index: number) => {
    const array = [...(content[key] as any[] || [])];
    array.splice(index, 1);
    handleChange(key, array);
  };

  switch (block.type) {
    case "contact_hero":
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={content.title as string || ""}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={content.description as string || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
        </div>
      );

    case "contact_details":
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={content.title as string || ""}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={content.description as string || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
          <div>
            <Label>Address</Label>
            <Input
              value={content.address as string || ""}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>
          <div>
            <Label>Phone</Label>
            <Input
              value={content.phone as string || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              value={content.email as string || ""}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
        </div>
      );

    case "contact_form":
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={content.title as string || ""}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={content.description as string || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
        </div>
      );

    case "contact_faq":
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={content.title as string || ""}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={content.description as string || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
          <div>
            <Label>FAQs</Label>
            <div className="space-y-4">
              {(content.faqs as any[] || []).map((faq, index) => (
                <div key={index} className="p-4 border rounded space-y-2">
                  <Input
                    placeholder="Question"
                    value={faq.question || ""}
                    onChange={(e) =>
                      handleArrayChange("faqs", index, {
                        ...faq,
                        question: e.target.value,
                      })
                    }
                  />
                  <Textarea
                    placeholder="Answer"
                    value={faq.answer || ""}
                    onChange={(e) =>
                      handleArrayChange("faqs", index, {
                        ...faq,
                        answer: e.target.value,
                      })
                    }
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeArrayItem("faqs", index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() =>
                  addArrayItem("faqs", {
                    question: "",
                    answer: "",
                  })
                }
              >
                <Plus className="h-4 w-4 mr-2" /> Add FAQ
              </Button>
            </div>
          </div>
        </div>
      );

    case "contact_business":
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={content.title as string || ""}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={content.description as string || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              value={content.email as string || ""}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
          <div>
            <Label>Button Text</Label>
            <Input
              value={content.buttonText as string || ""}
              onChange={(e) => handleChange("buttonText", e.target.value)}
            />
          </div>
          <div>
            <Label>Button Link</Label>
            <Input
              value={content.buttonLink as string || ""}
              onChange={(e) => handleChange("buttonLink", e.target.value)}
            />
          </div>
        </div>
      );

    default:
      return null;
  }
};