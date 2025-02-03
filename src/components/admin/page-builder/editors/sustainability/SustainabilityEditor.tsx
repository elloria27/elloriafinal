import { SustainabilitySection } from "@/types/sustainability";
import { SustainabilityHeroEditor } from "./SustainabilityHeroEditor";
import { SustainabilityMissionEditor } from "./SustainabilityMissionEditor";
import { SustainabilityMaterialsEditor } from "./SustainabilityMaterialsEditor";
import { SustainabilityFAQEditor } from "./SustainabilityFAQEditor";
import { SustainabilityCTAEditor } from "./SustainabilityCTAEditor";

interface SustainabilityEditorProps {
  section: SustainabilitySection;
  onUpdate: (content: any) => void;
}

export const SustainabilityEditor = ({ section, onUpdate }: SustainabilityEditorProps) => {
  const handleContentUpdate = (content: any) => {
    onUpdate({
      ...section,
      content
    });
  };

  switch (section.section_type) {
    case "sustainability_hero":
      return (
        <SustainabilityHeroEditor
          content={section.content as any}
          onUpdate={handleContentUpdate}
        />
      );
    case "sustainability_mission":
      return (
        <SustainabilityMissionEditor
          content={section.content as any}
          onUpdate={handleContentUpdate}
        />
      );
    case "sustainability_materials":
      return (
        <SustainabilityMaterialsEditor
          content={section.content as any}
          onUpdate={handleContentUpdate}
        />
      );
    case "sustainability_faq":
      return (
        <SustainabilityFAQEditor
          content={section.content as any}
          onUpdate={handleContentUpdate}
        />
      );
    case "sustainability_cta":
      return (
        <SustainabilityCTAEditor
          content={section.content as any}
          onUpdate={handleContentUpdate}
        />
      );
    default:
      return <div>Unknown section type</div>;
  }
};