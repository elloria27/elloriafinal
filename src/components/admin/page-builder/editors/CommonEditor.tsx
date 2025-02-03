import { useState } from "react";
import { ContentBlock, BlockContent, ImageBlockContent, HeadingBlockContent } from "@/types/content-blocks";
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
              value={(block.content as ImageBlockContent).alt || ""}
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

    case "heading":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Text</Label>
            <Input
              value={(block.content as HeadingBlockContent).text || ""}
              onChange={(e) => handleChange("text", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Level</Label>
            <select
              value={(block.content as HeadingBlockContent).level || "h2"}
              onChange={(e) => handleChange("level", e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="h1">H1</option>
              <option value="h2">H2</option>
              <option value="h3">H3</option>
              <option value="h4">H4</option>
              <option value="h5">H5</option>
              <option value="h6">H6</option>
            </select>
          </div>
        </div>
      );

    case "text":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Content</Label>
            <textarea
              value={(block.content as any).text || ""}
              onChange={(e) => handleChange("text", e.target.value)}
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2"
            />
          </div>
        </div>
      );

    case "button":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Text</Label>
            <Input
              value={(block.content as any).text || ""}
              onChange={(e) => handleChange("text", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>URL</Label>
            <Input
              value={(block.content as any).url || ""}
              onChange={(e) => handleChange("url", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Variant</Label>
            <select
              value={(block.content as any).variant || "default"}
              onChange={(e) => handleChange("variant", e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2"
            >
              <option value="default">Default</option>
              <option value="secondary">Secondary</option>
              <option value="outline">Outline</option>
              <option value="ghost">Ghost</option>
            </select>
          </div>
        </div>
      );

    case "testimonials":
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
            {(block.content.items || []).map((item, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <Input
                  placeholder="Author"
                  value={item.author || ""}
                  onChange={(e) => {
                    const items = [...(block.content.items || [])];
                    items[index] = { ...items[index], author: e.target.value };
                    handleChange("items", items);
                  }}
                />
                <textarea
                  placeholder="Content"
                  value={item.content || ""}
                  onChange={(e) => {
                    const items = [...(block.content.items || [])];
                    items[index] = { ...items[index], content: e.target.value };
                    handleChange("items", items);
                  }}
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2"
                />
                <Button
                  variant="destructive"
                  onClick={() => {
                    const items = [...(block.content.items || [])];
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
                const items = [...(block.content.items || [])];
                items.push({ author: "", content: "" });
                handleChange("items", items);
              }}
            >
              Add Testimonial
            </Button>
          </div>
        </div>
      );

    case "blog_preview":
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
            <Label>Number of Posts</Label>
            <Input
              type="number"
              value={(block.content as any).count || 3}
              onChange={(e) => handleChange("count", parseInt(e.target.value))}
              min={1}
              max={12}
            />
          </div>
        </div>
      );

    default:
      return null;
  }
};
