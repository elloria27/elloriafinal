import { useState, useEffect } from "react";
import { ContentBlock, BlockContent } from "@/types/content-blocks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { MediaLibraryModal } from "@/components/admin/media/MediaLibraryModal";

interface HomePageEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const HomePageEditor = ({ block, onUpdate }: HomePageEditorProps) => {
  const [localContent, setLocalContent] = useState(block.content);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [currentLogoIndex, setCurrentLogoIndex] = useState<number | null>(null);

  // Reset local content when block changes
  useEffect(() => {
    console.log("Block changed, resetting local content:", block.content);
    setLocalContent(block.content);
  }, [block.id, block.content]);

  const handleContentChange = (updates: Partial<BlockContent>) => {
    const updatedContent = { ...localContent, ...updates };
    setLocalContent(updatedContent);
    onUpdate(block.id, updatedContent);
  };

  const handleLogoSelect = (url: string) => {
    if (currentLogoIndex === null || block.type !== "store_brands") return;
    
    const logos = [...(localContent.logos || [])];
    logos[currentLogoIndex] = url;
    handleContentChange({ logos });
    setShowMediaLibrary(false);
  };

  const addLogo = () => {
    const logos = [...(localContent.logos || []), ""];
    handleContentChange({ logos });
  };

  const removeLogo = (index: number) => {
    const logos = [...(localContent.logos || [])];
    logos.splice(index, 1);
    handleContentChange({ logos });
  };

  const handleFeatureChange = (index: number, field: string, value: string) => {
    const features = [...(localContent.features || [])];
    features[index] = {
      ...features[index],
      [field]: value,
    };
    handleContentChange({ features });
  };

  const addFeature = () => {
    const features = [...(localContent.features || [])];
    features.push({
      icon: "Star",
      title: "New Feature",
      description: "Feature description",
    });
    handleContentChange({ features });
  };

  const removeFeature = (index: number) => {
    const features = [...(localContent.features || [])];
    features.splice(index, 1);
    handleContentChange({ features });
  };

  switch (block.type) {
    case "hero":
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={localContent.title || ""}
              onChange={(e) => handleContentChange({ title: e.target.value })}
              placeholder="Enter hero title"
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              value={localContent.subtitle || ""}
              onChange={(e) => handleContentChange({ subtitle: e.target.value })}
              placeholder="Enter subtitle"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              value={localContent.description || ""}
              onChange={(e) => handleContentChange({ description: e.target.value })}
              placeholder="Enter description"
            />
          </div>
          <div>
            <Label>Button Text</Label>
            <Input
              value={localContent.buttonText || ""}
              onChange={(e) => handleContentChange({ buttonText: e.target.value })}
              placeholder="Enter button text"
            />
          </div>
          <div>
            <Label>Button Link</Label>
            <Input
              value={localContent.buttonLink || ""}
              onChange={(e) => handleContentChange({ buttonLink: e.target.value })}
              placeholder="Enter button link"
            />
          </div>
        </div>
      );

    case "game_changer":
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={localContent.title || ""}
              onChange={(e) => handleContentChange({ title: e.target.value })}
              placeholder="Enter section title"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              value={localContent.description || ""}
              onChange={(e) => handleContentChange({ description: e.target.value })}
              placeholder="Enter description"
            />
          </div>
        </div>
      );

    case "store_brands":
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={localContent.title || ""}
              onChange={(e) => handleContentChange({ title: e.target.value })}
              placeholder="Enter section title"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              value={localContent.description || ""}
              onChange={(e) => handleContentChange({ description: e.target.value })}
              placeholder="Enter description"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Brand Logos</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLogo}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Logo
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {(localContent.logos || []).map((logo, index) => (
                <div key={index} className="relative group">
                  <img
                    src={logo}
                    alt={`Brand logo ${index + 1}`}
                    className="w-full h-32 object-contain border rounded p-2"
                    onClick={() => {
                      setCurrentLogoIndex(index);
                      setShowMediaLibrary(true);
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
                    onClick={() => removeLogo(index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <MediaLibraryModal
            open={showMediaLibrary}
            onClose={() => setShowMediaLibrary(false)}
            onSelect={handleLogoSelect}
            type="image"
          />
        </div>
      );

    case "features":
      return (
        <div className="space-y-6">
          <div>
            <Label>Title</Label>
            <Input
              value={localContent.title || ""}
              onChange={(e) => handleContentChange({ title: e.target.value })}
              placeholder="Enter section title"
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              value={localContent.description || ""}
              onChange={(e) => handleContentChange({ description: e.target.value })}
              placeholder="Enter description"
            />
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Features</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFeature}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Feature
              </Button>
            </div>
            {(localContent.features || []).map((feature, index) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <Label>Feature {index + 1}</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFeature(index)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <Label>Icon</Label>
                  <select
                    value={feature.icon}
                    onChange={(e) =>
                      handleFeatureChange(index, "icon", e.target.value)
                    }
                    className="w-full border rounded-md p-2"
                  >
                    <option value="Star">Star</option>
                    <option value="Heart">Heart</option>
                    <option value="Shield">Shield</option>
                    <option value="Zap">Zap</option>
                  </select>
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={feature.title}
                    onChange={(e) =>
                      handleFeatureChange(index, "title", e.target.value)
                    }
                    placeholder="Feature title"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={feature.description}
                    onChange={(e) =>
                      handleFeatureChange(index, "description", e.target.value)
                    }
                    placeholder="Feature description"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    default:
      return null;
  }
};