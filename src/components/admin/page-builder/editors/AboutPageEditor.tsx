import { useState } from "react";
import { ContentBlock, BlockContent, AboutSustainabilityContent, AboutMissionContent } from "@/types/content-blocks";
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

  const handleStatUpdate = (index: number, field: string, value: string) => {
    const content = block.content as AboutSustainabilityContent;
    const stats = Array.isArray(content.stats) ? [...content.stats] : [];
    stats[index] = {
      ...stats[index],
      [field]: value,
    };
    handleChange("stats", stats);
  };

  const handleMissionValueUpdate = (index: number, field: string, value: string) => {
    const content = block.content as AboutMissionContent;
    const values = Array.isArray(content.values) ? [...content.values] : [];
    values[index] = {
      ...values[index],
      [field]: value,
    };
    handleChange("values", values);
  };

  const addStat = () => {
    const content = block.content as AboutSustainabilityContent;
    const stats = Array.isArray(content.stats) ? [...content.stats] : [];
    const newStat = {
      icon: "Leaf",
      value: "New Value",
      label: "New Label",
      description: "New Description",
    };
    handleChange("stats", [...stats, newStat]);
  };

  const addMissionValue = () => {
    const content = block.content as AboutMissionContent;
    const values = Array.isArray(content.values) ? [...content.values] : [];
    const newValue = {
      icon: "Heart",
      title: "New Value",
      description: "New Description",
    };
    handleChange("values", [...values, newValue]);
  };

  const removeStat = (index: number) => {
    const content = block.content as AboutSustainabilityContent;
    const stats = Array.isArray(content.stats) ? [...content.stats] : [];
    stats.splice(index, 1);
    handleChange("stats", stats);
  };

  const removeMissionValue = (index: number) => {
    const content = block.content as AboutMissionContent;
    const values = Array.isArray(content.values) ? [...content.values] : [];
    values.splice(index, 1);
    handleChange("values", values);
  };

  switch (block.type) {
    case "about_mission":
      const missionContent = block.content as AboutMissionContent;
      const values = Array.isArray(missionContent.values) ? missionContent.values : [];
      
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={missionContent.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter title"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              value={missionContent.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter description"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Values</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMissionValue}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Value
              </Button>
            </div>

            {values.map((value, index) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <Label>Value {index + 1}</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMissionValue(index)}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Icon</Label>
                  <select
                    value={value.icon}
                    onChange={(e) => handleMissionValueUpdate(index, "icon", e.target.value)}
                    className="w-full border rounded-md p-2"
                  >
                    <option value="Heart">Heart</option>
                    <option value="Star">Star</option>
                    <option value="Leaf">Leaf</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={value.title}
                    onChange={(e) => handleMissionValueUpdate(index, "title", e.target.value)}
                    placeholder="Enter value title"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={value.description}
                    onChange={(e) => handleMissionValueUpdate(index, "description", e.target.value)}
                    placeholder="Enter value description"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "about_sustainability":
      const sustainabilityContent = block.content as AboutSustainabilityContent;
      const stats = Array.isArray(sustainabilityContent.stats) ? sustainabilityContent.stats : [];
      
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={sustainabilityContent.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter title"
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Input
              value={sustainabilityContent.description || ""}
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

            {stats.map((stat, index) => (
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
                    placeholder="Enter value (e.g., 55%, 50K+)"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Label</Label>
                  <Input
                    value={stat.label}
                    onChange={(e) => handleStatUpdate(index, "label", e.target.value)}
                    placeholder="Enter label (e.g., Recyclable Materials)"
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
        </div>
      );
      
    default:
      return null;
  }
};
