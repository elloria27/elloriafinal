import { ContentBlock } from "@/types/content-blocks";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MediaLibraryModal } from "../../media/MediaLibraryModal";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";

interface DonationHeroEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: any) => void;
}

export const DonationHeroEditor = ({ block, onUpdate }: DonationHeroEditorProps) => {
  const [isMediaLibraryOpen, setIsMediaLibraryOpen] = useState(false);

  const handleUpdate = (field: string, value: string) => {
    const updatedContent = {
      ...block.content,
      [field]: value,
    };
    onUpdate(block.id, updatedContent);
  };

  const handleImageSelect = (url: string) => {
    handleUpdate('backgroundImage', url);
    setIsMediaLibraryOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={block.content.title || ''}
          onChange={(e) => handleUpdate('title', e.target.value)}
          placeholder="Enter hero title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subtitle">Subtitle</Label>
        <Textarea
          id="subtitle"
          value={block.content.subtitle || ''}
          onChange={(e) => handleUpdate('subtitle', e.target.value)}
          placeholder="Enter hero subtitle"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="buttonText">Button Text</Label>
        <Input
          id="buttonText"
          value={block.content.buttonText || ''}
          onChange={(e) => handleUpdate('buttonText', e.target.value)}
          placeholder="Enter button text"
        />
      </div>

      <div className="space-y-2">
        <Label>Background Image</Label>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsMediaLibraryOpen(true)}
          >
            <Image className="h-4 w-4 mr-2" />
            Select Image
          </Button>
          {block.content.backgroundImage && (
            <span className="text-sm text-gray-500">
              Image selected
            </span>
          )}
        </div>
      </div>

      <MediaLibraryModal
        open={isMediaLibraryOpen}
        onClose={() => setIsMediaLibraryOpen(false)}
        onSelect={handleImageSelect}
      />
    </div>
  );
};