import { useState } from "react";
import { ContentBlock, BlockContent, AboutHeroContent } from "@/types/content-blocks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MediaLibraryModal } from "@/components/admin/media/MediaLibraryModal";

interface AboutPageEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const AboutPageEditor = ({ block, onUpdate }: AboutPageEditorProps) => {
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);

  const handleChange = (key: string, value: any) => {
    console.log("Updating content:", key, value);
    const updatedContent = { ...block.content, [key]: value };
    onUpdate(block.id, updatedContent);
  };

  const handleImageSelect = (url: string) => {
    handleChange('backgroundImage', url);
    setShowMediaLibrary(false);
  };

  switch (block.type) {
    case "about_hero_section":
      const heroContent = block.content as AboutHeroContent;
      
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={heroContent.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter title"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={heroContent.subtitle || ""}
              onChange={(e) => handleChange("subtitle", e.target.value)}
              placeholder="Enter subtitle"
            />
          </div>

          <div className="space-y-2">
            <Label>Background Image</Label>
            <div className="flex items-center gap-2">
              <Input
                value={heroContent.backgroundImage || ""}
                onChange={(e) => handleChange("backgroundImage", e.target.value)}
                placeholder="Enter image URL"
                readOnly
              />
              <Button 
                type="button"
                variant="outline"
                onClick={() => setShowMediaLibrary(true)}
              >
                Browse
              </Button>
            </div>
            {heroContent.backgroundImage && (
              <img 
                src={heroContent.backgroundImage} 
                alt="Background preview" 
                className="mt-2 max-h-40 rounded-lg"
              />
            )}
          </div>

          <MediaLibraryModal
            open={showMediaLibrary}
            onClose={() => setShowMediaLibrary(false)}
            onSelect={handleImageSelect}
          />
        </div>
      );
      
    default:
      return null;
  }
};