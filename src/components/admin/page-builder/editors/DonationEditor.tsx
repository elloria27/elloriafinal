
import { ContentBlock, BlockContent } from "@/types/content-blocks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DonationEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const DonationEditor = ({ block, onUpdate }: DonationEditorProps) => {
  const handleChange = (field: string, value: string) => {
    const newContent = { ...block.content, [field]: value };
    onUpdate(block.id, newContent);
  };

  switch (block.type) {
    case "donation_hero":
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={String(block.content.title || '')}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={String(block.content.description || '')}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="buttonText">Button Text</Label>
            <Input
              id="buttonText"
              value={String(block.content.buttonText || '')}
              onChange={(e) => handleChange("buttonText", e.target.value)}
            />
          </div>
        </div>
      );

    case "donation_impact":
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={String(block.content.title || '')}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={String(block.content.subtitle || '')}
              onChange={(e) => handleChange("subtitle", e.target.value)}
            />
          </div>
        </div>
      );

    case "donation_form":
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={String(block.content.title || '')}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={String(block.content.subtitle || '')}
              onChange={(e) => handleChange("subtitle", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="successMessage">Success Message</Label>
            <Input
              id="successMessage"
              value={String(block.content.successMessage || '')}
              onChange={(e) => handleChange("successMessage", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="buttonText">Button Text</Label>
            <Input
              id="buttonText"
              value={String(block.content.buttonText || '')}
              onChange={(e) => handleChange("buttonText", e.target.value)}
            />
          </div>
        </div>
      );

    case "donation_stories":
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={String(block.content.title || '')}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={String(block.content.subtitle || '')}
              onChange={(e) => handleChange("subtitle", e.target.value)}
            />
          </div>
        </div>
      );

    case "donation_partners":
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={String(block.content.title || '')}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={String(block.content.subtitle || '')}
              onChange={(e) => handleChange("subtitle", e.target.value)}
            />
          </div>
        </div>
      );

    case "donation_faq":
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={String(block.content.title || '')}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={String(block.content.subtitle || '')}
              onChange={(e) => handleChange("subtitle", e.target.value)}
            />
          </div>
        </div>
      );

    case "donation_join_movement":
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={String(block.content.title || '')}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={String(block.content.description || '')}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="buttonText">Button Text</Label>
            <Input
              id="buttonText"
              value={String(block.content.buttonText || '')}
              onChange={(e) => handleChange("buttonText", e.target.value)}
            />
          </div>
        </div>
      );

    default:
      return (
        <div className="p-4 text-center text-gray-500">
          No properties available for this component type
        </div>
      );
  }
};
