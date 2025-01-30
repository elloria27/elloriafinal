import { useState } from "react";
import { ContentBlock, BlockContent } from "@/types/content-blocks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MediaLibraryModal } from "@/components/admin/media/MediaLibraryModal";
import { Image, Video, Plus, Trash } from "lucide-react";

interface HomePageEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const HomePageEditor = ({ block, onUpdate }: HomePageEditorProps) => {
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

  const renderFeaturesList = (features: any[] = [], updateKey: string) => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label>Features</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            const newFeature = {
              icon: "Star",
              title: "New Feature",
              description: "Feature description",
            };
            handleChange(updateKey, [...features, newFeature]);
          }}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Feature
        </Button>
      </div>
      {features.map((feature, index) => (
        <div key={index} className="p-4 border rounded-lg space-y-4">
          <div className="flex justify-between">
            <Label>Feature {index + 1}</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                const updatedFeatures = features.filter((_, i) => i !== index);
                handleChange(updateKey, updatedFeatures);
              }}
            >
              <Trash className="h-4 w-4 text-red-500" />
            </Button>
          </div>
          <Input
            value={feature.title}
            onChange={(e) => {
              const updatedFeatures = [...features];
              updatedFeatures[index] = { ...feature, title: e.target.value };
              handleChange(updateKey, updatedFeatures);
            }}
            placeholder="Feature title"
          />
          <Input
            value={feature.icon}
            onChange={(e) => {
              const updatedFeatures = [...features];
              updatedFeatures[index] = { ...feature, icon: e.target.value };
              handleChange(updateKey, updatedFeatures);
            }}
            placeholder="Feature icon"
          />
          <Textarea
            value={feature.description}
            onChange={(e) => {
              const updatedFeatures = [...features];
              updatedFeatures[index] = { ...feature, description: e.target.value };
              handleChange(updateKey, updatedFeatures);
            }}
            placeholder="Feature description"
          />
        </div>
      ))}
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
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter hero title"
            />
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={block.content.subtitle as string || ""}
              onChange={(e) => handleChange("subtitle", e.target.value)}
              placeholder="Enter hero subtitle"
            />
          </div>
          {renderMediaField("Video", "videoUrl", "video")}
          <MediaLibraryModal
            open={showMediaLibrary}
            onClose={() => setShowMediaLibrary(false)}
            onSelect={handleMediaSelect}
            type={mediaType}
          />
        </div>
      );

    case "features":
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
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={block.content.subtitle as string || ""}
              onChange={(e) => handleChange("subtitle", e.target.value)}
            />
          </div>
          {renderFeaturesList(block.content.features as any[], "features")}
          <MediaLibraryModal
            open={showMediaLibrary}
            onClose={() => setShowMediaLibrary(false)}
            onSelect={handleMediaSelect}
            type={mediaType}
          />
        </div>
      );

    // ... Add similar sections for other block types

    default:
      return (
        <div className="p-4 text-center text-gray-500">
          Editor not implemented for this component type yet
        </div>
      );
  }
};