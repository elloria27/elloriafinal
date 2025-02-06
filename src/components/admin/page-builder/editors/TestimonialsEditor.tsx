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

interface TestimonialItem {
  name: string;
  rating: number;
  text: string;
  source: string;
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
    const testimonials = getTestimonials();

    const newTestimonial: TestimonialItem = {
      name: "New Client",
      rating: 5,
      text: "Share your experience",
      source: "Verified Purchase"
    };

    onUpdate(block.id, {
      ...content,
      testimonials: [...testimonials, newTestimonial] as Json
    });
  };

  const handleTestimonialRemove = (index: number) => {
    const testimonials = getTestimonials();
    testimonials.splice(index, 1);
    onUpdate(block.id, { ...content, testimonials: testimonials as Json });
  };

  const handleTestimonialUpdate = (index: number, field: string, value: string) => {
    const testimonials = getTestimonials();
    const testimonial = testimonials[index];
    const updatedTestimonial = { 
      ...testimonial, 
      [field]: field === 'rating' ? Number(value) : value 
    };
    testimonials[index] = updatedTestimonial;
    onUpdate(block.id, { ...content, testimonials: testimonials as Json });
  };

  const getTestimonials = (): TestimonialItem[] => {
    if (!content.testimonials) return [];
    if (Array.isArray(content.testimonials)) {
      return content.testimonials.map(t => {
        if (typeof t === 'string') {
          try {
            return JSON.parse(t);
          } catch {
            return null;
          }
        }
        return t;
      }).filter((t): t is TestimonialItem => t !== null);
    }
    return [];
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
          {getTestimonials().map((testimonial, index) => (
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
                  value={String(testimonial.name || "")}
                  onChange={(e) => handleTestimonialUpdate(index, "name", e.target.value)}
                />
              </div>
              <div>
                <Label>Rating (1-5)</Label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={String(testimonial.rating || 5)}
                  onChange={(e) => handleTestimonialUpdate(index, "rating", e.target.value)}
                />
              </div>
              <div>
                <Label>Text</Label>
                <Input
                  value={String(testimonial.text || "")}
                  onChange={(e) => handleTestimonialUpdate(index, "text", e.target.value)}
                />
              </div>
              <div>
                <Label>Source</Label>
                <Input
                  value={String(testimonial.source || "")}
                  onChange={(e) => handleTestimonialUpdate(index, "source", e.target.value)}
                  placeholder="Verified Purchase, Instagram, etc."
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};