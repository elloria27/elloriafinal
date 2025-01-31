import { useState } from "react";
import { ContentBlock, BlockContent } from "@/types/content-blocks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MediaLibraryModal } from "@/components/admin/media/MediaLibraryModal";
import { Image, Video, Plus, Minus } from "lucide-react";

interface AboutPageEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const AboutPageEditor = ({ block, onUpdate }: AboutPageEditorProps) => {
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [currentField, setCurrentField] = useState<string>("");

  const handleChange = (key: string, value: any) => {
    console.log("Updating content:", key, value);
    const updatedContent = { ...block.content, [key]: value };
    onUpdate(block.id, updatedContent);
  };

  const openMediaLibrary = (type: "image" | "video", field: string) => {
    setMediaType(type);
    setCurrentField(field);
    setShowMediaLibrary(true);
  };

  const handleMediaSelect = (url: string) => {
    console.log("Selected media:", currentField, url);
    handleChange(currentField, url);
    setShowMediaLibrary(false);
  };

  const handleStatUpdate = (index: number, field: string, value: string) => {
    const updatedStats = [...(block.content.stats || [])];
    updatedStats[index] = {
      ...updatedStats[index],
      [field]: value,
    };
    handleChange("stats", updatedStats);
  };

  const addStat = () => {
    const newStat = {
      icon: "Leaf",
      value: "New Value",
      label: "New Label",
      description: "New Description",
    };
    handleChange("stats", [...(block.content.stats || []), newStat]);
  };

  const removeStat = (index: number) => {
    const updatedStats = [...(block.content.stats || [])];
    updatedStats.splice(index, 1);
    handleChange("stats", updatedStats);
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
    case "about_sustainability":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={block.content.title as string || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter title"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              value={block.content.description as string || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter description"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Statistics</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addStat}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Stat
              </Button>
            </div>

            {(block.content.stats || []).map((stat: any, index: number) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <Label>Stat {index + 1}</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeStat(index)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Icon</Label>
                  <select
                    value={stat.icon}
                    onChange={(e) => handleStatUpdate(index, "icon", e.target.value)}
                    className="w-full border rounded-md p-2"
                  >
                    <option value="Leaf">Leaf</option>
                    <option value="Recycle">Recycle</option>
                    <option value="TreePine">Tree Pine</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Value</Label>
                  <Input
                    value={stat.value}
                    onChange={(e) => handleStatUpdate(index, "value", e.target.value)}
                    placeholder="Enter value"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Label</Label>
                  <Input
                    value={stat.label}
                    onChange={(e) => handleStatUpdate(index, "label", e.target.value)}
                    placeholder="Enter label"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={stat.description}
                    onChange={(e) => handleStatUpdate(index, "description", e.target.value)}
                    placeholder="Enter description"
                  />
                </div>
              </div>
            ))}
          </div>

          <MediaLibraryModal
            open={showMediaLibrary}
            onClose={() => setShowMediaLibrary(false)}
            onSelect={handleMediaSelect}
            type={mediaType}
          />
        </div>
      );

    case "about_story":
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
          <div className="space-y-2">
            <Label>Content</Label>
            <Input
              value={block.content.content as string || ""}
              onChange={(e) => handleChange("content", e.target.value)}
            />
          </div>
          {renderMediaField("Video", "videoUrl", "video")}
          {renderMediaField("Video Cover (Thumbnail)", "videoThumbnail", "image")}
          <MediaLibraryModal
            open={showMediaLibrary}
            onClose={() => setShowMediaLibrary(false)}
            onSelect={handleMediaSelect}
            type={mediaType}
          />
        </div>
      );

    case "about_hero_section":
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
          {renderMediaField("Background Image", "backgroundImage", "image")}
          <MediaLibraryModal
            open={showMediaLibrary}
            onClose={() => setShowMediaLibrary(false)}
            onSelect={handleMediaSelect}
            type={mediaType}
          />
        </div>
      );

    case "about_mission":
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
            <Label>Mission Statement</Label>
            <Input
              value={block.content.mission as string || ""}
              onChange={(e) => handleChange("mission", e.target.value)}
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

    case "about_team":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={block.content.title as string || ""}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          {renderMediaField("Team Image", "teamImage", "image")}
          <MediaLibraryModal
            open={showMediaLibrary}
            onClose={() => setShowMediaLibrary(false)}
            onSelect={handleMediaSelect}
            type={mediaType}
          />
        </div>
      );

    case "about_customer_impact":
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
            <Label>Impact Description</Label>
            <Input
              value={block.content.impact as string || ""}
              onChange={(e) => handleChange("impact", e.target.value)}
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
