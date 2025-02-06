import { ContentBlock } from "@/types/content-blocks";
import { HeroEditor } from "./HeroEditor";
import { FeaturesEditor } from "./FeaturesEditor";
import { TestimonialsEditor } from "./TestimonialsEditor";
import { StoreBrandsEditor } from "./StoreBrandsEditor";
import { CompetitorComparisonEditor } from "./CompetitorComparisonEditor";
import { ProductCarouselEditor } from "./ProductCarouselEditor";

interface HomePageEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: any) => void;
}

export const HomePageEditor = ({ block, onUpdate }: HomePageEditorProps) => {
  const renderEditor = () => {
    switch (block.type) {
      case "hero":
        return <HeroEditor block={block} onUpdate={onUpdate} />;
      
      case "features":
        return <FeaturesEditor block={block} onUpdate={onUpdate} />;
      
      case "testimonials":
        return <TestimonialsEditor block={block} onUpdate={onUpdate} />;
      
      case "store_brands":
        return <StoreBrandsEditor block={block} onUpdate={onUpdate} />;
      
      case "competitor_comparison":
        return <CompetitorComparisonEditor block={block} onUpdate={onUpdate} />;
      
      case "product_carousel":
        return <ProductCarouselEditor block={block} onUpdate={onUpdate} />;

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 h-full">
      <div className="h-[calc(100vh-200px)] overflow-y-auto pr-4">
        {renderEditor()}
      </div>
    </div>
  );
};