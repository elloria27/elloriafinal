import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { SustainabilityMaterialsContent } from "@/types/sustainability";

interface SustainabilityMaterialsEditorProps {
  content: SustainabilityMaterialsContent;
  onUpdate: (content: SustainabilityMaterialsContent) => void;
}

export const SustainabilityMaterialsEditor = ({ content, onUpdate }: SustainabilityMaterialsEditorProps) => {
  const handleUpdate = (updates: Partial<SustainabilityMaterialsContent>) => {
    onUpdate({
      ...content,
      ...updates,
    });
  };

  const handleMaterialUpdate = (index: number, updates: Partial<typeof content.materials[0]>) => {
    const updatedMaterials = [...content.materials];
    updatedMaterials[index] = {
      ...updatedMaterials[index],
      ...updates,
    };
    handleUpdate({ materials: updatedMaterials });
  };

  const addMaterial = () => {
    handleUpdate({
      materials: [
        ...content.materials,
        {
          icon: "TreePine",
          title: "",
          description: "",
        },
      ],
    });
  };

  const removeMaterial = (index: number) => {
    const updatedMaterials = [...content.materials];
    updatedMaterials.splice(index, 1);
    handleUpdate({ materials: updatedMaterials });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Title</Label>
        <Input
          value={content.title}
          onChange={(e) => handleUpdate({ title: e.target.value })}
          placeholder="Enter materials section title"
        />
      </div>

      <div>
        <Label>Description</Label>
        <Textarea
          value={content.description}
          onChange={(e) => handleUpdate({ description: e.target.value })}
          placeholder="Enter materials section description"
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Materials</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addMaterial}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Material
          </Button>
        </div>

        {content.materials.map((material, index) => (
          <div key={index} className="space-y-2 p-4 border rounded-lg">
            <div className="flex justify-between items-center">
              <Label>Material {index + 1}</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeMaterial(index)}
              >
                <Minus className="w-4 h-4" />
              </Button>
            </div>

            <select
              value={material.icon}
              onChange={(e) => handleMaterialUpdate(index, { icon: e.target.value as 'TreePine' | 'Recycle' | 'Factory' })}
              className="w-full border rounded-md p-2"
            >
              <option value="TreePine">Tree Pine</option>
              <option value="Recycle">Recycle</option>
              <option value="Factory">Factory</option>
            </select>

            <Input
              value={material.title}
              onChange={(e) => handleMaterialUpdate(index, { title: e.target.value })}
              placeholder="Material title"
            />

            <Textarea
              value={material.description}
              onChange={(e) => handleMaterialUpdate(index, { description: e.target.value })}
              placeholder="Material description"
            />
          </div>
        ))}
      </div>
    </div>
  );
};