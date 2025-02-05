import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BlockType } from "@/types/content-blocks";

export interface ComponentPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (type: BlockType) => void;
}

export const ComponentPicker = ({ open, onClose, onSelect }: ComponentPickerProps) => {
  const components: { type: BlockType; label: string; category: string }[] = [
    // Common Components
    { type: "heading", label: "Heading", category: "Common" },
    { type: "text", label: "Text", category: "Common" },
    { type: "image", label: "Image", category: "Common" },
    { type: "video", label: "Video", category: "Common" },
    { type: "button", label: "Button", category: "Common" },
    
    // Home Page Components
    { type: "hero", label: "Hero Section", category: "Home" },
    { type: "features", label: "Features", category: "Home" },
    { type: "game_changer", label: "Game Changer", category: "Home" },
    { type: "store_brands", label: "Store Brands", category: "Home" },
    { type: "sustainability", label: "Sustainability", category: "Home" },
    { type: "testimonials", label: "Testimonials", category: "Common" },
    { type: "blog_preview", label: "Blog Preview", category: "Common" },
    { type: "product_carousel", label: "Product Carousel", category: "Products" },
    { type: "competitor_comparison", label: "Competitor Comparison", category: "Products" },

    // About Page Components
    { type: "about_hero_section", label: "About Hero", category: "About" },
    { type: "about_story", label: "About Story", category: "About" },
    { type: "about_mission", label: "About Mission", category: "About" },
    { type: "about_sustainability", label: "About Sustainability", category: "About" },
    { type: "about_team", label: "About Team", category: "About" },
    { type: "about_customer_impact", label: "Customer Impact", category: "About" },

    // Contact Page Components
    { type: "contact_hero", label: "Contact Hero", category: "Contact" },
    { type: "contact_details", label: "Contact Details", category: "Contact" },
    { type: "contact_form", label: "Contact Form", category: "Contact" },
    { type: "contact_faq", label: "Contact FAQ", category: "Contact" },
    { type: "contact_business", label: "Business Contact", category: "Contact" },

    // Donation Page Components
    { type: "donation_hero", label: "Donation Hero", category: "Donation" },
    { type: "donation_impact", label: "Donation Impact", category: "Donation" },
    { type: "donation_stories", label: "Donation Stories", category: "Donation" },
    { type: "donation_partners", label: "Donation Partners", category: "Donation" },
    { type: "donation_faq", label: "Donation FAQ", category: "Donation" },
    { type: "donation_join_movement", label: "Join Movement", category: "Donation" },
  ];

  const categories = Array.from(new Set(components.map(c => c.category)));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <div className="p-4 space-y-6">
          {categories.map(category => (
            <div key={category}>
              <h3 className="font-semibold mb-3">{category} Components</h3>
              <div className="grid grid-cols-2 gap-2">
                {components
                  .filter(c => c.category === category)
                  .map(component => (
                    <Button
                      key={component.type}
                      variant="outline"
                      className="justify-start"
                      onClick={() => onSelect(component.type)}
                    >
                      {component.label}
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