import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { ContentBlock, HeroContent, FeaturesContent, GameChangerContent, StoreBrandsContent, FeatureItem, BlockContent } from "@/types/content-blocks";
import { MediaLibraryModal } from "../../media/MediaLibraryModal";

interface HomePageEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const HomePageEditor = ({ block, onUpdate }: HomePageEditorProps) => {
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [currentField, setCurrentField] = useState<string>("");
  const [currentBrandIndex, setCurrentBrandIndex] = useState<number>(0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    const value = e.target.value;
    const currentContent = block.content as BlockContent;
    const updatedContent = {
      ...currentContent,
      [field]: value
    };
    onUpdate(block.id, updatedContent);
  };

  const handleFeatureUpdate = (index: number, field: string, value: string) => {
    const currentContent = block.content as FeaturesContent | GameChangerContent | StoreBrandsContent;
    const features = Array.isArray(currentContent.features) ? [...currentContent.features] : [];
    const feature = features[index] ? { ...features[index] } : {};
    
    if (typeof feature === 'object') {
      (feature as any)[field] = value;
      features[index] = feature;
      onUpdate(block.id, { ...currentContent, features });
    }
  };

  const handleMediaSelect = (url: string) => {
    console.log('Selected media URL:', url);
    if (block.type === 'store_brands') {
      const currentContent = block.content as StoreBrandsContent;
      const features = Array.isArray(currentContent.features) ? [...currentContent.features] : [];
      const updatedFeature = {
        ...(features[currentBrandIndex] || {}),
        description: url
      };
      features[currentBrandIndex] = updatedFeature;
      onUpdate(block.id, { ...currentContent, features });
    } else {
      const currentContent = block.content as BlockContent;
      const updatedContent = {
        ...currentContent,
        [currentField]: url
      };
      onUpdate(block.id, updatedContent);
    }
    setShowMediaLibrary(false);
  };

  const handleFeatureAdd = () => {
    const content = block.content as FeaturesContent | GameChangerContent | StoreBrandsContent;
    const features = Array.isArray(content.features) ? [...content.features] : [];
    
    let newFeature: any;
    if (block.type === 'store_brands') {
      newFeature = {
        icon: '',
        title: "New Brand",
        description: "",
        detail: "#"
      };
    } else {
      newFeature = {
        icon: "Droplets",
        title: "New Feature",
        description: "Feature description",
        detail: "Additional details about this feature"
      };
    }

    onUpdate(block.id, {
      ...content,
      features: [...features, newFeature]
    });
  };

  const handleFeatureRemove = (index: number) => {
    const content = block.content as FeaturesContent | GameChangerContent | StoreBrandsContent;
    const features = Array.isArray(content.features) ? [...content.features] : [];
    features.splice(index, 1);
    onUpdate(block.id, { ...content, features });
  };

  const renderEditor = () => {
    switch (block.type) {
      case "hero":
        const heroContent = block.content as HeroContent;
        return (
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                value={String(heroContent.title || "")}
                onChange={(e) => handleInputChange(e, "title")}
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={String(heroContent.subtitle || "")}
                onChange={(e) => handleInputChange(e, "subtitle")}
              />
            </div>
            <div className="space-y-2">
              <Label>Video URL</Label>
              <div className="flex gap-2">
                <Input
                  value={String(heroContent.videoUrl || "")}
                  onChange={(e) => handleInputChange(e, "videoUrl")}
                  placeholder="Enter video URL"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setMediaType("video");
                    setCurrentField("videoUrl");
                    setShowMediaLibrary(true);
                  }}
                >
                  Browse
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Video Poster</Label>
              <div className="flex gap-2">
                <Input
                  value={String(heroContent.videoPoster || "")}
                  onChange={(e) => handleInputChange(e, "videoPoster")}
                  placeholder="Enter poster URL"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setMediaType("image");
                    setCurrentField("videoPoster");
                    setShowMediaLibrary(true);
                  }}
                >
                  Browse
                </Button>
              </div>
            </div>
            <div>
              <Label>Shop Now Text</Label>
              <Input
                value={String(heroContent.shopNowText || "")}
                onChange={(e) => handleInputChange(e, "shopNowText")}
              />
            </div>
            <div>
              <Label>Learn More Text</Label>
              <Input
                value={String(heroContent.learnMoreText || "")}
                onChange={(e) => handleInputChange(e, "learnMoreText")}
              />
            </div>
          </div>
        );

      case "features":
      case "game_changer":
        const featuresContent = block.content as FeaturesContent | GameChangerContent;
        return (
          <div className="space-y-6">
            <div>
              <Label>Title</Label>
              <Input
                value={String(featuresContent.title || "")}
                onChange={(e) => handleInputChange(e, "title")}
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={String(featuresContent.subtitle || "")}
                onChange={(e) => handleInputChange(e, "subtitle")}
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={String(featuresContent.description || "")}
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
                {Array.isArray(featuresContent.features) && featuresContent.features.map((feature, index) => (
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
        const brandsContent = block.content as StoreBrandsContent;
        return (
          <div className="space-y-6">
            <div>
              <Label>Title</Label>
              <Input
                value={String(brandsContent.title || "")}
                onChange={(e) => handleInputChange(e, "title")}
              />
            </div>
            <div>
              <Label>Subtitle</Label>
              <Input
                value={String(brandsContent.subtitle || "")}
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
                {Array.isArray(brandsContent.features) && brandsContent.features.map((brand, index) => {
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
      <div className="font-semibold text-lg">Edit {block.type}</div>
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