import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface DonationFAQProps {
  content: {
    title?: string;
    description?: string;
    faqs?: Array<{
      question: string;
      answer: string;
    }>;
  };
}

export const DonationFAQ = ({ content }: DonationFAQProps) => {
  const [faqs, setFaqs] = useState(content.faqs || []);

  const handleAddFAQ = () => {
    setFaqs([...faqs, { question: "", answer: "" }]);
  };

  const handleRemoveFAQ = (index: number) => {
    const updatedFaqs = faqs.filter((_, i) => i !== index);
    setFaqs(updatedFaqs);
  };

  const handleChange = (index: number, field: string, value: string) => {
    const updatedFaqs = faqs.map((faq, i) => 
      i === index ? { ...faq, [field]: value } : faq
    );
    setFaqs(updatedFaqs);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Title</Label>
        <Input
          value={content.title || ""}
          onChange={(e) => content.title = e.target.value}
        />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea
          value={content.description || ""}
          onChange={(e) => content.description = e.target.value}
        />
      </div>
      <div>
        <Label>FAQs</Label>
        {faqs.map((faq, index) => (
          <div key={index} className="space-y-2 mt-2 p-4 border rounded-lg">
            <Input
              placeholder="Question"
              value={faq.question}
              onChange={(e) => handleChange(index, "question", e.target.value)}
            />
            <Textarea
              placeholder="Answer"
              value={faq.answer}
              onChange={(e) => handleChange(index, "answer", e.target.value)}
            />
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleRemoveFAQ(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddFAQ}
          className="mt-2"
        >
          <Plus className="h-4 w-4 mr-2" /> Add FAQ
        </Button>
      </div>
    </div>
  );
};
