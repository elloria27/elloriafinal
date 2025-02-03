import { ContentBlock, BlockContent, SustainabilityContent, SustainabilityStat } from "@/types/content-blocks";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

interface SustainabilityEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const SustainabilityEditor = ({ block, onUpdate }: SustainabilityEditorProps) => {
  console.log("Rendering SustainabilityEditor with block:", block);

  const content = block.content as SustainabilityContent;

  const handleUpdate = (updates: Partial<SustainabilityContent>) => {
    onUpdate(block.id, {
      ...content,
      ...updates,
    });
  };

  const handleStatUpdate = (index: number, field: string, value: string) => {
    const updatedStats = [...(content.stats || [])];
    updatedStats[index] = {
      ...updatedStats[index],
      [field]: value,
    };
    handleUpdate({ stats: updatedStats });
  };

  const addStat = () => {
    const newStat: SustainabilityStat = {
      icon: "Leaf",
      title: "New Stat",
      description: "Description",
      color: "bg-accent-green",
    };
    handleUpdate({ stats: [...(content.stats || []), newStat] });
  };

  const removeStat = (index: number) => {
    const updatedStats = [...(content.stats || [])];
    updatedStats.splice(index, 1);
    handleUpdate({ stats: updatedStats });
  };

  const handleTimelineUpdate = (index: number, value: string) => {
    const updatedTimeline = [...(content.timelineItems || [])];
    updatedTimeline[index] = value;
    handleUpdate({ timelineItems: updatedTimeline });
  };

  const addTimelineItem = () => {
    handleUpdate({
      timelineItems: [...(content.timelineItems || []), "New Timeline Item"],
    });
  };

  const removeTimelineItem = (index: number) => {
    const updatedTimeline = [...(content.timelineItems || [])];
    updatedTimeline.splice(index, 1);
    handleUpdate({ timelineItems: updatedTimeline });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label>Title</Label>
          <Input
            value={content.title || ""}
            onChange={(e) => handleUpdate({ title: e.target.value })}
            placeholder="Enter section title"
          />
        </div>

        <div>
          <Label>Description</Label>
          <Textarea
            value={content.description || ""}
            onChange={(e) => handleUpdate({ description: e.target.value })}
            placeholder="Enter section description"
          />
        </div>
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

        {content.stats?.map((stat, index) => (
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

            <Input
              value={stat.title}
              onChange={(e) => handleStatUpdate(index, "title", e.target.value)}
              placeholder="Stat title"
            />

            <Input
              value={stat.description}
              onChange={(e) => handleStatUpdate(index, "description", e.target.value)}
              placeholder="Stat description"
            />

            <select
              value={stat.icon}
              onChange={(e) => handleStatUpdate(index, "icon", e.target.value)}
              className="w-full border rounded-md p-2"
            >
              <option value="Leaf">Leaf</option>
              <option value="Recycle">Recycle</option>
              <option value="Package">Package</option>
              <option value="Factory">Factory</option>
            </select>

            <select
              value={stat.color}
              onChange={(e) => handleStatUpdate(index, "color", e.target.value)}
              className="w-full border rounded-md p-2"
            >
              <option value="bg-accent-green">Green</option>
              <option value="bg-accent-purple">Purple</option>
              <option value="bg-accent-peach">Peach</option>
            </select>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Timeline Items</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addTimelineItem}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Timeline Item
          </Button>
        </div>

        {content.timelineItems?.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={item}
              onChange={(e) => handleTimelineUpdate(index, e.target.value)}
              placeholder="Timeline item text"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => removeTimelineItem(index)}
            >
              <Minus className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};