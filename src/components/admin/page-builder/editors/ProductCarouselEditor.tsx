import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ContentBlock, ProductCarouselContent } from "@/types/content-blocks";

interface ProductCarouselEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: ProductCarouselContent) => void;
}

export const ProductCarouselEditor = ({ block, onUpdate }: ProductCarouselEditorProps) => {
  const content = block.content as ProductCarouselContent;

  const handleChange = (field: keyof ProductCarouselContent, value: string) => {
    console.log('Updating product carousel field:', field, value);
    onUpdate(block.id, {
      ...content,
      [field]: value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={content.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter section title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subtitle">Subtitle</Label>
        <Input
          id="subtitle"
          value={content.subtitle || ''}
          onChange={(e) => handleChange('subtitle', e.target.value)}
          placeholder="Enter section subtitle"
        />
      </div>
    </div>
  );
};