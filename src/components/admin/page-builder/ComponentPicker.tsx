import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  LayoutTemplate, 
  Type, 
  Image, 
  Video, 
  Square,
  LayoutGrid,
  MessageSquareQuote,
  Mail,
  ShoppingBag,
  Newspaper,
  Store,
  Building2,
  History,
  Target,
  Leaf,
  Users,
  HeartHandshake
} from "lucide-react";

interface ComponentPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (type: string) => void;
}

const components = [
  { type: 'hero', icon: LayoutTemplate, label: 'Hero Section' },
  { type: 'heading', icon: Type, label: 'Heading' },
  { type: 'text', icon: Type, label: 'Text Block' },
  { type: 'image', icon: Image, label: 'Image' },
  { type: 'video', icon: Video, label: 'Video' },
  { type: 'button', icon: Square, label: 'Button' },
  { type: 'features', icon: LayoutGrid, label: 'Features Grid' },
  { type: 'testimonials', icon: MessageSquareQuote, label: 'Testimonials' },
  { type: 'newsletter', icon: Mail, label: 'Newsletter' },
  { type: 'product_gallery', icon: ShoppingBag, label: 'Product Gallery' },
  { type: 'blog_preview', icon: Newspaper, label: 'Blog Preview' },
  { type: 'store_brands', icon: Store, label: 'Store Brands' },
  { type: 'about_hero_section', icon: Building2, label: 'About Hero Section' },
  { type: 'about_story', icon: History, label: 'About Story' },
  { type: 'about_mission', icon: Target, label: 'About Mission' },
  { type: 'about_sustainability', icon: Leaf, label: 'About Sustainability' },
  { type: 'about_team', icon: Users, label: 'About Team' },
  { type: 'about_customer_impact', icon: HeartHandshake, label: 'About Customer Impact' }
];

export const ComponentPicker = ({ open, onClose, onSelect }: ComponentPickerProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Component</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[300px] pr-4">
          <div className="grid grid-cols-2 gap-2">
            {components.map((component) => (
              <Button
                key={component.type}
                variant="outline"
                className="h-24 flex flex-col items-center justify-center gap-2"
                onClick={() => {
                  onSelect(component.type);
                  onClose();
                }}
              >
                <component.icon className="h-6 w-6" />
                <span className="text-sm">{component.label}</span>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};