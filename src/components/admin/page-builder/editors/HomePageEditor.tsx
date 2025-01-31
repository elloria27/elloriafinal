import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { ContentBlock, HeroContent, FeaturesContent, GameChangerContent, StoreBrandsContent } from "@/types/content-blocks";
import { MediaLibraryModal } from "../../media/MediaLibraryModal";

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
      const brands = Array.isArray(content.features) ? [...content.features] : [];
      brands[currentBrandIndex] = {
        ...brands[currentBrandIndex] as Record<string, unknown>,
        description: url // Logo URL is stored in description field
      };
      onUpdate(block.id, { ...content, features: brands });
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
    
    let newFeature;
    if (block.type === 'store_brands') {
      newFeature = {
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
      ...content as Record<string, unknown>,
      features: [...features, newFeature]
    };
    onUpdate(block.id, updatedContent);
  };

  const handleFeatureRemove = (index: number) => {
    const content = block.content as FeaturesContent | GameChangerContent | StoreBrandsContent;
    const features = Array.isArray(content.features) ? [...content.features] : [];
    features.splice(index, 1);
    onUpdate(block.id, { ...content as Record<string, unknown>, features });
  };

  const handleFeatureUpdate = (index: number, field: string, value: string) => {
    const content = block.content as FeaturesContent | GameChangerContent | StoreBrandsContent;
    const features = Array.isArray(content.features) ? [...content.features] : [];
    const feature = features[index] as Record<string, unknown>;
    features[index] = { ...feature, [field]: value };
    onUpdate(block.id, { ...content as Record<string, unknown>, features });
  };

  const renderMediaField = (label: string, field: string, type: "image" | "video") => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={block.content[field] as string || ""}
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

  switch (block.type) {
    case "hero":
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={(block.content.title as string) || ""}
              onChange={(e) => handleInputChange(e, "title")}
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              value={(block.content.subtitle as string) || ""}
              onChange={(e) => handleInputChange(e, "subtitle")}
            />
          </div>
          {renderMediaField("Video URL", "videoUrl", "video")}
          {renderMediaField("Video Poster", "videoPoster", "image")}
          <div>
            <Label>Shop Now Text</Label>
            <Input
              value={(block.content.shopNowText as string) || ""}
              onChange={(e) => handleInputChange(e, "shopNowText")}
            />
          </div>
          <div>
            <Label>Learn More Text</Label>
            <Input
              value={(block.content.learnMoreText as string) || ""}
              onChange={(e) => handleInputChange(e, "learnMoreText")}
            />
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

    case "features":
      const featuresContent = block.content as FeaturesContent;
      return (
        <div className="space-y-6">
          <div>
            <Label>Title</Label>
            <Input
              value={featuresContent.title || ""}
              onChange={(e) => handleInputChange(e, "title")}
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              value={featuresContent.subtitle || ""}
              onChange={(e) => handleInputChange(e, "subtitle")}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              value={featuresContent.description || ""}
              onChange={(e) => handleInputChange(e, "description")}
            />
          </div>
          
          <div className="space-y-4">
            <Label>Features</Label>
            {Array.isArray(featuresContent.features) && featuresContent.features.map((feature, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Feature {index + 1}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFeatureRemove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <Label>Icon</Label>
                  <Input
                    value={feature.icon}
                    onChange={(e) => handleFeatureUpdate(index, "icon", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={feature.title}
                    onChange={(e) => handleFeatureUpdate(index, "title", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={feature.description}
                    onChange={(e) => handleFeatureUpdate(index, "description", e.target.value)}
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={handleFeatureAdd}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Feature
            </Button>
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
              value={(storeBrandsContent.title as string) || ""}
              onChange={(e) => handleInputChange(e, "title")}
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              value={(storeBrandsContent.subtitle as string) || ""}
              onChange={(e) => handleInputChange(e, "subtitle")}
            />
          </div>
          
          <div className="space-y-4">
            <Label>Brands</Label>
            {Array.isArray(storeBrandsContent.features) && storeBrandsContent.features.map((brand, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Brand {index + 1}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFeatureRemove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <Label>Brand Name</Label>
                  <Input
                    value={(brand.title as string) || ""}
                    onChange={(e) => handleFeatureUpdate(index, "title", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Logo</Label>
                  <div className="flex gap-2">
                    <Input
                      value={(brand.description as string) || ""} // Logo URL stored in description
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
                    value={(brand.detail as string) || ""} // Link URL stored in detail
                    onChange={(e) => handleFeatureUpdate(index, "detail", e.target.value)}
                    placeholder="https://"
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={handleFeatureAdd}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Brand
            </Button>
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

    case "game_changer":
      const gameChangerContent = block.content as GameChangerContent;
      return (
        <div className="space-y-6">
          <div>
            <Label>Title</Label>
            <Input
              value={(gameChangerContent.title as string) || ""}
              onChange={(e) => handleInputChange(e, "title")}
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              value={(gameChangerContent.subtitle as string) || ""}
              onChange={(e) => handleInputChange(e, "subtitle")}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Input
              value={(gameChangerContent.description as string) || ""}
              onChange={(e) => handleInputChange(e, "description")}
            />
          </div>
          
          <div className="space-y-4">
            <Label>Features</Label>
            {Array.isArray(gameChangerContent.features) && gameChangerContent.features.map((feature, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Feature {index + 1}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFeatureRemove(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div>
                  <Label>Icon</Label>
                  <Input
                    value={feature.icon}
                    onChange={(e) => handleFeatureUpdate(index, "icon", e.target.value)}
                    placeholder="Droplets, Leaf, or Heart"
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={feature.title}
                    onChange={(e) => handleFeatureUpdate(index, "title", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Input
                    value={feature.description}
                    onChange={(e) => handleFeatureUpdate(index, "description", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Detail</Label>
                  <Input
                    value={(feature.detail as string) || ""}
                    onChange={(e) => handleFeatureUpdate(index, "detail", e.target.value)}
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={handleFeatureAdd}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Feature
            </Button>
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

    default:
      return null;
  }
};
