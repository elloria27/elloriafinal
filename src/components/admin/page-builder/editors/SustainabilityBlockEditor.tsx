
import { BlockContent, ContentBlock, SustainabilityContent } from "@/types/content-blocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

interface SustainabilityBlockEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const SustainabilityBlockEditor = ({ block, onUpdate }: SustainabilityBlockEditorProps) => {
  const content = block.content as SustainabilityContent;
  const [localContent, setLocalContent] = useState(content);

  const handleUpdate = (updates: Partial<SustainabilityContent>) => {
    const newContent = { ...localContent, ...updates };
    setLocalContent(newContent);
    onUpdate(block.id, newContent);
  };

  const addStat = () => {
    const newStats = [...(localContent.stats || []), {
      icon: "Leaf",
      value: "",
      label: "",
      description: ""
    }];
    handleUpdate({ stats: newStats });
  };

  const updateStat = (index: number, updates: any) => {
    const newStats = [...(localContent.stats || [])];
    newStats[index] = { ...newStats[index], ...updates };
    handleUpdate({ stats: newStats });
  };

  const removeStat = (index: number) => {
    const newStats = [...(localContent.stats || [])];
    newStats.splice(index, 1);
    handleUpdate({ stats: newStats });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium">Title</label>
          <Input
            value={localContent.title || ""}
            onChange={(e) => handleUpdate({ title: e.target.value })}
            placeholder="Enter section title"
          />
        </div>
        
        <div>
          <label className="text-sm font-medium">Description</label>
          <Textarea
            value={localContent.description || ""}
            onChange={(e) => handleUpdate({ description: e.target.value })}
            placeholder="Enter section description"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Stats</label>
          <div className="space-y-4">
            {(localContent.stats || []).map((stat, index) => (
              <div key={index} className="border p-4 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Stat {index + 1}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeStat(index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  value={stat.icon}
                  onChange={(e) => updateStat(index, { icon: e.target.value })}
                  placeholder="Icon name"
                  className="mb-2"
                />
                <Input
                  value={stat.value}
                  onChange={(e) => updateStat(index, { value: e.target.value })}
                  placeholder="Value"
                  className="mb-2"
                />
                <Input
                  value={stat.label}
                  onChange={(e) => updateStat(index, { label: e.target.value })}
                  placeholder="Label"
                  className="mb-2"
                />
                <Input
                  value={stat.description}
                  onChange={(e) => updateStat(index, { description: e.target.value })}
                  placeholder="Description"
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={addStat}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Stat
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
