import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MediaLibraryModal } from "@/components/admin/media/MediaLibraryModal";
import { Button } from "@/components/ui/button";
import { Image } from "lucide-react";
import { SustainabilityHeroContent } from "@/types/sustainability";

interface SustainabilityHeroEditorProps {
  content: SustainabilityHeroContent;
  onUpdate: (content: SustainabilityHeroContent) => void;
}

export const SustainabilityHeroEditor = ({ content, onUpdate }: SustainabilityHeroEditorProps) => {
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);

  const handleUpdate = (updates: Partial<SustainabilityHeroContent>) => {
    onUpdate({
      ...content,
      ...updates,
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Title</Label>
        <Input
          value={content.title}
          onChange={(e) => handleUpdate({ title: e.target.value })}
          placeholder="Enter hero title"
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={content.description}
          onChange={(e) => handleUpdate({ description: e.target.value })}
          placeholder="Enter hero description"
        />
      </div>

      <div>
        <Label>Background Image</Label>
        <div className="flex items-center gap-2 mt-1">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowMediaLibrary(true)}
          >
            <Image className="w-4 h-4 mr-2" />
            Select Image
          </Button>
          {content.background_image && (
            <img
              src={content.background_image}
              alt="Background preview"
              className="h-10 w-10 object-cover rounded"
            />
          )}
        </div>
      </div>

      <MediaLibraryModal
        open={showMediaLibrary}
        onClose={() => setShowMediaLibrary(false)}
        onSelect={(url) => {
          handleUpdate({ background_image: url });
          setShowMediaLibrary(false);
        }}
      />
    </div>
  );
};