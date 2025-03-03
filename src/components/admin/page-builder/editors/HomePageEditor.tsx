import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { ContentBlock, HeroContent, FeaturesContent, GameChangerContent, StoreBrandsContent, FeatureItem } from "@/types/content-blocks";
import { MediaLibraryModal } from "../../media/MediaLibraryModal";
import { Json } from '@/integrations/supabase/types';

interface HomePageEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: any) => void;
}

export const HomePageEditor = ({ block, onUpdate }: HomePageEditorProps) => {
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [currentField, setCurrentField] = useState<string>("");
  const [currentBrandIndex, setCurrentBrandIndex] = useState<number>(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    console.log('Handling input change for', field, 'with value:', e.target.value);
    const updatedContent = {
      ...block.content as Record<string, unknown>,
      [field]: e.target.value
    };
    onUpdate(block.id, updatedContent);
  };

  const handleMediaSelect = (url: string) => {
    console.log('Selected media URL:', url);
    if (block.type === 'store_brands') {
      const content = block.content as StoreBrandsContent;
      const features = Array.isArray(content.features) ? [...content.features] : [];
      const updatedFeature = {
        ...(features[currentBrandIndex] as unknown as FeatureItem),
        description: url
      } as Json;
      features[currentBrandIndex] = updatedFeature;
      onUpdate(block.id, { ...content, features });
    } else {
      const updatedContent = {
        ...block.content as Record<string, unknown>,
        [currentField]: url
      };
      onUpdate(block.id, updatedContent);
    }
    setShowMediaLibrary(false);
  };

  const handleFeatureAdd = () => {
    const content = block.content as FeaturesContent | GameChangerContent | StoreBrandsContent;
    const features = Array.isArray(content.features) ? content.features : [];
    
    let newFeature: Json;
    if (block.type === 'store_brands') {
      newFeature = {
        icon: '',
        title: "New Brand",
        description: "", // Logo URL
        detail: "#" // Link URL
      };
    } else {
      newFeature = {
        icon: "Droplets",
        title: "New Feature",
        description: "Feature description",
        detail: "Additional details about this feature"
      };
    }

    const updatedContent = {
      ...content,
      features: [...features, newFeature]
    };
    onUpdate(block.id, updatedContent);
  };

  const handleFeatureRemove = (index: number) => {
    const content = block.content as FeaturesContent | GameChangerContent | StoreBrandsContent;
    const features = Array.isArray(content.features) ? [...content.features] : [];
    features.splice(index, 1);
    onUpdate(block.id, { ...content, features });
  };

  const handleFeatureUpdate = (index: number, field: string, value: string) => {
    const content = block.content as FeaturesContent | GameChangerContent | StoreBrandsContent;
    const features = Array.isArray(content.features) ? [...content.features] : [];
    const feature = features[index] as { [key: string]: Json };
    const updatedFeature = { ...feature, [field]: value } as Json;
    features[index] = updatedFeature;
    onUpdate(block.id, { ...content, features });
  };

  const renderMediaField = (label: string, field: string, type: "image" | "video") => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={String(block.content[field] || "")}
          onChange={(e) => handleInputChange(e, field)}
          placeholder={`Enter ${label.toLowerCase()} URL`}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setMediaType(type);
            setCurrentField(field);
            setShowMediaLibrary(true);
          }}
        >
          Browse
        </Button>
      </div>
    </div>
  );

  const renderEditor = () => {
    switch (block.type) {
      case "hero":
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={String(block.content.title || "")}
                onChange={(e) => handleInputChange(e, "title")}
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={String(block.content.subtitle || "")}
                onChange={(e) => handleInputChange(e, "subtitle")}
              />
            </div>
            {renderMediaField("Video URL", "videoUrl", "video")}
            {renderMediaField("Video Poster", "videoPoster", "image")}
            <div>
              <Label>Shop Now Text</Label>
              <Input
                value={String(block.content.shopNowText || "")}
                onChange={(e) => handleInputChange(e, "shopNowText")}
              />
            </div>
            <div>
              <Label>Learn More Text</Label>
              <Input
                value={String(block.content.learnMoreText || "")}
                onChange={(e) => handleInputChange(e, "learnMoreText")}
              />
            </div>
          </div>
        );

      case "features":
      case "game_changer":
        const content = block.content as FeaturesContent | GameChangerContent;
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
            <div>
              <Label>Description</Label>
              <Input
                value={String(content.description || "")}
                onChange={(e) => handleInputChange(e, "description")}
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Features</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleFeatureAdd}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feature
                </Button>
              </div>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
                {Array.isArray(content.features) && content.features.map((feature, index) => (
                  <div key={index} className="p-4 border rounded-lg space-y-3 bg-white">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Feature {index + 1}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFeatureRemove(index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <div>
                      <Label>Icon</Label>
                      <Input
                        value={String(feature.icon || "")}
                        onChange={(e) => handleFeatureUpdate(index, "icon", e.target.value)}
                        placeholder="Droplets, Leaf, or Heart"
                      />
                    </div>
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={String(feature.title || "")}
                        onChange={(e) => handleFeatureUpdate(index, "title", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input
                        value={String(feature.description || "")}
                        onChange={(e) => handleFeatureUpdate(index, "description", e.target.value)}
                      />
                    </div>
                    {block.type === "game_changer" && (
                      <div>
                        <Label>Detail</Label>
                        <Input
                          value={String(feature.detail || "")}
                          onChange={(e) => handleFeatureUpdate(index, "detail", e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case "store_brands":
        const storeBrandsContent = block.content as StoreBrandsContent;
        return (
          <div className="space-y-6">
            <div>
              <Label>Title</Label>
              <Input
                value={String(storeBrandsContent.title || "")}
                onChange={(e) => handleInputChange(e, "title")}
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={String(storeBrandsContent.subtitle || "")}
                onChange={(e) => handleInputChange(e, "subtitle")}
              />
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Brands</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleFeatureAdd}
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Brand
                </Button>
              </div>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-4">
                {Array.isArray(storeBrandsContent.features) && storeBrandsContent.features.map((brand, index) => {
                  const typedBrand = brand as unknown as FeatureItem;
                  return (
                    <div key={index} className="p-4 border rounded-lg space-y-3 bg-white">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Brand {index + 1}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFeatureRemove(index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                      <div>
                        <Label>Brand Name</Label>
                        <Input
                          value={String(typedBrand.title || "")}
                          onChange={(e) => handleFeatureUpdate(index, "title", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Logo</Label>
                        <div className="flex gap-2">
                          <Input
                            value={String(typedBrand.description || "")}
                            onChange={(e) => handleFeatureUpdate(index, "description", e.target.value)}
                            placeholder="Logo URL"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setMediaType("image");
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
                          onChange={(e) => handleFeatureUpdate(index, "detail", e.target.value)}
                          placeholder="https://"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 h-full">
      <div className="h-[calc(100vh-200px)] overflow-y-auto pr-4">
        {renderEditor()}
      </div>
      {showMediaLibrary && (
        <MediaLibraryModal
          open={showMediaLibrary}
          onClose={() => setShowMediaLibrary(false)}
          onSelect={handleMediaSelect}
          type={mediaType}
        />
      )}
    </div>
  );
};
