import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { ContentBlock, TestimonialsContent } from "@/types/content-blocks";
import { Json } from "@/integrations/supabase/types";

interface TestimonialsEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: TestimonialsContent) => void;
}

export const TestimonialsEditor = ({ block, onUpdate }: TestimonialsEditorProps) => {
  const content = block.content as TestimonialsContent;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    console.log('Updating testimonials field:', field, 'with value:', e.target.value);
    onUpdate(block.id, {
      ...content,
      [field]: e.target.value
    });
  };

  const handleTestimonialAdd = () => {
    const testimonials = Array.isArray(content.testimonials) ? content.testimonials : [];
    const newTestimonial = {
      name: "New Client",
      rating: 5,
      text: "Share your experience",
      source: "Verified Purchase"
    } as Json;

    onUpdate(block.id, {
      ...content,
      testimonials: [...testimonials, newTestimonial]
    });
  };

  const handleTestimonialRemove = (index: number) => {
    const testimonials = Array.isArray(content.testimonials) ? [...content.testimonials] : [];
    testimonials.splice(index, 1);
    onUpdate(block.id, { ...content, testimonials });
  };

  const handleTestimonialUpdate = (index: number, field: string, value: string) => {
    const testimonials = Array.isArray(content.testimonials) ? [...content.testimonials] : [];
    const testimonial = testimonials[index] as { [key: string]: Json };
    const updatedTestimonial = { ...testimonial, [field]: field === 'rating' ? Number(value) : value } as Json;
    testimonials[index] = updatedTestimonial;
    onUpdate(block.id, { ...content, testimonials });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Title</Label>
        <Input
          value={String(content.title || "")}
          onChange={(e) => handleInputChange(e, "title")}
        />
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Testimonials</Label>
          <Button
            type="button"
            variant="outline"
            onClick={handleTestimonialAdd}
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Testimonial
          </Button>
        </div>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
          {Array.isArray(content.testimonials) && content.testimonials.map((testimonial, index) => {
            const typedTestimonial = testimonial as { name: string; rating: number; text: string; source: string };
            return (
              <div key={index} className="p-4 border rounded-lg space-y-3 bg-white">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Testimonial {index + 1}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleTestimonialRemove(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
                <div>
                  <Label>Name</Label>
                  <Input
                    value={String(typedTestimonial.name || "")}
                    onChange={(e) => handleTestimonialUpdate(index, "name", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Rating (1-5)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    value={String(typedTestimonial.rating || 5)}
                    onChange={(e) => handleTestimonialUpdate(index, "rating", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Text</Label>
                  <Input
                    value={String(typedTestimonial.text || "")}
                    onChange={(e) => handleTestimonialUpdate(index, "text", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Source</Label>
                  <Input
                    value={String(typedTestimonial.source || "")}
                    onChange={(e) => handleTestimonialUpdate(index, "source", e.target.value)}
                    placeholder="Verified Purchase, Instagram, etc."
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};