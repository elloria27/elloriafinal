import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SustainabilityCTAContent } from "@/types/sustainability";

interface SustainabilityCTAEditorProps {
  content: SustainabilityCTAContent;
  onUpdate: (content: SustainabilityCTAContent) => void;
}

export const SustainabilityCTAEditor = ({ content, onUpdate }: SustainabilityCTAEditorProps) => {
  const handleUpdate = (updates: Partial<SustainabilityCTAContent>) => {
    onUpdate({
      ...content,
      ...updates,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Title</Label>
        <Input
          value={content.title}
          onChange={(e) => handleUpdate({ title: e.target.value })}
          placeholder="Enter CTA title"
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={content.description}
          onChange={(e) => handleUpdate({ description: e.target.value })}
          placeholder="Enter CTA description"
        />
      </div>

      <div>
        <Label>Button Text</Label>
        <Input
          value={content.button_text}
          onChange={(e) => handleUpdate({ button_text: e.target.value })}
          placeholder="Enter button text"
        />
      </div>

      <div>
        <Label>Button Link</Label>
        <Input
          value={content.button_link}
          onChange={(e) => handleUpdate({ button_link: e.target.value })}
          placeholder="Enter button link"
        />
      </div>
    </div>
  );
};