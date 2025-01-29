import { useState } from "react";
import { ContentBlock, BlockContent } from "@/types/content-blocks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MediaLibraryModal } from "@/components/admin/media/MediaLibraryModal";
import { Plus, Trash2, Image, Video } from "lucide-react";

interface ContactPageEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const ContactPageEditor = ({ block, onUpdate }: ContactPageEditorProps) => {
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [currentField, setCurrentField] = useState<string>("");
  const [content, setContent] = useState<BlockContent>(block.content);

  const handleChange = (key: string, value: any) => {
    const updatedContent = { ...content, [key]: value };
    setContent(updatedContent);
    onUpdate(block.id, updatedContent);
  };

  const openMediaLibrary = (type: "image" | "video", field: string) => {
    setMediaType(type);
    setCurrentField(field);
    setShowMediaLibrary(true);
  };

  const handleMediaSelect = (url: string) => {
    handleChange(currentField, url);
    setShowMediaLibrary(false);
  };

  const renderMediaField = (label: string, field: string, type: "image" | "video") => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={content[field] as string || ""}
          readOnly
          placeholder={`Select ${type}...`}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => openMediaLibrary(type, field)}
        >
          {type === "image" ? <Image className="h-4 w-4" /> : <Video className="h-4 w-4" />}
        </Button>
      </div>
      {content[field] && (
        <div className="mt-2">
          {type === "image" ? (
            <img
              src={content[field] as string}
              alt={label}
              className="max-w-xs rounded"
            />
          ) : (
            <video
              src={content[field] as string}
              controls
              className="max-w-xs rounded"
            />
          )}
        </div>
      )}
    </div>
  );

  const handleArrayChange = (key: string, index: number, value: any) => {
    const array = [...(content[key] as any[] || [])];
    array[index] = { ...array[index], ...value };
    handleChange(key, array);
  };

  const addArrayItem = (key: string, defaultItem: any) => {
    const array = [...(content[key] as any[] || [])];
    array.push(defaultItem);
    handleChange(key, array);
  };

  const removeArrayItem = (key: string, index: number) => {
    const array = [...(content[key] as any[] || [])];
    array.splice(index, 1);
    handleChange(key, array);
  };

  switch (block.type) {
    case "contact_hero":
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={content.title as string || ""}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={content.description as string || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
          {renderMediaField("Background Image", "backgroundImage", "image")}
          <MediaLibraryModal
            open={showMediaLibrary}
            onClose={() => setShowMediaLibrary(false)}
            onSelect={handleMediaSelect}
            type={mediaType}
          />
        </div>
      );

    case "contact_details":
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={content.title as string || ""}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={content.description as string || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
          <div>
            <Label>Address</Label>
            <Input
              value={content.address as string || ""}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>
          <div>
            <Label>Phone</Label>
            <Input
              value={content.phone as string || ""}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              value={content.email as string || ""}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
        </div>
      );

    case "contact_form":
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={content.title as string || ""}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={content.description as string || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
        </div>
      );

    case "contact_faq":
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={content.title as string || ""}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={content.description as string || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
          <div>
            <Label>FAQs</Label>
            <div className="space-y-4">
              {(content.faqs as any[] || []).map((faq, index) => (
                <div key={index} className="p-4 border rounded space-y-2">
                  <Input
                    placeholder="Question"
                    value={faq.question || ""}
                    onChange={(e) =>
                      handleArrayChange("faqs", index, {
                        ...faq,
                        question: e.target.value,
                      })
                    }
                  />
                  <Textarea
                    placeholder="Answer"
                    value={faq.answer || ""}
                    onChange={(e) =>
                      handleArrayChange("faqs", index, {
                        ...faq,
                        answer: e.target.value,
                      })
                    }
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeArrayItem("faqs", index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() =>
                  addArrayItem("faqs", {
                    question: "",
                    answer: "",
                  })
                }
              >
                <Plus className="h-4 w-4 mr-2" /> Add FAQ
              </Button>
            </div>
          </div>
        </div>
      );

    case "contact_business":
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={content.title as string || ""}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={content.description as string || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input
              value={content.email as string || ""}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>
          <div>
            <Label>Button Text</Label>
            <Input
              value={content.buttonText as string || ""}
              onChange={(e) => handleChange("buttonText", e.target.value)}
            />
          </div>
          <div>
            <Label>Button Link</Label>
            <Input
              value={content.buttonLink as string || ""}
              onChange={(e) => handleChange("buttonLink", e.target.value)}
            />
          </div>
        </div>
      );

    default:
      return null;
  }
};
