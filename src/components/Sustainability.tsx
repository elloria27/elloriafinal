import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ContentBlock } from "@/types/content-blocks";
import { SustainabilityHero } from "./sustainability/SustainabilityHero";
import { SustainabilityMission } from "./sustainability/SustainabilityMission";
import { SustainabilityMaterials } from "./sustainability/SustainabilityMaterials";
import { SustainabilityFAQ } from "./sustainability/SustainabilityFAQ";
import { SustainabilityCTA } from "./sustainability/SustainabilityCTA";
import { 
  SustainabilityHeroContent, 
  SustainabilityMissionContent,
  SustainabilityMaterialsContent,
  SustainabilityFAQContent,
  SustainabilityCTAContent 
} from "@/types/sustainability";

interface SustainabilityProps {
  pageId?: string;
}

export const Sustainability = ({ pageId }: SustainabilityProps) => {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        console.log('Fetching content blocks for page:', pageId);
        
        const { data, error } = await supabase
          .from('content_blocks')
          .select('*')
          .eq('page_id', pageId)
          .order('order_index');

        if (error) {
          console.error('Error fetching content blocks:', error);
          throw error;
        }

        console.log('Fetched content blocks:', data);
        setBlocks(data as ContentBlock[]);
      } catch (error) {
        console.error('Failed to fetch content blocks:', error);
      } finally {
        setLoading(false);
      }
    };

    if (pageId) {
      fetchBlocks();
    }
  }, [pageId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const renderBlock = (block: ContentBlock) => {
    // Map the content block type to the appropriate component
    switch (block.type) {
      case "hero":
        return <SustainabilityHero content={block.content as SustainabilityHeroContent} />;
      case "sustainability":
        // For mission and FAQ sections which now use the 'sustainability' type
        if (block.content.isMission) {
          return <SustainabilityMission content={block.content as SustainabilityMissionContent} />;
        } else {
          return <SustainabilityFAQ content={block.content as SustainabilityFAQContent} />;
        }
      case "features":
        return <SustainabilityMaterials content={block.content as SustainabilityMaterialsContent} />;
      case "newsletter":
        return <SustainabilityCTA content={block.content as SustainabilityCTAContent} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pt-20">
      {blocks.map((block) => (
        <div key={block.id}>
          {renderBlock(block)}
        </div>
      ))}
    </div>
  );
};