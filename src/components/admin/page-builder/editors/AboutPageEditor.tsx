import { useEffect, useState } from "react";
import { BlockEditorProps } from "@/types/content-blocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export const AboutPageEditor = ({ block, onUpdate }: BlockEditorProps) => {
  const [title, setTitle] = useState(block.content?.title as string || "");
  const [description, setDescription] = useState(block.content?.description as string || "");

  useEffect(() => {
    setTitle(block.content?.title as string || "");
    setDescription(block.content?.description as string || "");
  }, [block]);

  const handleChange = (field: string, value: any) => {
    onUpdate({
      ...block,
      content: {
        ...(block.content as Record<string, unknown>),
        [field]: value
      }
    });
  };

  const handleSave = () => {
    handleChange("title", title);
    handleChange("description", description);
    toast.success("Changes saved successfully!");
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
        />
      </div>
      <Button onClick={handleSave}>Save Changes</Button>
    </div>
  );
};