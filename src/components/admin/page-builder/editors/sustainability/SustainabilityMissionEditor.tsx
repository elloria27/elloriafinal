import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { SustainabilityMissionContent } from "@/types/sustainability";

interface SustainabilityMissionEditorProps {
  content: SustainabilityMissionContent;
  onUpdate: (content: SustainabilityMissionContent) => void;
}

export const SustainabilityMissionEditor = ({ content, onUpdate }: SustainabilityMissionEditorProps) => {
  const handleUpdate = (updates: Partial<SustainabilityMissionContent>) => {
    onUpdate({
      ...content,
      ...updates,
    });
  };

  const handleStatUpdate = (index: number, updates: Partial<typeof content.stats[0]>) => {
    const updatedStats = [...content.stats];
    updatedStats[index] = {
      ...updatedStats[index],
      ...updates,
    };
    handleUpdate({ stats: updatedStats });
  };

  const addStat = () => {
    handleUpdate({
      stats: [
        ...content.stats,
        {
          icon: "Leaf",
          value: "",
          label: "",
          description: "",
        },
      ],
    });
  };

  const removeStat = (index: number) => {
    const updatedStats = [...content.stats];
    updatedStats.splice(index, 1);
    handleUpdate({ stats: updatedStats });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Title</Label>
        <Input
          value={content.title}
          onChange={(e) => handleUpdate({ title: e.target.value })}
          placeholder="Enter mission title"
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={content.description}
          onChange={(e) => handleUpdate({ description: e.target.value })}
          placeholder="Enter mission description"
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

        {content.stats.map((stat, index) => (
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

            <select
              value={stat.icon}
              onChange={(e) => handleStatUpdate(index, { icon: e.target.value as 'Leaf' | 'PackageCheck' | 'Globe' })}
              className="w-full border rounded-md p-2"
            >
              <option value="Leaf">Leaf</option>
              <option value="PackageCheck">Package Check</option>
              <option value="Globe">Globe</option>
            </select>

            <Input
              value={stat.value}
              onChange={(e) => handleStatUpdate(index, { value: e.target.value })}
              placeholder="Value (e.g. 72%)"
            />

            <Input
              value={stat.label}
              onChange={(e) => handleStatUpdate(index, { label: e.target.value })}
              placeholder="Label"
            />

            <Textarea
              value={stat.description}
              onChange={(e) => handleStatUpdate(index, { description: e.target.value })}
              placeholder="Description"
            />
          </div>
        ))}
      </div>
    </div>
  );
};