import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BlockType } from "@/types/content-blocks";
import { Button } from "@/components/ui/button";

interface ComponentPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (type: BlockType) => void;
}

export const ComponentPicker = ({ open, onClose, onSelect }: ComponentPickerProps) => {
  const components: { type: BlockType; label: string }[] = [
    { type: "heading", label: "Heading" },
    { type: "text", label: "Text" },
    { type: "image", label: "Image" },
    { type: "video", label: "Video" },
    { type: "button", label: "Button" },
    { type: "hero", label: "Hero" },
    { type: "features", label: "Features" },
    { type: "testimonials", label: "Testimonials" },
    { type: "newsletter", label: "Newsletter" },
    { type: "blog_preview", label: "Blog Preview" },
    { type: "store_brands", label: "Store Brands" },
    { type: "sustainability", label: "Sustainability" },
    { type: "product_carousel", label: "Product Carousel" },
    { type: "elevating_essentials", label: "Elevating Essentials" },
    { type: "game_changer", label: "Game Changer" },
    { type: "competitor_comparison", label: "Competitor Comparison" },
    { type: "about_hero_section", label: "About Hero Section" },
    { type: "about_story", label: "About Story" },
    { type: "about_mission", label: "About Mission" },
    { type: "about_sustainability", label: "About Sustainability" },
    { type: "about_team", label: "About Team" },
    { type: "about_customer_impact", label: "About Customer Impact" },
    { type: "contact_hero", label: "Contact Hero" },
    { type: "contact_details", label: "Contact Details" },
    { type: "contact_form", label: "Contact Form" },
    { type: "contact_faq", label: "Contact FAQ" },
    { type: "contact_business", label: "Contact Business" },
    { type: "donation_hero", label: "Donation Hero" },
  ];

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Component</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4">
          {components.map(({ type, label }) => (
            <Button
              key={type}
              variant="outline"
              className="h-auto py-4 px-6 flex flex-col items-center justify-center text-center"
              onClick={() => {
                onSelect(type);
                onClose();
              }}
            >
              {label}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};