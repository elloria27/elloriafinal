import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ContentBlock } from "@/types/content-blocks";

interface SustainabilityEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: any) => void;
}

interface SustainabilityStat {
  icon: string;
  value: string;
  label: string;
  description: string;
}

interface SustainabilityMaterial {
  icon: string;
  title: string;
  description: string;
}

interface FAQ {
  question: string;
  answer: string;
}

export const SustainabilityEditor = ({ block, onUpdate }: SustainabilityEditorProps) => {
  const [content, setContent] = useState<any>(block.content);

  useEffect(() => {
    setContent(block.content);
  }, [block]);

  const handleChange = (field: string, value: any) => {
    const updatedContent = { ...content, [field]: value };
    setContent(updatedContent);
    onUpdate(block.id, updatedContent);
  };

  const handleStatChange = (index: number, field: string, value: string) => {
    const stats = Array.isArray(content.stats) ? [...content.stats] : [];
    stats[index] = { ...stats[index], [field]: value };
    handleChange('stats', stats);
  };

  const handleMaterialChange = (index: number, field: string, value: string) => {
    const materials = Array.isArray(content.materials) ? [...content.materials] : [];
    materials[index] = { ...materials[index], [field]: value };
    handleChange('materials', materials);
  };

  const handleFAQChange = (index: number, field: string, value: string) => {
    const faqs = Array.isArray(content.faqs) ? [...content.faqs] : [];
    faqs[index] = { ...faqs[index], [field]: value };
    handleChange('faqs', faqs);
  };

  const renderHeroSection = () => (
    <div className="space-y-4">
      <div>
        <Label>Title</Label>
        <Input
          value={content.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
        />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea
          value={content.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
        />
      </div>
      <div>
        <Label>Background Image URL</Label>
        <Input
          value={content.backgroundImage || ''}
          onChange={(e) => handleChange('backgroundImage', e.target.value)}
        />
      </div>
    </div>
  );

  const renderMissionSection = () => (
    <div className="space-y-6">
      <div>
        <Label>Title</Label>
        <Input
          value={content.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
        />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea
          value={content.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
        />
      </div>
      <div>
        <Label>Stats</Label>
        {(Array.isArray(content.stats) ? content.stats : []).map((stat: SustainabilityStat, index: number) => (
          <div key={index} className="mt-4 p-4 border rounded-lg space-y-2">
            <Input
              placeholder="Icon"
              value={stat.icon}
              onChange={(e) => handleStatChange(index, 'icon', e.target.value)}
            />
            <Input
              placeholder="Value"
              value={stat.value}
              onChange={(e) => handleStatChange(index, 'value', e.target.value)}
            />
            <Input
              placeholder="Label"
              value={stat.label}
              onChange={(e) => handleStatChange(index, 'label', e.target.value)}
            />
            <Textarea
              placeholder="Description"
              value={stat.description}
              onChange={(e) => handleStatChange(index, 'description', e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderMaterialsSection = () => (
    <div className="space-y-6">
      <div>
        <Label>Title</Label>
        <Input
          value={content.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
        />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea
          value={content.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
        />
      </div>
      <div>
        <Label>Materials</Label>
        {(Array.isArray(content.materials) ? content.materials : []).map((material: SustainabilityMaterial, index: number) => (
          <div key={index} className="mt-4 p-4 border rounded-lg space-y-2">
            <Input
              placeholder="Icon"
              value={material.icon}
              onChange={(e) => handleMaterialChange(index, 'icon', e.target.value)}
            />
            <Input
              placeholder="Title"
              value={material.title}
              onChange={(e) => handleMaterialChange(index, 'title', e.target.value)}
            />
            <Textarea
              placeholder="Description"
              value={material.description}
              onChange={(e) => handleMaterialChange(index, 'description', e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderFAQSection = () => (
    <div className="space-y-6">
      <div>
        <Label>Title</Label>
        <Input
          value={content.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
        />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea
          value={content.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
        />
      </div>
      <div>
        <Label>FAQs</Label>
        {(Array.isArray(content.faqs) ? content.faqs : []).map((faq: FAQ, index: number) => (
          <div key={index} className="mt-4 p-4 border rounded-lg space-y-2">
            <Input
              placeholder="Question"
              value={faq.question}
              onChange={(e) => handleFAQChange(index, 'question', e.target.value)}
            />
            <Textarea
              placeholder="Answer"
              value={faq.answer}
              onChange={(e) => handleFAQChange(index, 'answer', e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderCTASection = () => (
    <div className="space-y-4">
      <div>
        <Label>Title</Label>
        <Input
          value={content.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
        />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea
          value={content.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
        />
      </div>
      <div>
        <Label>Button Text</Label>
        <Input
          value={content.buttonText || ''}
          onChange={(e) => handleChange('buttonText', e.target.value)}
        />
      </div>
      <div>
        <Label>Button Link</Label>
        <Input
          value={content.buttonLink || ''}
          onChange={(e) => handleChange('buttonLink', e.target.value)}
        />
      </div>
    </div>
  );

  const renderEditor = () => {
    switch (block.type) {
      case 'sustainability_hero':
        return renderHeroSection();
      case 'sustainability_mission':
        return renderMissionSection();
      case 'sustainability_materials':
        return renderMaterialsSection();
      case 'sustainability_faq':
        return renderFAQSection();
      case 'sustainability_cta':
        return renderCTASection();
      default:
        return <div>Unsupported block type</div>;
    }
  };

  return (
    <div className="space-y-6">
      {renderEditor()}
    </div>
  );
};