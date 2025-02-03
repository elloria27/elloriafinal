import { SustainabilitySection, SustainabilitySectionType } from "@/types/sustainability";
import { SustainabilityHeroEditor } from "./SustainabilityHeroEditor";
import { SustainabilityMissionEditor } from "./SustainabilityMissionEditor";
import { SustainabilityMaterialsEditor } from "./SustainabilityMaterialsEditor";
import { SustainabilityFAQEditor } from "./SustainabilityFAQEditor";
import { SustainabilityCTAEditor } from "./SustainabilityCTAEditor";

interface SustainabilityEditorProps {
  section: SustainabilitySection;
  onUpdate: (section: SustainabilitySection) => void;
}

export const SustainabilityEditor = ({ section, onUpdate }: SustainabilityEditorProps) => {
  const handleContentUpdate = (content: any) => {
    onUpdate({
      ...section,
      content
    });
  };

  const renderEditor = () => {
    switch (section.section_type) {
      case "sustainability_hero":
        return (
          <SustainabilityHeroEditor
            content={section.content}
            onUpdate={handleContentUpdate}
          />
        );
      case "sustainability_mission":
        return (
          <SustainabilityMissionEditor
            content={section.content}
            onUpdate={handleContentUpdate}
          />
        );
      case "sustainability_materials":
        return (
          <SustainabilityMaterialsEditor
            content={section.content}
            onUpdate={handleContentUpdate}
          />
        );
      case "sustainability_faq":
        return (
          <SustainabilityFAQEditor
            content={section.content}
            onUpdate={handleContentUpdate}
          />
        );
      case "sustainability_cta":
        return (
          <SustainabilityCTAEditor
            content={section.content}
            onUpdate={handleContentUpdate}
          />
        );
      default:
        return <div>Unknown section type</div>;
    }
  };

  return (
    <div className="space-y-6">
      {renderEditor()}
    </div>
  );
};