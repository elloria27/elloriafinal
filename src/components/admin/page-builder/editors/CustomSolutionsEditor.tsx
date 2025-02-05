import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { ContentBlock, CustomSolutionsHeroContent, CustomSolutionsServicesContent, CustomSolutionsProcessContent, CustomSolutionsCtaContent, ProcessStep } from "@/types/content-blocks";

interface CustomSolutionsEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: any) => void;
}

export const CustomSolutionsEditor = ({ block, onUpdate }: CustomSolutionsEditorProps) => {
  const handleContentChange = (updates: Partial<CustomSolutionsHeroContent | CustomSolutionsServicesContent | CustomSolutionsProcessContent | CustomSolutionsCtaContent>) => {
    onUpdate(block.id, {
      ...block.content,
      ...updates,
    });
  };

  const handleServiceAdd = () => {
    const content = block.content as CustomSolutionsServicesContent;
    const services = Array.isArray(content.services) ? content.services : [];
    handleContentChange({
      services: [
        ...services,
        {
          icon: "Package",
          title: "New Service",
          description: "Service description",
        },
      ],
    });
  };

  const handleServiceRemove = (index: number) => {
    const content = block.content as CustomSolutionsServicesContent;
    const services = Array.isArray(content.services) ? [...content.services] : [];
    services.splice(index, 1);
    handleContentChange({ services });
  };

  const handleServiceUpdate = (index: number, updates: Partial<{ icon: string; title: string; description: string }>) => {
    const content = block.content as CustomSolutionsServicesContent;
    const services = Array.isArray(content.services) ? [...content.services] : [];
    services[index] = { ...services[index], ...updates };
    handleContentChange({ services });
  };

  const handleProcessStepAdd = () => {
    const content = block.content as CustomSolutionsProcessContent;
    const steps = Array.isArray(content.steps) ? content.steps : [];
    const newStep: ProcessStep = {
      number: steps.length + 1,
      title: "New Step",
      description: "Step description",
    };
    handleContentChange({
      steps: [...steps, newStep] as any,
    });
  };

  const handleProcessStepRemove = (index: number) => {
    const content = block.content as CustomSolutionsProcessContent;
    const steps = Array.isArray(content.steps) ? [...content.steps] : [];
    steps.splice(index, 1);
    steps.forEach((step, i) => {
      step.number = i + 1;
    });
    handleContentChange({ steps: steps as any });
  };

  const handleProcessStepUpdate = (index: number, updates: Partial<ProcessStep>) => {
    const content = block.content as CustomSolutionsProcessContent;
    const steps = Array.isArray(content.steps) ? [...content.steps] : [];
    steps[index] = { ...steps[index], ...updates };
    handleContentChange({ steps: steps as any });
  };

  switch (block.type) {
    case "custom_solutions_hero":
      const heroContent = block.content as CustomSolutionsHeroContent;
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={heroContent.title || ""}
              onChange={(e) => handleContentChange({ title: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={heroContent.subtitle || ""}
              onChange={(e) => handleContentChange({ subtitle: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={heroContent.description || ""}
              onChange={(e) => handleContentChange({ description: e.target.value })}
            />
          </div>
        </div>
      );

    case "custom_solutions_services":
      const servicesContent = block.content as CustomSolutionsServicesContent;
      return (
        <div className="space-y-6">
          <div>
            <Label htmlFor="title">Section Title</Label>
            <Input
              id="title"
              value={servicesContent.title || ""}
              onChange={(e) => handleContentChange({ title: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="subtitle">Section Subtitle</Label>
            <Input
              id="subtitle"
              value={servicesContent.subtitle || ""}
              onChange={(e) => handleContentChange({ subtitle: e.target.value })}
            />
          </div>
          <div className="space-y-4">
            <Label>Services</Label>
            {Array.isArray(servicesContent.services) && servicesContent.services.map((service, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Service {index + 1}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleServiceRemove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <Label>Icon</Label>
                  <Input
                    value={service.icon}
                    onChange={(e) => handleServiceUpdate(index, { icon: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={service.title}
                    onChange={(e) => handleServiceUpdate(index, { title: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={service.description}
                    onChange={(e) => handleServiceUpdate(index, { description: e.target.value })}
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={handleServiceAdd}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Service
            </Button>
          </div>
        </div>
      );

    case "custom_solutions_process":
      const processContent = block.content as CustomSolutionsProcessContent;
      return (
        <div className="space-y-6">
          <div>
            <Label htmlFor="title">Section Title</Label>
            <Input
              id="title"
              value={processContent.title || ""}
              onChange={(e) => handleContentChange({ title: e.target.value })}
            />
          </div>
          <div className="space-y-4">
            <Label>Process Steps</Label>
            {Array.isArray(processContent.steps) && processContent.steps.map((step, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Step {step.number}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleProcessStepRemove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={step.title}
                    onChange={(e) => handleProcessStepUpdate(index, { title: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={step.description}
                    onChange={(e) => handleProcessStepUpdate(index, { description: e.target.value })}
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={handleProcessStepAdd}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Process Step
            </Button>
          </div>
        </div>
      );

    case "custom_solutions_cta":
      const ctaContent = block.content as CustomSolutionsCtaContent;
      return (
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={ctaContent.title || ""}
              onChange={(e) => handleContentChange({ title: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={ctaContent.description || ""}
              onChange={(e) => handleContentChange({ description: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="buttonText">Button Text</Label>
            <Input
              id="buttonText"
              value={ctaContent.buttonText || ""}
              onChange={(e) => handleContentChange({ buttonText: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="buttonLink">Button Link</Label>
            <Input
              id="buttonLink"
              value={ctaContent.buttonLink || ""}
              onChange={(e) => handleContentChange({ buttonLink: e.target.value })}
            />
          </div>
        </div>
      );

    default:
      return null;
  }
};
