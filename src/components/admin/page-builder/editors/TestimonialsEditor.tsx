
import { BlockContent, ContentBlock, TestimonialsContent } from "@/types/content-blocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface TestimonialsEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const TestimonialsEditor = ({ block, onUpdate }: TestimonialsEditorProps) => {
  const content = block.content as TestimonialsContent;
  const [localContent, setLocalContent] = useState(content);

  const handleUpdate = (updates: Partial<TestimonialsContent>) => {
    const newContent = { ...localContent, ...updates };
    setLocalContent(newContent);
    onUpdate(block.id, newContent);
  };

  const addTestimonial = () => {
    const newTestimonials = [...(localContent.testimonials || []), {
      name: "",
      rating: 5,
      text: "",
      source: "Verified Purchase"
    }];
    handleUpdate({ testimonials: newTestimonials });
  };

  const updateTestimonial = (index: number, updates: any) => {
    const newTestimonials = [...(localContent.testimonials || [])];
    newTestimonials[index] = { ...newTestimonials[index], ...updates };
    handleUpdate({ testimonials: newTestimonials });
  };

  const removeTestimonial = (index: number) => {
    const newTestimonials = [...(localContent.testimonials || [])];
    newTestimonials.splice(index, 1);
    handleUpdate({ testimonials: newTestimonials });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium">Title</label>
        <Input
          value={localContent.title || ""}
          onChange={(e) => handleUpdate({ title: e.target.value })}
          placeholder="Enter section title"
        />
      </div>

      <div>
        <label className="text-sm font-medium">Subtitle</label>
        <Input
          value={localContent.subtitle || ""}
          onChange={(e) => handleUpdate({ subtitle: e.target.value })}
          placeholder="Enter section subtitle"
        />
      </div>

      <div>
        <label className="text-sm font-medium mb-2 block">Testimonials</label>
        <div className="space-y-4">
          {(localContent.testimonials || []).map((testimonial, index) => (
            <div key={index} className="border p-4 rounded-lg space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Testimonial {index + 1}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTestimonial(index)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
              <Input
                value={testimonial.name}
                onChange={(e) => updateTestimonial(index, { name: e.target.value })}
                placeholder="Name"
                className="mb-2"
              />
              <Input
                type="number"
                min="1"
                max="5"
                value={testimonial.rating}
                onChange={(e) => updateTestimonial(index, { rating: Number(e.target.value) })}
                placeholder="Rating (1-5)"
                className="mb-2"
              />
              <Textarea
                value={testimonial.text}
                onChange={(e) => updateTestimonial(index, { text: e.target.value })}
                placeholder="Testimonial text"
                className="mb-2"
              />
              <Input
                value={testimonial.source}
                onChange={(e) => updateTestimonial(index, { source: e.target.value })}
                placeholder="Source"
              />
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addTestimonial}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Testimonial
          </Button>
        </div>
      </div>
    </div>
  );
};
