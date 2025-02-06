import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { BlockType } from "@/types/content-blocks";
import { cn } from "@/lib/utils";

interface ComponentPickerProps {
  open: boolean;
  onClose: () => void;
  onSelect: (type: BlockType) => void;
}

export const ComponentPicker = ({ open, onClose, onSelect }: ComponentPickerProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  console.log("ComponentPicker rendered with open:", open);

  const components = [
    {
      category: "Basic",
      icon: "LayoutTemplate",
      items: [
        { type: "heading", label: "Heading", description: "Section title or subtitle" },
        { type: "text", label: "Text", description: "Regular paragraph text" },
        { type: "image", label: "Image", description: "Single image with caption" },
        { type: "video", label: "Video", description: "Embedded video player" },
        { type: "button", label: "Button", description: "Call to action button" },
      ],
    },
    {
      category: "Home",
      icon: "Home",
      items: [
        { type: "hero", label: "Hero", description: "Main landing section" },
        { type: "store_brands", label: "Store brands", description: "Display partner logos" },
        { type: "features", label: "Features", description: "Product features grid" },
        { type: "sustainability", label: "Sustainability", description: "Environmental impact" },
        { type: "product_carousel", label: "Product carousel", description: "Scrolling products" },
        { type: "testimonials", label: "Testimonials", description: "Customer reviews" },
        { type: "competitor_comparison", label: "Competitor comparison", description: "Compare products" },
        { type: "newsletter", label: "Newsletter", description: "Email signup form" },
        { type: "blog_preview", label: "Blog Preview", description: "Recent blog posts" },
        { type: "game_changer", label: "Game Changer", description: "Highlight innovations" },
      ],
    },
    {
      category: "About",
      icon: "Users",
      items: [
        { type: "about_hero_section", label: "About Hero", description: "About page header" },
        { type: "about_story", label: "About Story", description: "Company history" },
        { type: "about_mission", label: "About Mission", description: "Company mission" },
        { type: "about_sustainability", label: "About Sustainability", description: "Green initiatives" },
        { type: "about_team", label: "About Team", description: "Team members" },
        { type: "about_customer_impact", label: "About Customer Impact", description: "Success stories" },
      ],
    },
  ];

  const filteredComponents = components.map(category => ({
    ...category,
    items: category.items.filter(item =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.items.length > 0);

  const handleSelect = (type: BlockType) => {
    console.log("Selected component type:", type);
    onSelect(type);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] max-w-4xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle>Add Component</DialogTitle>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search components..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </DialogHeader>
        
        <ScrollArea className="flex-1 p-6 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredComponents.map((category) => (
              <div 
                key={category.category}
                className={cn(
                  "space-y-2 p-4 rounded-lg border bg-card",
                  selectedCategory === category.category && "ring-2 ring-primary"
                )}
                onClick={() => setSelectedCategory(category.category)}
              >
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  {category.category}
                </h3>
                <div className="space-y-2">
                  {category.items.map((item) => (
                    <Button
                      key={item.type}
                      variant="outline"
                      className="w-full justify-start text-sm min-h-[4.5rem] p-3 relative group"
                      onClick={() => handleSelect(item.type as BlockType)}
                    >
                      <div className="flex flex-col items-start gap-1">
                        <div className="font-medium">{item.label}</div>
                        <div className="text-xs text-muted-foreground">{item.description}</div>
                      </div>
                      <div className="absolute inset-y-0 right-2 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                          Add
                        </span>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};