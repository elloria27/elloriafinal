import { SustainabilityContent, ContentBlock } from "@/types/content-blocks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface SustainabilityEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: any) => void;
}

export const SustainabilityEditor = ({ block, onUpdate }: SustainabilityEditorProps) => {
  const content = block.content as SustainabilityContent;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const updatedContent = {
      ...content,
      [field]: e.target.value
    };
    onUpdate(block.id, updatedContent);
  };

  const handleStatAdd = () => {
    const stats = Array.isArray(content.stats) ? [...content.stats] : [];
    stats.push({
      icon: "Leaf",
      value: "0%",
      label: "New Stat",
      description: "Description"
    });
    onUpdate(block.id, { ...content, stats });
  };

  const handleStatRemove = (index: number) => {
    const stats = Array.isArray(content.stats) ? [...content.stats] : [];
    stats.splice(index, 1);
    onUpdate(block.id, { ...content, stats });
  };

  const handleStatUpdate = (index: number, field: string, value: string) => {
    const stats = Array.isArray(content.stats) ? [...content.stats] : [];
    const stat = { ...stats[index], [field]: value };
    stats[index] = stat;
    onUpdate(block.id, { ...content, stats });
  };

  const handleMaterialAdd = () => {
    const materials = Array.isArray(content.materials) ? [...content.materials] : [];
    materials.push({
      icon: "Leaf",
      title: "New Material",
      description: "Description"
    });
    onUpdate(block.id, { ...content, materials });
  };

  const handleMaterialRemove = (index: number) => {
    const materials = Array.isArray(content.materials) ? [...content.materials] : [];
    materials.splice(index, 1);
    onUpdate(block.id, { ...content, materials });
  };

  const handleMaterialUpdate = (index: number, field: string, value: string) => {
    const materials = Array.isArray(content.materials) ? [...content.materials] : [];
    const material = { ...materials[index], [field]: value };
    materials[index] = material;
    onUpdate(block.id, { ...content, materials });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Title</Label>
        <Input
          value={content.title || ""}
          onChange={(e) => handleInputChange(e, "title")}
        />
      </div>

      <div>
        <Label>Subtitle</Label>
        <Input
          value={content.subtitle || ""}
          onChange={(e) => handleInputChange(e, "subtitle")}
        />
      </div>

      <div>
        <Label>Description</Label>
        <Input
          value={content.description || ""}
          onChange={(e) => handleInputChange(e, "description")}
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Stats</Label>
          <Button
            type="button"
            variant="outline"
            onClick={handleStatAdd}
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Stat
          </Button>
        </div>
        
        {Array.isArray(content.stats) && content.stats.map((stat, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Stat {index + 1}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleStatRemove(index)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
            <div>
              <Label>Icon</Label>
              <Input
                value={stat.icon}
                onChange={(e) => handleStatUpdate(index, "icon", e.target.value)}
              />
            </div>
            <div>
              <Label>Value</Label>
              <Input
                value={stat.value}
                onChange={(e) => handleStatUpdate(index, "value", e.target.value)}
              />
            </div>
            <div>
              <Label>Label</Label>
              <Input
                value={stat.label}
                onChange={(e) => handleStatUpdate(index, "label", e.target.value)}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={stat.description}
                onChange={(e) => handleStatUpdate(index, "description", e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Materials</Label>
          <Button
            type="button"
            variant="outline"
            onClick={handleMaterialAdd}
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Material
          </Button>
        </div>
        
        {Array.isArray(content.materials) && content.materials.map((material, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-medium">Material {index + 1}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMaterialRemove(index)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
            <div>
              <Label>Icon</Label>
              <Input
                value={material.icon}
                onChange={(e) => handleMaterialUpdate(index, "icon", e.target.value)}
              />
            </div>
            <div>
              <Label>Title</Label>
              <Input
                value={material.title}
                onChange={(e) => handleMaterialUpdate(index, "title", e.target.value)}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={material.description}
                onChange={(e) => handleMaterialUpdate(index, "description", e.target.value)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};