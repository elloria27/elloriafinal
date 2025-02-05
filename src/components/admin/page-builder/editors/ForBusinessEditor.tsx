import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ContentBlock, ForBusinessHeroContent, BusinessSolutionsContent, BusinessContactContent } from "@/types/content-blocks";
import { Json } from "@/integrations/supabase/types";

interface ForBusinessEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: any) => void;
}

export const ForBusinessEditor = ({ block, onUpdate }: ForBusinessEditorProps) => {
  const handleContentChange = (updates: Partial<ForBusinessHeroContent | BusinessSolutionsContent | BusinessContactContent>) => {
    onUpdate(block.id, {
      ...block.content,
      ...updates,
    });
  };

  switch (block.type) {
    case "business_hero":
      const heroContent = block.content as ForBusinessHeroContent;
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={heroContent.title || ""}
              onChange={(e) => handleContentChange({ title: e.target.value } as Partial<ForBusinessHeroContent>)}
            />
          </div>
          <div>
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={heroContent.subtitle || ""}
              onChange={(e) => handleContentChange({ subtitle: e.target.value } as Partial<ForBusinessHeroContent>)}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={heroContent.description || ""}
              onChange={(e) => handleContentChange({ description: e.target.value } as Partial<ForBusinessHeroContent>)}
            />
          </div>
        </div>
      );

    case "business_solutions":
      const solutionsContent = block.content as BusinessSolutionsContent;
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Section Title</Label>
            <Input
              id="title"
              value={solutionsContent.title || ""}
              onChange={(e) => handleContentChange({ title: e.target.value } as Partial<BusinessSolutionsContent>)}
            />
          </div>
          <div>
            <Label htmlFor="description">Section Description</Label>
            <Input
              id="description"
              value={solutionsContent.description || ""}
              onChange={(e) => handleContentChange({ description: e.target.value } as Partial<BusinessSolutionsContent>)}
            />
          </div>
        </div>
      );

    case "business_contact":
      const contactContent = block.content as BusinessContactContent;
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="email">Contact Email</Label>
            <Input
              id="email"
              value={contactContent.email || ""}
              onChange={(e) => handleContentChange({ email: e.target.value } as Partial<BusinessContactContent>)}
            />
          </div>
          <div>
            <Label htmlFor="phone">Contact Phone</Label>
            <Input
              id="phone"
              value={contactContent.phone || ""}
              onChange={(e) => handleContentChange({ phone: e.target.value } as Partial<BusinessContactContent>)}
            />
          </div>
        </div>
      );

    default:
      return null;
  }
};