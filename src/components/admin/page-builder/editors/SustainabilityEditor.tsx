import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ContentBlock } from "@/types/content-blocks";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Image } from "lucide-react";
import { MediaLibraryModal } from "@/components/admin/media/MediaLibraryModal";

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
    backgroundImage: "",
    buttonText: "Shop Now",
    buttonLink: "/shop"
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
  const [mediaLibraryOpen, setMediaLibraryOpen] = useState(false);

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
        <Label>Background Image</Label>
        <div className="flex gap-2 items-center">
          <Input
            value={content.backgroundImage || ''}
            onChange={(e) => handleChange('backgroundImage', e.target.value)}
            readOnly
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => setMediaLibraryOpen(true)}
          >
            <Image className="h-4 w-4" />
          </Button>
        </div>
        {content.backgroundImage && (
          <img
            src={content.backgroundImage}
            alt="Background preview"
            className="mt-2 max-w-[200px] rounded-md"
          />
        )}
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
      <MediaLibraryModal
        open={mediaLibraryOpen}
        onClose={() => setMediaLibraryOpen(false)}
        onSelect={(url) => {
          handleChange('backgroundImage', url);
          setMediaLibraryOpen(false);
        }}
        type="image"
      />
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
        <Label className="flex items-center justify-between">
          <span>Stats</span>
          <Button onClick={addStat} size="sm" variant="outline" className="h-8">
            <Plus className="w-4 h-4 mr-1" />
            Add Stat
          </Button>
        </Label>
        {(Array.isArray(content.stats) ? content.stats : []).map((stat: SustainabilityStat, index: number) => (
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
        <Label className="flex items-center justify-between">
          <span>Materials</span>
          <Button onClick={addMaterial} size="sm" variant="outline" className="h-8">
            <Plus className="w-4 h-4 mr-1" />
            Add Material
          </Button>
        </Label>
        {(Array.isArray(content.materials) ? content.materials : []).map((material: SustainabilityMaterial, index: number) => (
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
        <Label className="flex items-center justify-between">
          <span>FAQs</span>
          <Button onClick={addFAQ} size="sm" variant="outline" className="h-8">
            <Plus className="w-4 h-4 mr-1" />
            Add FAQ
          </Button>
        </Label>
        {(Array.isArray(content.faqs) ? content.faqs : []).map((faq: FAQ, index: number) => (
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
