import { useState } from "react";
import { ContentBlock, BlockContent, AboutHeroContent, AboutMissionContent } from "@/types/content-blocks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MediaLibraryModal } from "@/components/admin/media/MediaLibraryModal";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AboutPageEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const AboutPageEditor = ({ block, onUpdate }: AboutPageEditorProps) => {
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);

  const handleChange = (key: string, value: any) => {
    console.log("Updating content:", key, value);
    const updatedContent = { ...block.content, [key]: value };
    onUpdate(block.id, updatedContent);
  };

  const handleImageSelect = (url: string) => {
    handleChange('backgroundImage', url);
    setShowMediaLibrary(false);
  };

  const handleValueChange = (index: number, field: string, value: string) => {
    const missionContent = block.content as AboutMissionContent;
    const updatedValues = [...(missionContent.values || [])];
    updatedValues[index] = { ...updatedValues[index], [field]: value };
    handleChange('values', updatedValues);
  };

  const handleAddValue = () => {
    const missionContent = block.content as AboutMissionContent;
    const updatedValues = [...(missionContent.values || [])];
    updatedValues.push({
      icon: 'Leaf',
      title: '',
      description: ''
    });
    handleChange('values', updatedValues);
  };

  const handleRemoveValue = (index: number) => {
    const missionContent = block.content as AboutMissionContent;
    const updatedValues = [...(missionContent.values || [])];
    updatedValues.splice(index, 1);
    handleChange('values', updatedValues);
  };

  switch (block.type) {
    case "about_hero_section":
      const heroContent = block.content as AboutHeroContent;
      
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={heroContent.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter title"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={heroContent.subtitle || ""}
              onChange={(e) => handleChange("subtitle", e.target.value)}
              placeholder="Enter subtitle"
            />
          </div>

          <div className="space-y-2">
            <Label>Background Image</Label>
            <div className="flex items-center gap-2">
              <Input
                value={heroContent.backgroundImage || ""}
                onChange={(e) => handleChange("backgroundImage", e.target.value)}
                placeholder="Enter image URL"
                readOnly
              />
              <Button 
                type="button"
                variant="outline"
                onClick={() => setShowMediaLibrary(true)}
              >
                Browse
              </Button>
            </div>
            {heroContent.backgroundImage && (
              <img 
                src={heroContent.backgroundImage} 
                alt="Background preview" 
                className="mt-2 max-h-40 rounded-lg"
              />
            )}
          </div>

          <MediaLibraryModal
            open={showMediaLibrary}
            onClose={() => setShowMediaLibrary(false)}
            onSelect={handleImageSelect}
          />
        </div>
      );

    case "about_mission":
      const missionContent = block.content as AboutMissionContent;
      
      return (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={missionContent.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter title"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={missionContent.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter description"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Values</Label>
              <Button type="button" variant="outline" onClick={handleAddValue}>
                Add Value
              </Button>
            </div>

            {(missionContent.values || []).map((value, index) => (
              <div key={index} className="space-y-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label>Icon</Label>
                  <Select
                    value={value.icon}
                    onValueChange={(newValue) => handleValueChange(index, 'icon', newValue)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Leaf">Leaf</SelectItem>
                      <SelectItem value="Star">Star</SelectItem>
                      <SelectItem value="Heart">Heart</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={value.title}
                    onChange={(e) => handleValueChange(index, 'title', e.target.value)}
                    placeholder="Enter value title"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={value.description}
                    onChange={(e) => handleValueChange(index, 'description', e.target.value)}
                    placeholder="Enter value description"
                  />
                </div>

                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => handleRemoveValue(index)}
                >
                  Remove Value
                </Button>
              </div>
            ))}
          </div>
        </div>
      );
      
    default:
      return null;
  }
};