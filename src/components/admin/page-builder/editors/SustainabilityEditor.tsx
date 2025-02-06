import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ContentBlock } from "@/types/content-blocks";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

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

const defaultContent = {
  sustainability_hero: {
    title: "Caring for Women, Caring for the Planet",
    description: "Discover how Elloria is leading the way in sustainable feminine care",
    backgroundImage: "/lovable-uploads/033d3c83-3a91-4fee-a121-d5e700b8768d.png"
  },
  sustainability_mission: {
    title: "Our Sustainability Mission",
    description: "At Elloria, we believe that premium feminine care shouldn't come at the cost of our planet.",
    stats: [
      {
        icon: "Leaf",
        value: "72%",
        label: "Recyclable Materials",
        description: "Our products are made with eco-friendly materials"
      }
    ]
  },
  sustainability_materials: {
    title: "Sustainable Materials",
    description: "Our products are crafted with carefully selected materials that minimize environmental impact.",
    materials: [
      {
        icon: "TreePine",
        title: "Eco-Friendly Materials",
        description: "Sustainable and comfortable materials"
      }
    ]
  },
  sustainability_faq: {
    title: "Frequently Asked Questions",
    description: "Get answers to common questions about our sustainable practices and products.",
    faqs: [
      {
        question: "Are Elloria products sustainable?",
        answer: "Yes, our products are made with eco-friendly materials and sustainable practices."
      }
    ]
  },
  sustainability_cta: {
    title: "Join Our Sustainable Journey",
    description: "Subscribe to our newsletter for updates on our latest sustainability initiatives.",
    buttonText: "Learn More",
    buttonLink: "/sustainability"
  }
};

export const SustainabilityEditor = ({ block, onUpdate }: SustainabilityEditorProps) => {
  const [content, setContent] = useState<any>(
    block.content || defaultContent[block.type as keyof typeof defaultContent]
  );

  useEffect(() => {
    setContent(block.content || defaultContent[block.type as keyof typeof defaultContent]);
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

  const addStat = () => {
    const stats = Array.isArray(content.stats) ? [...content.stats] : [];
    stats.push({
      icon: "Leaf",
      value: "",
      label: "",
      description: ""
    });
    handleChange('stats', stats);
  };

  const removeStat = (index: number) => {
    const stats = Array.isArray(content.stats) ? [...content.stats] : [];
    stats.splice(index, 1);
    handleChange('stats', stats);
  };

  const handleMaterialChange = (index: number, field: string, value: string) => {
    const materials = Array.isArray(content.materials) ? [...content.materials] : [];
    materials[index] = { ...materials[index], [field]: value };
    handleChange('materials', materials);
  };

  const addMaterial = () => {
    const materials = Array.isArray(content.materials) ? [...content.materials] : [];
    materials.push({
      icon: "TreePine",
      title: "",
      description: ""
    });
    handleChange('materials', materials);
  };

  const removeMaterial = (index: number) => {
    const materials = Array.isArray(content.materials) ? [...content.materials] : [];
    materials.splice(index, 1);
    handleChange('materials', materials);
  };

  const handleFAQChange = (index: number, field: string, value: string) => {
    const faqs = Array.isArray(content.faqs) ? [...content.faqs] : [];
    faqs[index] = { ...faqs[index], [field]: value };
    handleChange('faqs', faqs);
  };

  const addFAQ = () => {
    const faqs = Array.isArray(content.faqs) ? [...content.faqs] : [];
    faqs.push({
      question: "",
      answer: ""
    });
    handleChange('faqs', faqs);
  };

  const removeFAQ = (index: number) => {
    const faqs = Array.isArray(content.faqs) ? [...content.faqs] : [];
    faqs.splice(index, 1);
    handleChange('faqs', faqs);
  };

  const renderHeroSection = () => (
    <div className="space-y-4">
      <div>
        <Label>Title</Label>
        <Input
          value={content.title || defaultContent.sustainability_hero.title}
          onChange={(e) => handleChange('title', e.target.value)}
        />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea
          value={content.description || defaultContent.sustainability_hero.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />
      </div>
      <div>
        <Label>Background Image URL</Label>
        <Input
          value={content.backgroundImage || defaultContent.sustainability_hero.backgroundImage}
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
          value={content.title || defaultContent.sustainability_mission.title}
          onChange={(e) => handleChange('title', e.target.value)}
        />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea
          value={content.description || defaultContent.sustainability_mission.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />
      </div>
      <div>
        <Label className="flex items-center justify-between">
          <span>Stats</span>
          <Button onClick={addStat} size="sm" variant="outline" className="h-8">
            <Plus className="w-4 h-4 mr-1" />
            Add Stat
          </Button>
        </Label>
        {(Array.isArray(content.stats) ? content.stats : defaultContent.sustainability_mission.stats).map((stat: SustainabilityStat, index: number) => (
          <div key={index} className="mt-4 p-4 border rounded-lg space-y-2">
            <div className="flex justify-end">
              <Button
                onClick={() => removeStat(index)}
                size="sm"
                variant="ghost"
                className="h-8 text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
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
          value={content.title || defaultContent.sustainability_materials.title}
          onChange={(e) => handleChange('title', e.target.value)}
        />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea
          value={content.description || defaultContent.sustainability_materials.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />
      </div>
      <div>
        <Label className="flex items-center justify-between">
          <span>Materials</span>
          <Button onClick={addMaterial} size="sm" variant="outline" className="h-8">
            <Plus className="w-4 h-4 mr-1" />
            Add Material
          </Button>
        </Label>
        {(Array.isArray(content.materials) ? content.materials : defaultContent.sustainability_materials.materials).map((material: SustainabilityMaterial, index: number) => (
          <div key={index} className="mt-4 p-4 border rounded-lg space-y-2">
            <div className="flex justify-end">
              <Button
                onClick={() => removeMaterial(index)}
                size="sm"
                variant="ghost"
                className="h-8 text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
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
          value={content.title || defaultContent.sustainability_faq.title}
          onChange={(e) => handleChange('title', e.target.value)}
        />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea
          value={content.description || defaultContent.sustainability_faq.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />
      </div>
      <div>
        <Label className="flex items-center justify-between">
          <span>FAQs</span>
          <Button onClick={addFAQ} size="sm" variant="outline" className="h-8">
            <Plus className="w-4 h-4 mr-1" />
            Add FAQ
          </Button>
        </Label>
        {(Array.isArray(content.faqs) ? content.faqs : defaultContent.sustainability_faq.faqs).map((faq: FAQ, index: number) => (
          <div key={index} className="mt-4 p-4 border rounded-lg space-y-2">
            <div className="flex justify-end">
              <Button
                onClick={() => removeFAQ(index)}
                size="sm"
                variant="ghost"
                className="h-8 text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
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
          value={content.title || defaultContent.sustainability_cta.title}
          onChange={(e) => handleChange('title', e.target.value)}
        />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea
          value={content.description || defaultContent.sustainability_cta.description}
          onChange={(e) => handleChange('description', e.target.value)}
        />
      </div>
      <div>
        <Label>Button Text</Label>
        <Input
          value={content.buttonText || defaultContent.sustainability_cta.buttonText}
          onChange={(e) => handleChange('buttonText', e.target.value)}
        />
      </div>
      <div>
        <Label>Button Link</Label>
        <Input
          value={content.buttonLink || defaultContent.sustainability_cta.buttonLink}
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
