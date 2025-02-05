import { ContentBlock, BlockContent } from "@/types/content-blocks";
import { HomePageEditor } from "./editors/HomePageEditor";
import { AboutPageEditor } from "./editors/AboutPageEditor";
import { ContactPageEditor } from "./editors/ContactPageEditor";
import { DonationEditor } from "./editors/DonationEditor";
import { CommonEditor } from "./editors/CommonEditor";
import { ProductCarouselEditor } from "./editors/ProductCarouselEditor";
import { CompetitorComparisonEditor } from "./editors/CompetitorComparisonEditor";
import { CustomSolutionsEditor } from "./editors/CustomSolutionsEditor";
import { ForBusinessEditor } from "./editors/ForBusinessEditor";
import { SustainabilityEditor } from "./editors/SustainabilityEditor";

interface PropertyEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const PropertyEditor = ({ block, onUpdate }: PropertyEditorProps) => {
  // Handle donation components
  if (block.type.startsWith('donation_')) {
    return <DonationEditor block={block} onUpdate={onUpdate} />;
  }

  // Handle other component types
  switch (block.type) {
    case "hero":
      return <HomePageEditor block={block} onUpdate={onUpdate} />;
    case "about_hero_section":
      return <AboutPageEditor block={block} onUpdate={onUpdate} />;
    case "contact_hero":
      return <ContactPageEditor block={block} onUpdate={onUpdate} />;
    case "product_carousel":
      return <ProductCarouselEditor block={block} onUpdate={onUpdate} />;
    case "competitor_comparison":
      return <CompetitorComparisonEditor block={block} onUpdate={onUpdate} />;
    case "custom_solutions_hero":
      return <CustomSolutionsEditor block={block} onUpdate={onUpdate} />;
    case "business_hero":
      return <ForBusinessEditor block={block} onUpdate={onUpdate} />;
    case "sustainability_hero":
      return <SustainabilityEditor block={block} onUpdate={onUpdate} />;
    default:
      return <CommonEditor block={block} onUpdate={onUpdate} />;
  }
};