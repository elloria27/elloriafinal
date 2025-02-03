import { useEffect, useState } from "react";
import { ContentBlock, BlockContent, HeroContent, GameChangerContent, StoreBrandsContent, SustainabilityContent, FeaturesContent } from "@/types/content-blocks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from "lucide-react";

interface HomePageEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const HomePageEditor = ({ block, onUpdate }: HomePageEditorProps) => {
  const [content, setContent] = useState<BlockContent>(block.content);

  useEffect(() => {
    console.log('Block changed in HomePageEditor:', block);
    setContent(block.content);
  }, [block.id, block.content]);

  const handleChange = (key: string, value: any) => {
    const updatedContent = { ...content, [key]: value };
    setContent(updatedContent);
    onUpdate(block.id, updatedContent);
  };

  const handleArrayChange = (key: string, index: number, value: any) => {
    const array = [...((content as any)[key] || [])];
    array[index] = { ...array[index], ...value };
    handleChange(key, array);
  };

  const addArrayItem = (key: string, defaultItem: any) => {
    const array = [...((content as any)[key] || [])];
    array.push(defaultItem);
    handleChange(key, array);
  };

  const removeArrayItem = (key: string, index: number) => {
    const array = [...((content as any)[key] || [])];
    array.splice(index, 1);
    handleChange(key, array);
  };

  console.log('Rendering HomePageEditor with block type:', block.type);
  console.log('Current content:', content);

  switch (block.type) {
    case "hero":
      const heroContent = content as HeroContent;
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={heroContent.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={heroContent.subtitle || ''}
              onChange={(e) => handleChange('subtitle', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="videoUrl">Video URL</Label>
            <Input
              id="videoUrl"
              value={heroContent.videoUrl || ''}
              onChange={(e) => handleChange('videoUrl', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="videoPoster">Video Poster URL</Label>
            <Input
              id="videoPoster"
              value={heroContent.videoPoster || ''}
              onChange={(e) => handleChange('videoPoster', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shopNowText">Shop Now Button Text</Label>
            <Input
              id="shopNowText"
              value={heroContent.shopNowText || ''}
              onChange={(e) => handleChange('shopNowText', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="learnMoreText">Learn More Button Text</Label>
            <Input
              id="learnMoreText"
              value={heroContent.learnMoreText || ''}
              onChange={(e) => handleChange('learnMoreText', e.target.value)}
            />
          </div>
        </div>
      );

    case "game_changer":
      const gameChangerContent = content as GameChangerContent;
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={gameChangerContent.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={gameChangerContent.subtitle || ''}
              onChange={(e) => handleChange('subtitle', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={gameChangerContent.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Features</Label>
            {(gameChangerContent.features || []).map((feature, index) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg">
                <Input
                  placeholder="Icon"
                  value={feature.icon || ''}
                  onChange={(e) => handleArrayChange('features', index, { icon: e.target.value })}
                />
                <Input
                  placeholder="Title"
                  value={feature.title || ''}
                  onChange={(e) => handleArrayChange('features', index, { title: e.target.value })}
                />
                <Input
                  placeholder="Description"
                  value={feature.description || ''}
                  onChange={(e) => handleArrayChange('features', index, { description: e.target.value })}
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeArrayItem('features', index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              onClick={() => addArrayItem('features', { icon: '', title: '', description: '' })}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Feature
            </Button>
          </div>
        </div>
      );

    case "store_brands":
      const storeBrandsContent = content as StoreBrandsContent;
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={storeBrandsContent.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={storeBrandsContent.subtitle || ''}
              onChange={(e) => handleChange('subtitle', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Brands</Label>
            {(storeBrandsContent.brands || []).map((brand, index) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg">
                <Input
                  placeholder="Brand Name"
                  value={brand.name || ''}
                  onChange={(e) => handleArrayChange('brands', index, { name: e.target.value })}
                />
                <Input
                  placeholder="Logo URL"
                  value={brand.logo || ''}
                  onChange={(e) => handleArrayChange('brands', index, { logo: e.target.value })}
                />
                <Input
                  placeholder="Link"
                  value={brand.link || ''}
                  onChange={(e) => handleArrayChange('brands', index, { link: e.target.value })}
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeArrayItem('brands', index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              onClick={() => addArrayItem('brands', { name: '', logo: '', link: '' })}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Brand
            </Button>
          </div>
        </div>
      );

    case "sustainability":
      const sustainabilityContent = content as SustainabilityContent;
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={sustainabilityContent.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={sustainabilityContent.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="statsTitle">Stats Title</Label>
            <Input
              id="statsTitle"
              value={sustainabilityContent.statsTitle || ''}
              onChange={(e) => handleChange('statsTitle', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Stats</Label>
            {(sustainabilityContent.stats || []).map((stat, index) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg">
                <Input
                  placeholder="Icon"
                  value={stat.icon || ''}
                  onChange={(e) => handleArrayChange('stats', index, { icon: e.target.value })}
                />
                <Input
                  placeholder="Title"
                  value={stat.title || ''}
                  onChange={(e) => handleArrayChange('stats', index, { title: e.target.value })}
                />
                <Input
                  placeholder="Description"
                  value={stat.description || ''}
                  onChange={(e) => handleArrayChange('stats', index, { description: e.target.value })}
                />
                <Input
                  placeholder="Color"
                  value={stat.color || ''}
                  onChange={(e) => handleArrayChange('stats', index, { color: e.target.value })}
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeArrayItem('stats', index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              onClick={() => addArrayItem('stats', { icon: '', title: '', description: '', color: '' })}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Stat
            </Button>
          </div>
        </div>
      );

    case "features":
      const featuresContent = content as FeaturesContent;
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={featuresContent.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={featuresContent.subtitle || ''}
              onChange={(e) => handleChange('subtitle', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={featuresContent.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Features</Label>
            {(featuresContent.features || []).map((feature, index) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg">
                <Input
                  placeholder="Icon"
                  value={feature.icon || ''}
                  onChange={(e) => handleArrayChange('features', index, { icon: e.target.value })}
                />
                <Input
                  placeholder="Title"
                  value={feature.title || ''}
                  onChange={(e) => handleArrayChange('features', index, { title: e.target.value })}
                />
                <Input
                  placeholder="Description"
                  value={feature.description || ''}
                  onChange={(e) => handleArrayChange('features', index, { description: e.target.value })}
                />
                <Input
                  placeholder="Detail"
                  value={feature.detail || ''}
                  onChange={(e) => handleArrayChange('features', index, { detail: e.target.value })}
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeArrayItem('features', index)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              onClick={() => addArrayItem('features', { icon: '', title: '', description: '', detail: '' })}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Feature
            </Button>
          </div>
        </div>
      );

    default:
      return (
        <div className="p-4 text-center text-gray-500">
          No editor available for this component type
        </div>
      );
  }
};