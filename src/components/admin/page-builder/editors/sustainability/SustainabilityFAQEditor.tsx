import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { SustainabilityFAQContent } from "@/types/sustainability";

interface SustainabilityFAQEditorProps {
  content: SustainabilityFAQContent;
  onUpdate: (content: SustainabilityFAQContent) => void;
}

export const SustainabilityFAQEditor = ({ content, onUpdate }: SustainabilityFAQEditorProps) => {
  const handleUpdate = (updates: Partial<SustainabilityFAQContent>) => {
    onUpdate({
      ...content,
      ...updates,
    });
  };

  const handleFAQUpdate = (index: number, updates: Partial<typeof content.faqs[0]>) => {
    const updatedFAQs = [...content.faqs];
    updatedFAQs[index] = {
      ...updatedFAQs[index],
      ...updates,
    };
    handleUpdate({ faqs: updatedFAQs });
  };

  const addFAQ = () => {
    handleUpdate({
      faqs: [
        ...content.faqs,
        {
          question: "",
          answer: "",
        },
      ],
    });
  };

  const removeFAQ = (index: number) => {
    const updatedFAQs = [...content.faqs];
    updatedFAQs.splice(index, 1);
    handleUpdate({ faqs: updatedFAQs });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Title</Label>
        <Input
          value={content.title}
          onChange={(e) => handleUpdate({ title: e.target.value })}
          placeholder="Enter FAQ section title"
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={content.description}
          onChange={(e) => handleUpdate({ description: e.target.value })}
          placeholder="Enter FAQ section description"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>FAQs</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addFAQ}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add FAQ
          </Button>
        </div>

        {content.faqs.map((faq, index) => (
          <div key={index} className="space-y-2 p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <Label>FAQ {index + 1}</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFAQ(index)}
              >
                <Minus className="w-4 h-4" />
              </Button>
            </div>

            <Input
              value={faq.question}
              onChange={(e) => handleFAQUpdate(index, { question: e.target.value })}
              placeholder="Question"
            />

            <Textarea
              value={faq.answer}
              onChange={(e) => handleFAQUpdate(index, { answer: e.target.value })}
              placeholder="Answer"
            />
          </div>
        ))}
      </div>
    </div>
  );
};