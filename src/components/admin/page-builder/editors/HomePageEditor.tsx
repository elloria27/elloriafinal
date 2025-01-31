import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { ContentBlock, HeroContent, FeaturesContent } from "@/types/content-blocks";
import { MediaLibraryModal } from "../../media/MediaLibraryModal";

interface HomePageEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: any) => void;
}

export const HomePageEditor = ({ block, onUpdate }: HomePageEditorProps) => {
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [currentField, setCurrentField] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    console.log('Handling input change for', field, 'with value:', e.target.value);
    const updatedContent = {
      ...block.content,
      [field]: e.target.value
    };
    onUpdate(block.id, updatedContent);
  };

  const handleMediaSelect = (url: string) => {
    console.log('Selected media URL:', url);
    const updatedContent = {
      ...block.content,
      [currentField]: url
    };
    onUpdate(block.id, updatedContent);
    setShowMediaLibrary(false);
  };

  const handleFeatureAdd = () => {
    const content = block.content as FeaturesContent;
    const features = Array.isArray(content.features) ? content.features : [];
    const updatedContent = {
      ...content,
      features: [
        ...features,
        {
          icon: "Check",
          title: "New Feature",
          description: "Feature description"
        }
      ]
    };
    onUpdate(block.id, updatedContent);
  };

  const handleFeatureRemove = (index: number) => {
    const content = block.content as FeaturesContent;
    const features = Array.isArray(content.features) ? [...content.features] : [];
    features.splice(index, 1);
    onUpdate(block.id, { ...content, features });
  };

  const handleFeatureUpdate = (index: number, field: string, value: string) => {
    const content = block.content as FeaturesContent;
    const features = Array.isArray(content.features) ? [...content.features] : [];
    features[index] = { ...features[index], [field]: value };
    onUpdate(block.id, { ...content, features });
  };

  const renderMediaField = (label: string, field: string, type: "image" | "video") => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={block.content[field] as string || ""}
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

  switch (block.type) {
    case "hero":
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={block.content.title as string || ""}
              onChange={(e) => handleInputChange(e, "title")}
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              value={block.content.subtitle as string || ""}
              onChange={(e) => handleInputChange(e, "subtitle")}
            />
          </div>
          {renderMediaField("Video URL", "videoUrl", "video")}
          {renderMediaField("Video Poster", "videoPoster", "image")}
          <div>
            <Label>Shop Now Text</Label>
            <Input
              value={block.content.shopNowText as string || ""}
              onChange={(e) => handleInputChange(e, "shopNowText")}
            />
          </div>
          <div>
            <Label>Learn More Text</Label>
            <Input
              value={block.content.learnMoreText as string || ""}
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

    case "features":
      const featuresContent = block.content as FeaturesContent;
      return (
        <div className="space-y-6">
          <div>
            <Label>Title</Label>
            <Input
              value={featuresContent.title || ""}
              onChange={(e) => handleInputChange(e, "title")}
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              value={featuresContent.subtitle || ""}
              onChange={(e) => handleInputChange(e, "subtitle")}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              value={featuresContent.description || ""}
              onChange={(e) => handleInputChange(e, "description")}
            />
          </div>
          
          <div className="space-y-4">
            <Label>Features</Label>
            {Array.isArray(featuresContent.features) && featuresContent.features.map((feature, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Feature {index + 1}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFeatureRemove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <Label>Icon</Label>
                  <Input
                    value={feature.icon}
                    onChange={(e) => handleFeatureUpdate(index, "icon", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={feature.title}
                    onChange={(e) => handleFeatureUpdate(index, "title", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={feature.description}
                    onChange={(e) => handleFeatureUpdate(index, "description", e.target.value)}
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={handleFeatureAdd}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Feature
            </Button>
          </div>
        </div>
      );

    default:
      return null;
  }
};