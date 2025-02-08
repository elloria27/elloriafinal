
import React from 'react';
import { ContentBlock, SustainabilityProgramHeroContent, SustainabilityProgramBenefitsContent, SustainabilityProgramProcessContent, SustainabilityProgramCtaContent } from "@/types/content-blocks";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface EditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: any) => void;
}

export const SustainabilityProgramEditor = ({ block, onUpdate }: EditorProps) => {
  const handleContentChange = (updates: Partial<any>) => {
    onUpdate(block.id, {
      ...block.content,
      ...updates,
    });
  };

  const renderHeroEditor = () => {
    const content = block.content as SustainabilityProgramHeroContent;
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={content.title || ''}
            onChange={(e) => handleContentChange({ title: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={content.description || ''}
            onChange={(e) => handleContentChange({ description: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="buttonText">Button Text</Label>
          <Input
            id="buttonText"
            value={content.buttonText || ''}
            onChange={(e) => handleContentChange({ buttonText: e.target.value })}
          />
        </div>
      </div>
    );
  };

  const renderBenefitsEditor = () => {
    const content = block.content as SustainabilityProgramBenefitsContent;
    const benefits = content.benefits || [];

    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={content.title || ''}
            onChange={(e) => handleContentChange({ title: e.target.value })}
          />
        </div>
        <div>
          <Label>Benefits</Label>
          <div className="space-y-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="border p-4 rounded-lg space-y-2">
                <Input
                  placeholder="Icon name"
                  value={benefit.icon}
                  onChange={(e) => {
                    const newBenefits = [...benefits];
                    newBenefits[index] = { ...benefit, icon: e.target.value };
                    handleContentChange({ benefits: newBenefits });
                  }}
                />
                <Input
                  placeholder="Title"
                  value={benefit.title}
                  onChange={(e) => {
                    const newBenefits = [...benefits];
                    newBenefits[index] = { ...benefit, title: e.target.value };
                    handleContentChange({ benefits: newBenefits });
                  }}
                />
                <Textarea
                  placeholder="Description"
                  value={benefit.description}
                  onChange={(e) => {
                    const newBenefits = [...benefits];
                    newBenefits[index] = { ...benefit, description: e.target.value };
                    handleContentChange({ benefits: newBenefits });
                  }}
                />
                <Button
                  variant="destructive"
                  onClick={() => {
                    const newBenefits = benefits.filter((_, i) => i !== index);
                    handleContentChange({ benefits: newBenefits });
                  }}
                >
                  Remove Benefit
                </Button>
              </div>
            ))}
          </div>
          <Button
            className="mt-2"
            onClick={() => {
              handleContentChange({
                benefits: [
                  ...benefits,
                  { icon: '', title: '', description: '' }
                ]
              });
            }}
          >
            Add Benefit
          </Button>
        </div>
      </div>
    );
  };

  const renderProcessEditor = () => {
    const content = block.content as SustainabilityProgramProcessContent;
    const steps = content.steps || [];

    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={content.title || ''}
            onChange={(e) => handleContentChange({ title: e.target.value })}
          />
        </div>
        <div>
          <Label>Steps</Label>
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div key={index} className="border p-4 rounded-lg space-y-2">
                <Input
                  type="number"
                  placeholder="Step number"
                  value={step.number}
                  onChange={(e) => {
                    const newSteps = [...steps];
                    newSteps[index] = { ...step, number: parseInt(e.target.value) };
                    handleContentChange({ steps: newSteps });
                  }}
                />
                <Input
                  placeholder="Title"
                  value={step.title}
                  onChange={(e) => {
                    const newSteps = [...steps];
                    newSteps[index] = { ...step, title: e.target.value };
                    handleContentChange({ steps: newSteps });
                  }}
                />
                <Textarea
                  placeholder="Description"
                  value={step.description}
                  onChange={(e) => {
                    const newSteps = [...steps];
                    newSteps[index] = { ...step, description: e.target.value };
                    handleContentChange({ steps: newSteps });
                  }}
                />
                <Button
                  variant="destructive"
                  onClick={() => {
                    const newSteps = steps.filter((_, i) => i !== index);
                    handleContentChange({ steps: newSteps });
                  }}
                >
                  Remove Step
                </Button>
              </div>
            ))}
          </div>
          <Button
            className="mt-2"
            onClick={() => {
              handleContentChange({
                steps: [
                  ...steps,
                  { number: steps.length + 1, title: '', description: '' }
                ]
              });
            }}
          >
            Add Step
          </Button>
        </div>
      </div>
    );
  };

  const renderCtaEditor = () => {
    const content = block.content as SustainabilityProgramCtaContent;
    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={content.title || ''}
            onChange={(e) => handleContentChange({ title: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={content.description || ''}
            onChange={(e) => handleContentChange({ description: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="buttonText">Button Text</Label>
          <Input
            id="buttonText"
            value={content.buttonText || ''}
            onChange={(e) => handleContentChange({ buttonText: e.target.value })}
          />
        </div>
      </div>
    );
  };

  switch (block.type) {
    case 'sustainability_program_hero':
      return renderHeroEditor();
    case 'sustainability_program_benefits':
      return renderBenefitsEditor();
    case 'sustainability_program_process':
      return renderProcessEditor();
    case 'sustainability_program_cta':
      return renderCtaEditor();
    default:
      return <div>Unknown block type</div>;
  }
};
