import { useState } from "react";
import { ContentBlock, BlockContent } from "@/types/content-blocks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MediaLibraryModal } from "@/components/admin/media/MediaLibraryModal";
import { Image, Video } from "lucide-react";

interface HomePageEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const HomePageEditor = ({ block, onUpdate }: HomePageEditorProps) => {
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [currentField, setCurrentField] = useState<string>("");

  const handleChange = (key: string, value: any) => {
    const updatedContent = { 
      ...block.content, 
      [key]: value 
    };
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
    case "hero":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={block.content.title as string || ""}
              onChange={(e) => {
                const newValue = e.target.value;
                const updatedContent = {
                  ...block.content,
                  title: newValue
                };
                onUpdate(block.id, updatedContent);
              }}
            />
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={block.content.subtitle as string || ""}
              onChange={(e) => {
                const newValue = e.target.value;
                const updatedContent = {
                  ...block.content,
                  subtitle: newValue
                };
                onUpdate(block.id, updatedContent);
              }}
            />
          </div>
          
          {/* Shop Now Button Settings */}
          <div className="space-y-2">
            <Label>Shop Now Button Text</Label>
            <Input
              value={block.content.shopNowText as string || "Shop Now"}
              onChange={(e) => {
                const newValue = e.target.value;
                const updatedContent = {
                  ...block.content,
                  shopNowText: newValue
                };
                onUpdate(block.id, updatedContent);
              }}
            />
          </div>
          
          {/* Learn More Button Settings */}
          <div className="space-y-2">
            <Label>Learn More Button Text</Label>
            <Input
              value={block.content.learnMoreText as string || "Learn More"}
              onChange={(e) => {
                const newValue = e.target.value;
                const updatedContent = {
                  ...block.content,
                  learnMoreText: newValue
                };
                onUpdate(block.id, updatedContent);
              }}
            />
          </div>

          {/* Video Settings */}
          {renderMediaField("Video", "videoUrl", "video")}
          {renderMediaField("Video Cover (Poster)", "videoPoster", "image")}
          
          <MediaLibraryModal
            open={showMediaLibrary}
            onClose={() => setShowMediaLibrary(false)}
            onSelect={handleMediaSelect}
            type={mediaType}
          />
        </div>
      );

    case "game_changer":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={block.content.title as string || ""}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          {renderMediaField("Image", "image", "image")}
          <MediaLibraryModal
            open={showMediaLibrary}
            onClose={() => setShowMediaLibrary(false)}
            onSelect={handleMediaSelect}
            type={mediaType}
          />
        </div>
      );

    case "store_brands":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={block.content.title as string || ""}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          {renderMediaField("Image", "image", "image")}
          <MediaLibraryModal
            open={showMediaLibrary}
            onClose={() => setShowMediaLibrary(false)}
            onSelect={handleMediaSelect}
            type={mediaType}
          />
        </div>
      );

    case "sustainability":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={block.content.title as string || ""}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          {renderMediaField("Image", "image", "image")}
          <MediaLibraryModal
            open={showMediaLibrary}
            onClose={() => setShowMediaLibrary(false)}
            onSelect={handleMediaSelect}
            type={mediaType}
          />
        </div>
      );

    case "product_carousel":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={block.content.title as string || ""}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          {renderMediaField("Image", "image", "image")}
          <MediaLibraryModal
            open={showMediaLibrary}
            onClose={() => setShowMediaLibrary(false)}
            onSelect={handleMediaSelect}
            type={mediaType}
          />
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
          {renderMediaField("Image", "image", "image")}
          <MediaLibraryModal
            open={showMediaLibrary}
            onClose={() => setShowMediaLibrary(false)}
            onSelect={handleMediaSelect}
            type={mediaType}
          />
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
          {renderMediaField("Image", "image", "image")}
          <MediaLibraryModal
            open={showMediaLibrary}
            onClose={() => setShowMediaLibrary(false)}
            onSelect={handleMediaSelect}
            type={mediaType}
          />
        </div>
      );

    case "newsletter":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={block.content.title as string || ""}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          {renderMediaField("Image", "image", "image")}
          <MediaLibraryModal
            open={showMediaLibrary}
            onClose={() => setShowMediaLibrary(false)}
            onSelect={handleMediaSelect}
            type={mediaType}
          />
        </div>
      );

    default:
      return null;
  }
};