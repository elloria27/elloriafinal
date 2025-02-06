import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ContentBlock, HeroContent } from "@/types/content-blocks";
import { MediaLibraryModal } from "../../media/MediaLibraryModal";
import { useState } from "react";

interface HeroEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: HeroContent) => void;
}

export const HeroEditor = ({ block, onUpdate }: HeroEditorProps) => {
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaType, setMediaType] = useState<"image" | "video">("video");
  const [currentField, setCurrentField] = useState<string>("");
  
  const content = block.content as HeroContent;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    console.log('Updating hero field:', field, 'with value:', e.target.value);
    onUpdate(block.id, {
      ...content,
      [field]: e.target.value
    });
  };

  const handleMediaSelect = (url: string) => {
    console.log('Selected media URL:', url);
    onUpdate(block.id, {
      ...content,
      [currentField]: url
    });
    setShowMediaLibrary(false);
  };

  const renderMediaField = (label: string, field: string, type: "image" | "video") => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={String(content[field] || "")}
          onChange={(e) => handleInputChange(e, field)}
          placeholder={`Enter ${label.toLowerCase()} URL`}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setMediaType(type);
            setCurrentField(field);
            setShowMediaLibrary(true);
          }}
        >
          Browse
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-4">
      <div>
        <Label>Title</Label>
        <Input
          value={String(content.title || "")}
          onChange={(e) => handleInputChange(e, "title")}
        />
      </div>
      <div>
        <Label>Subtitle</Label>
        <Input
          value={String(content.subtitle || "")}
          onChange={(e) => handleInputChange(e, "subtitle")}
        />
      </div>
      {renderMediaField("Video URL", "videoUrl", "video")}
      {renderMediaField("Video Poster", "videoPoster", "image")}
      <div>
        <Label>Shop Now Text</Label>
        <Input
          value={String(content.shopNowText || "")}
          onChange={(e) => handleInputChange(e, "shopNowText")}
        />
      </div>
      <div>
        <Label>Learn More Text</Label>
        <Input
          value={String(content.learnMoreText || "")}
          onChange={(e) => handleInputChange(e, "learnMoreText")}
        />
      </div>

      {showMediaLibrary && (
        <MediaLibraryModal
          open={showMediaLibrary}
          onClose={() => setShowMediaLibrary(false)}
          onSelect={handleMediaSelect}
          type={mediaType}
        />
      )}
    </div>
  );
};