import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BlockType } from "@/types/content-blocks";

interface ComponentPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (type: BlockType) => void;
}

export const ComponentPicker = ({ open, onClose, onSelect }: ComponentPickerProps) => {
  const components = [
    {
      category: "Basic",
      items: [
        { type: "heading", label: "Heading" },
        { type: "text", label: "Text" },
        { type: "image", label: "Image" },
        { type: "video", label: "Video" },
        { type: "button", label: "Button" },
      ],
    },
    {
      category: "About Page",
      items: [
        { type: "about_hero_section", label: "About Hero" },
        { type: "about_story", label: "About Story" },
        { type: "about_mission", label: "About Mission" },
        { type: "about_sustainability", label: "About Sustainability" },
        { type: "about_team", label: "About Team" },
        { type: "about_customer_impact", label: "About Customer Impact" },
      ],
    },
    {
      category: "Products",
      items: [
        { type: "product_carousel", label: "Product Carousel" },
        { type: "product_gallery", label: "Product Gallery" },
        { type: "competitor_comparison", label: "Competitor Comparison" },
      ],
    },
    {
      category: "Sustainability",
      items: [
        { type: "sustainability_hero", label: "Sustainability Hero" },
        { type: "sustainability_mission", label: "Sustainability Mission" },
        { type: "sustainability_materials", label: "Sustainability Materials" },
        { type: "sustainability_faq", label: "Sustainability FAQ" },
        { type: "sustainability_cta", label: "Sustainability CTA" },
      ],
    },
  ];

  const handleSelect = (type: BlockType) => {
    onSelect(type);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Component</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
          {components.map((category) => (
            <div key={category.category}>
              <h3 className="font-semibold mb-2">{category.category}</h3>
              <div className="space-y-2">
                {category.items.map((item) => (
                  <Button
                    key={item.type}
                    variant="outline"
                    className="w-full justify-start text-sm py-6"
                    onClick={() => handleSelect(item.type as BlockType)}
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};