import { BlockContent, ContentBlock, DonationFAQContent } from "@/types/content-blocks";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface DonationEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const DonationEditor = ({ block, onUpdate }: DonationEditorProps) => {
  const content = block.content as DonationFAQContent;
  const [localContent, setLocalContent] = useState(content);

  const handleChange = (field: string, value: string) => {
    const newContent = { ...localContent, [field]: value };
    setLocalContent(newContent);
    onUpdate(block.id, newContent);
  };

  const handleFAQChange = (index: number, field: 'question' | 'answer', value: string) => {
    const newFaqs = [...(localContent.faqs || [])];
    newFaqs[index] = {
      ...newFaqs[index],
      [field]: value,
    };
    
    const newContent = { ...localContent, faqs: newFaqs };
    setLocalContent(newContent);
    onUpdate(block.id, newContent);
  };

  const addFAQ = () => {
    const newFaqs = [...(localContent.faqs || []), { question: '', answer: '' }];
    const newContent = { ...localContent, faqs: newFaqs };
    setLocalContent(newContent);
    onUpdate(block.id, newContent);
  };

  const removeFAQ = (index: number) => {
    const newFaqs = [...(localContent.faqs || [])];
    newFaqs.splice(index, 1);
    const newContent = { ...localContent, faqs: newFaqs };
    setLocalContent(newContent);
    onUpdate(block.id, newContent);
  };

  const renderFields = () => {
    switch (block.type) {
      case "donation_hero":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={localContent.title as string || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter hero title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Textarea
                id="subtitle"
                value={localContent.subtitle as string || ""}
                onChange={(e) => handleChange("subtitle", e.target.value)}
                placeholder="Enter hero subtitle"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={localContent.buttonText as string || ""}
                onChange={(e) => handleChange("buttonText", e.target.value)}
                placeholder="Enter button text"
              />
            </div>
          </>
        );

      case "donation_impact":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={localContent.title as string || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter impact section title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Textarea
                id="subtitle"
                value={localContent.subtitle as string || ""}
                onChange={(e) => handleChange("subtitle", e.target.value)}
                placeholder="Enter impact section subtitle"
              />
            </div>
          </>
        );

      case "donation_form":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={localContent.title as string || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter form title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Textarea
                id="subtitle"
                value={localContent.subtitle as string || ""}
                onChange={(e) => handleChange("subtitle", e.target.value)}
                placeholder="Enter form subtitle"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={localContent.buttonText as string || ""}
                onChange={(e) => handleChange("buttonText", e.target.value)}
                placeholder="Enter button text"
              />
            </div>
          </>
        );

      case "donation_stories":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={localContent.title as string || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter stories section title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Textarea
                id="subtitle"
                value={localContent.subtitle as string || ""}
                onChange={(e) => handleChange("subtitle", e.target.value)}
                placeholder="Enter stories section subtitle"
              />
            </div>
          </>
        );

      case "donation_partners":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={localContent.title as string || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter partners section title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Textarea
                id="subtitle"
                value={localContent.subtitle as string || ""}
                onChange={(e) => handleChange("subtitle", e.target.value)}
                placeholder="Enter partners section subtitle"
              />
            </div>
          </>
        );

      case "donation_faq":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={localContent.title as string || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter FAQ section title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Input
                id="subtitle"
                value={localContent.subtitle as string || ""}
                onChange={(e) => handleChange("subtitle", e.target.value)}
                placeholder="Enter FAQ section subtitle"
              />
            </div>
            <div className="space-y-4 mt-6">
              <div className="flex items-center justify-between">
                <Label>FAQs</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={addFAQ}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add FAQ
                </Button>
              </div>
              {(localContent.faqs || []).map((faq, index) => (
                <div key={index} className="space-y-3 p-4 border rounded-lg relative">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-2"
                    onClick={() => removeFAQ(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                  <div className="space-y-2">
                    <Label>Question {index + 1}</Label>
                    <Input
                      value={faq.question || ""}
                      onChange={(e) => handleFAQChange(index, 'question', e.target.value)}
                      placeholder="Enter question"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Answer</Label>
                    <Textarea
                      value={faq.answer || ""}
                      onChange={(e) => handleFAQChange(index, 'answer', e.target.value)}
                      placeholder="Enter answer"
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        );

      case "donation_join_movement":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={localContent.title as string || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter join movement title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={localContent.description as string || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter join movement description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={localContent.buttonText as string || ""}
                onChange={(e) => handleChange("buttonText", e.target.value)}
                placeholder="Enter button text"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return <div className="space-y-6">{renderFields()}</div>;
};
