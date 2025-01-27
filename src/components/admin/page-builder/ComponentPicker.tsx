import { Dialog, DialogContent } from "@/components/ui/dialog";
import { BlockType } from "@/types/content-blocks";

interface ComponentPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (type: BlockType) => void;
}

export const ComponentPicker = ({ open, onClose, onSelect }: ComponentPickerProps) => {
  const components: { type: BlockType; label: string }[] = [
    {
      type: "heading",
      label: "Heading"
    },
    {
      type: "text",
      label: "Text"
    },
    {
      type: "image",
      label: "Image"
    },
    {
      type: "video",
      label: "Video"
    },
    {
      type: "button",
      label: "Button"
    },
    {
      type: "hero",
      label: "Hero Section"
    },
    {
      type: "features",
      label: "Features Section"
    },
    {
      type: "testimonials",
      label: "Testimonials Section"
    },
    {
      type: "newsletter",
      label: "Newsletter Section"
    },
    {
      type: "blog_preview",
      label: "Blog Preview Section"
    },
    {
      type: "store_brands",
      label: "Store Brands Section"
    },
    {
      type: "sustainability",
      label: "Sustainability Section"
    },
    {
      type: "product_carousel",
      label: "Product Carousel"
    },
    {
      type: "competitor_comparison",
      label: "Competitor Comparison"
    },
    {
      type: "about_mission",
      label: "About Mission Section"
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <div className="grid grid-cols-2 gap-4">
          {components.map((component) => (
            <button
              key={component.type}
              className="p-4 border rounded-lg hover:border-primary text-left"
              onClick={() => {
                onSelect(component.type);
                onClose();
              }}
            >
              {component.label}
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
