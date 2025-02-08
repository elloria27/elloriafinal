
import { ContentBlock, BlockContent } from "@/types/content-blocks";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ThanksPageEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const ThanksPageEditor = ({ block, onUpdate }: ThanksPageEditorProps) => {
  const handleChange = (field: string, value: string | number) => {
    const updatedContent = { ...block.content, [field]: value };
    onUpdate(block.id, updatedContent);
  };

  switch (block.type) {
    case "thanks_welcome":
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={block.content.title as string || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Welcome title"
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Textarea
              value={block.content.subtitle as string || ""}
              onChange={(e) => handleChange("subtitle", e.target.value)}
              placeholder="Welcome message"
            />
          </div>
          <div>
            <Label>Promo Code</Label>
            <Input
              value={block.content.promoCode as string || ""}
              onChange={(e) => handleChange("promoCode", e.target.value)}
              placeholder="Optional promo code"
            />
          </div>
          <div>
            <Label>Promo Button Text</Label>
            <Input
              value={block.content.promoButtonText as string || ""}
              onChange={(e) => handleChange("promoButtonText", e.target.value)}
              placeholder="Get Promo Code"
            />
          </div>
        </div>
      );

    case "thanks_referral":
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={block.content.title as string || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Referral title"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={block.content.description as string || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Referral description"
            />
          </div>
        </div>
      );

    case "thanks_special_offer":
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={block.content.title as string || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Special offer title"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={block.content.description as string || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Special offer description"
            />
          </div>
          <div>
            <Label>Button Text</Label>
            <Input
              value={block.content.buttonText as string || ""}
              onChange={(e) => handleChange("buttonText", e.target.value)}
              placeholder="Button text"
            />
          </div>
          <div>
            <Label>Button Link</Label>
            <Input
              value={block.content.buttonLink as string || ""}
              onChange={(e) => handleChange("buttonLink", e.target.value)}
              placeholder="Button link URL"
            />
          </div>
        </div>
      );

    case "thanks_newsletter":
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={block.content.title as string || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Newsletter title"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={block.content.description as string || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Newsletter description"
            />
          </div>
          <div>
            <Label>Button Text</Label>
            <Input
              value={block.content.buttonText as string || ""}
              onChange={(e) => handleChange("buttonText", e.target.value)}
              placeholder="Button text"
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
