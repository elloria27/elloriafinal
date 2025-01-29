import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BlockType } from "@/types/content-blocks";
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
  Heart,
  Leaf,
  Users
} from "lucide-react";

export interface ComponentPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (type: BlockType) => void;
}

const components = [
  { type: 'hero' as BlockType, icon: LayoutTemplate, label: 'Hero Section' },
  { type: 'heading' as BlockType, icon: Type, label: 'Heading' },
  { type: 'text' as BlockType, icon: Type, label: 'Text Block' },
  { type: 'image' as BlockType, icon: Image, label: 'Image' },
  { type: 'video' as BlockType, icon: Video, label: 'Video' },
  { type: 'button' as BlockType, icon: Square, label: 'Button' },
  { type: 'features' as BlockType, icon: LayoutGrid, label: 'Features Grid' },
  { type: 'testimonials' as BlockType, icon: MessageSquareQuote, label: 'Testimonials' },
  { type: 'newsletter' as BlockType, icon: Mail, label: 'Newsletter' },
  { type: 'product_gallery' as BlockType, icon: ShoppingBag, label: 'Product Gallery' },
  { type: 'blog_preview' as BlockType, icon: Newspaper, label: 'Blog Preview' },
  { type: 'store_brands' as BlockType, icon: Store, label: 'Store Brands' },
  { type: 'about_hero_section' as BlockType, icon: LayoutTemplate, label: 'About Hero Section' },
  { type: 'about_story' as BlockType, icon: Type, label: 'About Story' },
  { type: 'about_mission' as BlockType, icon: Heart, label: 'About Mission' },
  { type: 'about_sustainability' as BlockType, icon: Leaf, label: 'About Sustainability' },
  { type: 'about_team' as BlockType, icon: Users, label: 'About Team' },
  { type: 'about_customer_impact' as BlockType, icon: MessageSquareQuote, label: 'About Customer Impact' }
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