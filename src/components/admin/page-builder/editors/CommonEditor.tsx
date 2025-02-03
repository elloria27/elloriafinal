import { useState } from "react";
import { ContentBlock, BlockContent, FeatureItem } from "@/types/content-blocks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MediaLibraryModal } from "@/components/admin/media/MediaLibraryModal";
import { Image, Video } from "lucide-react";

interface CommonEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const CommonEditor = ({ block, onUpdate }: CommonEditorProps) => {
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [currentField, setCurrentField] = useState<string>("");

  const handleChange = (key: string, value: any) => {
    const updatedContent = { ...block.content, [key]: value };
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
          value={(block.content as any)[field] || ""}
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
      {(block.content as any)[field] && (
        <div className="mt-2">
          {type === "image" ? (
            <img
              src={(block.content as any)[field]}
              alt={label}
              className="max-w-xs rounded"
            />
          ) : (
            <video
              src={(block.content as any)[field]}
              controls
              className="max-w-xs rounded"
            />
          )}
        </div>
      )}
    </div>
  );

  switch (block.type) {
    case "image":
      return (
        <div className="space-y-4">
          {renderMediaField("Image", "url", "image")}
          <div className="space-y-2">
            <Label>Alt Text</Label>
            <Input
              value={(block.content as any).alt || ""}
              onChange={(e) => handleChange("alt", e.target.value)}
              placeholder="Enter alt text..."
            />
          </div>
          <MediaLibraryModal
            open={showMediaLibrary}
            onClose={() => setShowMediaLibrary(false)}
            onSelect={handleMediaSelect}
            type={mediaType}
          />
        </div>
      );

    case "testimonials":
      const testimonialItems = Array.isArray((block.content as any).items) 
        ? (block.content as any).items 
        : [];

      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={(block.content as any).title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Testimonials</Label>
            {testimonialItems.map((item: any, index: number) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <Input
                  placeholder="Author"
                  value={item.author || ""}
                  onChange={(e) => {
                    const items = [...testimonialItems];
                    items[index] = { ...items[index], author: e.target.value };
                    handleChange("items", items);
                  }}
                />
                <textarea
                  placeholder="Content"
                  value={item.content || ""}
                  onChange={(e) => {
                    const items = [...testimonialItems];
                    items[index] = { ...items[index], content: e.target.value };
                    handleChange("items", items);
                  }}
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2"
                />
                <Button
                  variant="destructive"
                  onClick={() => {
                    const items = [...testimonialItems];
                    items.splice(index, 1);
                    handleChange("items", items);
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}
            <Button
              onClick={() => {
                const items = [...testimonialItems];
                items.push({ author: "", content: "" });
                handleChange("items", items);
              }}
            >
              Add Testimonial
            </Button>
          </div>
        </div>
      );

    default:
      return null;
  }
};
