import { useState, useEffect } from "react";
import { ContentBlock, BlockContent } from "@/types/content-blocks";
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
  const [localContent, setLocalContent] = useState(block.content);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [currentField, setCurrentField] = useState<string>("");

  // Reset local content when block changes
  useEffect(() => {
    console.log("Block changed, resetting local content:", block.content);
    setLocalContent(block.content);
  }, [block.id, block.content]);

  const handleChange = (key: string, value: any) => {
    const updatedContent = { ...localContent, [key]: value };
    setLocalContent(updatedContent);
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
          value={block.content[field] as string || ""}
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
      {block.content[field] && (
        <div className="mt-2">
          {type === "image" ? (
            <img
              src={block.content[field] as string}
              alt={label}
              className="max-w-xs rounded"
            />
          ) : (
            <video
              src={block.content[field] as string}
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
          {renderMediaField("Image", "src", "image")}
          <div className="space-y-2">
            <Label>Alt Text</Label>
            <Input
              value={block.content.alt as string || ""}
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

    case "video":
      return (
        <div className="space-y-4">
          {renderMediaField("Video", "src", "video")}
          <div className="space-y-2">
            <Label>Poster Image</Label>
            {renderMediaField("Poster Image", "poster", "image")}
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
              value={block.content.text as string || ""}
              onChange={(e) => handleChange("text", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Level</Label>
            <select
              value={block.content.level as string || "h2"}
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
              value={block.content.text as string || ""}
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
              value={block.content.text as string || ""}
              onChange={(e) => handleChange("text", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>URL</Label>
            <Input
              value={block.content.url as string || ""}
              onChange={(e) => handleChange("url", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Variant</Label>
            <select
              value={block.content.variant as string || "default"}
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
              value={block.content.title as string || ""}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Testimonials</Label>
            {(block.content.items as any[] || []).map((item, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <Input
                  placeholder="Author"
                  value={item.author || ""}
                  onChange={(e) => {
                    const items = [...(block.content.items as any[] || [])];
                    items[index] = { ...items[index], author: e.target.value };
                    handleChange("items", items);
                  }}
                />
                <textarea
                  placeholder="Content"
                  value={item.content || ""}
                  onChange={(e) => {
                    const items = [...(block.content.items as any[] || [])];
                    items[index] = { ...items[index], content: e.target.value };
                    handleChange("items", items);
                  }}
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2"
                />
                <Button
                  variant="destructive"
                  onClick={() => {
                    const items = [...(block.content.items as any[] || [])];
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
                const items = [...(block.content.items as any[] || [])];
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
              value={block.content.title as string || ""}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Number of Posts</Label>
            <Input
              type="number"
              value={block.content.count as number || 3}
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