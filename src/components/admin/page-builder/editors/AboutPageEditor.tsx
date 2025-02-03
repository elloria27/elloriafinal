import { useState } from "react";
import { ContentBlock, BlockContent, AboutSustainabilityContent, AboutMissionContent } from "@/types/content-blocks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

interface AboutPageEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const AboutPageEditor = ({ block, onUpdate }: AboutPageEditorProps) => {
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

  const removeStat = (index: number) => {
    const content = block.content as AboutSustainabilityContent;
    const stats = Array.isArray(content.stats) ? [...content.stats] : [];
    stats.splice(index, 1);
    handleChange("stats", stats);
  };

  switch (block.type) {
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
        </div>
      );
      
    default:
      return null;
  }
};
