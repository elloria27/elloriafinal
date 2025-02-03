import { ContentBlock, BlockContent, SustainabilityContent } from "@/types/content-blocks";
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

  const handleStatUpdate = (index: number, field: keyof typeof content.stats[0], value: string) => {
    const updatedStats = [...(content.stats || [])];
    updatedStats[index] = {
      ...updatedStats[index],
      [field]: value,
    };
    handleUpdate({ stats: updatedStats });
  };

  const addStat = () => {
    const newStat = {
      icon: "Leaf",
      value: "New Value",
      label: "New Label",
      description: "Description",
    };
    handleUpdate({ stats: [...(content.stats || []), newStat] });
  };

  const removeStat = (index: number) => {
    const updatedStats = [...(content.stats || [])];
    updatedStats.splice(index, 1);
    handleUpdate({ stats: updatedStats });
  };

  const handleMaterialUpdate = (index: number, field: keyof typeof content.materials[0], value: string) => {
    const updatedMaterials = [...(content.materials || [])];
    updatedMaterials[index] = {
      ...updatedMaterials[index],
      [field]: value,
    };
    handleUpdate({ materials: updatedMaterials });
  };

  const addMaterial = () => {
    const newMaterial = {
      icon: "Leaf",
      title: "New Material",
      description: "Description",
    };
    handleUpdate({ materials: [...(content.materials || []), newMaterial] });
  };

  const removeMaterial = (index: number) => {
    const updatedMaterials = [...(content.materials || [])];
    updatedMaterials.splice(index, 1);
    handleUpdate({ materials: updatedMaterials });
  };

  const handleFaqUpdate = (index: number, field: keyof typeof content.faqs[0], value: string) => {
    const updatedFaqs = [...(content.faqs || [])];
    updatedFaqs[index] = {
      ...updatedFaqs[index],
      [field]: value,
    };
    handleUpdate({ faqs: updatedFaqs });
  };

  const addFaq = () => {
    const newFaq = {
      question: "New Question",
      answer: "New Answer",
    };
    handleUpdate({ faqs: [...(content.faqs || []), newFaq] });
  };

  const removeFaq = (index: number) => {
    const updatedFaqs = [...(content.faqs || [])];
    updatedFaqs.splice(index, 1);
    handleUpdate({ faqs: updatedFaqs });
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

        {block.type === "sustainability_hero" && (
          <div>
            <Label>Background Image URL</Label>
            <Input
              value={content.backgroundImage || ""}
              onChange={(e) => handleUpdate({ backgroundImage: e.target.value })}
              placeholder="Enter background image URL"
            />
          </div>
        )}
      </div>

      {block.type === "sustainability_mission" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Statistics</Label>
            <Button type="button" variant="outline" size="sm" onClick={addStat}>
              <Plus className="w-4 h-4 mr-2" />
              Add Stat
            </Button>
          </div>

          {content.stats?.map((stat, index) => (
            <div key={index} className="space-y-2 p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <Label>Stat {index + 1}</Label>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeStat(index)}>
                  <Minus className="w-4 h-4" />
                </Button>
              </div>

              <Input
                value={stat.value}
                onChange={(e) => handleStatUpdate(index, "value", e.target.value)}
                placeholder="Stat value"
              />

              <Input
                value={stat.label}
                onChange={(e) => handleStatUpdate(index, "label", e.target.value)}
                placeholder="Stat label"
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
                <option value="PackageCheck">Package Check</option>
                <option value="Globe">Globe</option>
              </select>
            </div>
          ))}
        </div>
      )}

      {block.type === "sustainability_materials" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Materials</Label>
            <Button type="button" variant="outline" size="sm" onClick={addMaterial}>
              <Plus className="w-4 h-4 mr-2" />
              Add Material
            </Button>
          </div>

          {content.materials?.map((material, index) => (
            <div key={index} className="space-y-2 p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <Label>Material {index + 1}</Label>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeMaterial(index)}>
                  <Minus className="w-4 h-4" />
                </Button>
              </div>

              <Input
                value={material.title}
                onChange={(e) => handleMaterialUpdate(index, "title", e.target.value)}
                placeholder="Material title"
              />

              <Input
                value={material.description}
                onChange={(e) => handleMaterialUpdate(index, "description", e.target.value)}
                placeholder="Material description"
              />

              <select
                value={material.icon}
                onChange={(e) => handleMaterialUpdate(index, "icon", e.target.value)}
                className="w-full border rounded-md p-2"
              >
                <option value="TreePine">Tree Pine</option>
                <option value="Recycle">Recycle</option>
                <option value="Factory">Factory</option>
              </select>
            </div>
          ))}
        </div>
      )}

      {block.type === "sustainability_faq" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>FAQs</Label>
            <Button type="button" variant="outline" size="sm" onClick={addFaq}>
              <Plus className="w-4 h-4 mr-2" />
              Add FAQ
            </Button>
          </div>

          {content.faqs?.map((faq, index) => (
            <div key={index} className="space-y-2 p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <Label>FAQ {index + 1}</Label>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeFaq(index)}>
                  <Minus className="w-4 h-4" />
                </Button>
              </div>

              <Input
                value={faq.question}
                onChange={(e) => handleFaqUpdate(index, "question", e.target.value)}
                placeholder="Question"
              />

              <Textarea
                value={faq.answer}
                onChange={(e) => handleFaqUpdate(index, "answer", e.target.value)}
                placeholder="Answer"
              />
            </div>
          ))}
        </div>
      )}

      {block.type === "sustainability_cta" && (
        <div className="space-y-4">
          <div>
            <Label>Button Text</Label>
            <Input
              value={content.buttonText || ""}
              onChange={(e) => handleUpdate({ buttonText: e.target.value })}
              placeholder="Enter button text"
            />
          </div>

          <div>
            <Label>Button Link</Label>
            <Input
              value={content.buttonLink || ""}
              onChange={(e) => handleUpdate({ buttonLink: e.target.value })}
              placeholder="Enter button link"
            />
          </div>
        </div>
      )}
    </div>
  );
};