import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { SustainabilitySection } from "@/types/sustainability";
import { SustainabilityHero } from "./sustainability/SustainabilityHero";
import { SustainabilityMission } from "./sustainability/SustainabilityMission";
import { SustainabilityMaterials } from "./sustainability/SustainabilityMaterials";
import { SustainabilityFAQ } from "./sustainability/SustainabilityFAQ";
import { SustainabilityCTA } from "./sustainability/SustainabilityCTA";

interface SustainabilityProps {
  pageId?: string;
}

export const Sustainability = ({ pageId }: SustainabilityProps) => {
  const [sections, setSections] = useState<SustainabilitySection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        console.log('Fetching sustainability sections for page:', pageId);
        
        const { data, error } = await supabase
          .from('sustainability_sections')
          .select('*')
          .eq('page_id', pageId)
          .order('order_index');

        if (error) {
          console.error('Error fetching sustainability sections:', error);
          throw error;
        }

        console.log('Fetched sustainability sections:', data);
        
        const typedSections = data?.map(section => ({
          ...section,
          content: section.content as unknown as (
            | SustainabilitySection['content']
          )
        })) || [];

        setSections(typedSections);
      } catch (error) {
        console.error('Failed to fetch sustainability sections:', error);
      } finally {
        setLoading(false);
      }
    };

    if (pageId) {
      fetchSections();
    }
  }, [pageId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const renderSection = (section: SustainabilitySection) => {
    switch (section.section_type) {
      case "sustainability_hero":
        return <SustainabilityHero content={section.content as any} />;
      case "sustainability_mission":
        return <SustainabilityMission content={section.content as any} />;
      case "sustainability_materials":
        return <SustainabilityMaterials content={section.content as any} />;
      case "sustainability_faq":
        return <SustainabilityFAQ content={section.content as any} />;
      case "sustainability_cta":
        return <SustainabilityCTA content={section.content as any} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-20">
      {sections.map((section) => (
        <div key={section.id}>
          {renderSection(section)}
        </div>
      ))}
    </div>
  );
};