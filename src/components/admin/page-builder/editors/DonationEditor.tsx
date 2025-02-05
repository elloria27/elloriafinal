import { ContentBlock, BlockContent } from "@/types/content-blocks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface DonationEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const DonationEditor = ({ block, onUpdate }: DonationEditorProps) => {
  const handleChange = (field: string, value: any) => {
    const newContent = { ...block.content, [field]: value };
    onUpdate(block.id, newContent);
  };

  switch (block.type) {
    case "donation_hero":
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={block.content.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter hero title"
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              value={block.content.subtitle || ""}
              onChange={(e) => handleChange("subtitle", e.target.value)}
              placeholder="Enter hero subtitle"
            />
          </div>
          <div>
            <Label>Background Image URL</Label>
            <Input
              value={block.content.backgroundImage || ""}
              onChange={(e) => handleChange("backgroundImage", e.target.value)}
              placeholder="Enter background image URL"
            />
          </div>
        </div>
      );

    case "donation_form":
      return (
        <div className="space-y-4">
          <div>
            <Label>Fixed Amounts (comma-separated)</Label>
            <Input
              value={(block.content.fixedAmounts || []).join(", ")}
              onChange={(e) => handleChange("fixedAmounts", e.target.value.split(",").map(Number))}
              placeholder="25, 50, 100"
            />
          </div>
          <div>
            <Label>Button Text</Label>
            <Input
              value={block.content.buttonText || ""}
              onChange={(e) => handleChange("buttonText", e.target.value)}
              placeholder="Enter button text"
            />
          </div>
        </div>
      );

    case "donation_impact":
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={block.content.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter impact section title"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={block.content.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter impact description"
            />
          </div>
        </div>
      );

    case "donation_faq":
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={block.content.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter FAQ section title"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={block.content.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter FAQ description"
            />
          </div>
        </div>
      );

    case "donation_join_movement":
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={block.content.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter section title"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={block.content.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter description"
            />
          </div>
          <div>
            <Label>Button Text</Label>
            <Input
              value={block.content.buttonText || ""}
              onChange={(e) => handleChange("buttonText", e.target.value)}
              placeholder="Enter button text"
            />
          </div>
        </div>
      );

    case "donation_partners":
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={block.content.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter partners section title"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={block.content.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter partners description"
            />
          </div>
        </div>
      );

    case "donation_stories":
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={block.content.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter stories section title"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={block.content.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter stories description"
            />
          </div>
        </div>
      );

    default:
      return null;
  }
};