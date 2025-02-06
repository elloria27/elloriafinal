import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { ContentBlock, StoreBrandsContent, FeatureItem } from "@/types/content-blocks";
import { MediaLibraryModal } from "../../media/MediaLibraryModal";
import { useState } from "react";
import { Json } from "@/integrations/supabase/types";

interface StoreBrandsEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: StoreBrandsContent) => void;
}

export const StoreBrandsEditor = ({ block, onUpdate }: StoreBrandsEditorProps) => {
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [currentBrandIndex, setCurrentBrandIndex] = useState<number>(0);
  
  const content = block.content as StoreBrandsContent;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    console.log('Updating store brands field:', field, 'with value:', e.target.value);
    onUpdate(block.id, {
      ...content,
      [field]: e.target.value
    });
  };

  const handleMediaSelect = (url: string) => {
    console.log('Selected media URL:', url);
    const features = Array.isArray(content.features) ? [...content.features] : [];
    const updatedFeature = {
      ...(features[currentBrandIndex] as unknown as FeatureItem),
      description: url
    } as Json;
    features[currentBrandIndex] = updatedFeature;
    onUpdate(block.id, { ...content, features });
    setShowMediaLibrary(false);
  };

  const handleBrandAdd = () => {
    const features = Array.isArray(content.features) ? content.features : [];
    const newBrand = {
      title: "New Brand",
      description: "", // Logo URL
      detail: "#" // Link URL
    } as Json;

    onUpdate(block.id, {
      ...content,
      features: [...features, newBrand]
    });
  };

  const handleBrandRemove = (index: number) => {
    const features = Array.isArray(content.features) ? [...content.features] : [];
    features.splice(index, 1);
    onUpdate(block.id, { ...content, features });
  };

  const handleBrandUpdate = (index: number, field: string, value: string) => {
    const features = Array.isArray(content.features) ? [...content.features] : [];
    const feature = features[index] as { [key: string]: Json };
    const updatedFeature = { ...feature, [field]: value } as Json;
    features[index] = updatedFeature;
    onUpdate(block.id, { ...content, features });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>Title</Label>
        <Input
          value={String(content.title || "")}
          onChange={(e) => handleInputChange(e, "title")}
        />
      </div>
      <div>
        <Label>Subtitle</Label>
        <Input
          value={String(content.subtitle || "")}
          onChange={(e) => handleInputChange(e, "subtitle")}
        />
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label>Brands</Label>
          <Button
            type="button"
            variant="outline"
            onClick={handleBrandAdd}
            size="sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Brand
          </Button>
        </div>
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
          {Array.isArray(content.features) && content.features.map((brand, index) => {
            const typedBrand = brand as unknown as FeatureItem;
            return (
              <div key={index} className="p-4 border rounded-lg space-y-3 bg-white">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Brand {index + 1}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleBrandRemove(index)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
                <div>
                  <Label>Brand Name</Label>
                  <Input
                    value={String(typedBrand.title || "")}
                    onChange={(e) => handleBrandUpdate(index, "title", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Logo</Label>
                  <div className="flex gap-2">
                    <Input
                      value={String(typedBrand.description || "")}
                      onChange={(e) => handleBrandUpdate(index, "description", e.target.value)}
                      placeholder="Logo URL"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setCurrentBrandIndex(index);
                        setShowMediaLibrary(true);
                      }}
                    >
                      Browse
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>Link URL</Label>
                  <Input
                    value={String(typedBrand.detail || "")}
                    onChange={(e) => handleBrandUpdate(index, "detail", e.target.value)}
                    placeholder="https://"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showMediaLibrary && (
        <MediaLibraryModal
          open={showMediaLibrary}
          onClose={() => setShowMediaLibrary(false)}
          onSelect={handleMediaSelect}
          type="image"
        />
      )}
    </div>
  );
};