import { useState } from "react";
import { ContentBlock, BlockContent, HeroContent } from "@/types/content-blocks";
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
    } as BlockContent;
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
      const heroContent = block.content as HeroContent;
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={heroContent.title || ""}
              onChange={(e) => {
                const updatedContent: HeroContent = {
                  ...heroContent,
                  title: e.target.value
                };
                onUpdate(block.id, updatedContent);
              }}
            />
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={heroContent.subtitle || ""}
              onChange={(e) => {
                const updatedContent: HeroContent = {
                  ...heroContent,
                  subtitle: e.target.value
                };
                onUpdate(block.id, updatedContent);
              }}
            />
          </div>
          
          {/* Shop Now Button Settings */}
          <div className="space-y-2">
            <Label>Shop Now Button Text</Label>
            <Input
              value={heroContent.shopNowText || "Shop Now"}
              onChange={(e) => {
                const updatedContent: HeroContent = {
                  ...heroContent,
                  shopNowText: e.target.value
                };
                onUpdate(block.id, updatedContent);
              }}
            />
          </div>
          
          {/* Learn More Button Settings */}
          <div className="space-y-2">
            <Label>Learn More Button Text</Label>
            <Input
              value={heroContent.learnMoreText || "Learn More"}
              onChange={(e) => {
                const updatedContent: HeroContent = {
                  ...heroContent,
                  learnMoreText: e.target.value
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
