
import { ContentBlock } from "@/types/content-blocks";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface DonationEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: any) => void;
}

export const DonationEditor = ({ block, onUpdate }: DonationEditorProps) => {
  const handleChange = (field: string, value: string) => {
    onUpdate(block.id, {
      ...block.content,
      [field]: value,
    });
  };

  const renderFields = () => {
    switch (block.type) {
      case "donation_hero":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={block.content.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter hero title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Textarea
                id="subtitle"
                value={block.content.subtitle || ""}
                onChange={(e) => handleChange("subtitle", e.target.value)}
                placeholder="Enter hero subtitle"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={block.content.buttonText || ""}
                onChange={(e) => handleChange("buttonText", e.target.value)}
                placeholder="Enter button text"
              />
            </div>
          </>
        );

      case "donation_impact":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={block.content.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter impact section title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Textarea
                id="subtitle"
                value={block.content.subtitle || ""}
                onChange={(e) => handleChange("subtitle", e.target.value)}
                placeholder="Enter impact section subtitle"
              />
            </div>
          </>
        );

      case "donation_form":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={block.content.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter form title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Textarea
                id="subtitle"
                value={block.content.subtitle || ""}
                onChange={(e) => handleChange("subtitle", e.target.value)}
                placeholder="Enter form subtitle"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={block.content.buttonText || ""}
                onChange={(e) => handleChange("buttonText", e.target.value)}
                placeholder="Enter button text"
              />
            </div>
          </>
        );

      case "donation_stories":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={block.content.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter stories section title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Textarea
                id="subtitle"
                value={block.content.subtitle || ""}
                onChange={(e) => handleChange("subtitle", e.target.value)}
                placeholder="Enter stories section subtitle"
              />
            </div>
          </>
        );

      case "donation_partners":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={block.content.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter partners section title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Textarea
                id="subtitle"
                value={block.content.subtitle || ""}
                onChange={(e) => handleChange("subtitle", e.target.value)}
                placeholder="Enter partners section subtitle"
              />
            </div>
          </>
        );

      case "donation_faq":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={block.content.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter FAQ section title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Textarea
                id="subtitle"
                value={block.content.subtitle || ""}
                onChange={(e) => handleChange("subtitle", e.target.value)}
                placeholder="Enter FAQ section subtitle"
              />
            </div>
          </>
        );

      case "donation_join_movement":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={block.content.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Enter join movement title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={block.content.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Enter join movement description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buttonText">Button Text</Label>
              <Input
                id="buttonText"
                value={block.content.buttonText || ""}
                onChange={(e) => handleChange("buttonText", e.target.value)}
                placeholder="Enter button text"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return <div className="space-y-6">{renderFields()}</div>;
};
