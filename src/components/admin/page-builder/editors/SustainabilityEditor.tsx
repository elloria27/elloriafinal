import { useEffect, useState } from "react";
import { ContentBlock, BlockContent, SustainabilityContent } from "@/types/content-blocks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface SustainabilityEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const SustainabilityEditor = ({ block, onUpdate }: SustainabilityEditorProps) => {
  const [content, setContent] = useState<SustainabilityContent>(block.content as SustainabilityContent);

  useEffect(() => {
    console.log('Block changed in SustainabilityEditor:', block);
    setContent(block.content as SustainabilityContent);
  }, [block.id, block.content]);

  const handleChange = (key: string, value: any) => {
    const updatedContent = { ...content, [key]: value };
    setContent(updatedContent);
    onUpdate(block.id, updatedContent);
  };

  const handleStatChange = (index: number, field: string, value: string) => {
    const updatedStats = [...(content.stats || [])];
    updatedStats[index] = {
      ...updatedStats[index],
      [field]: value
    };
    handleChange('stats', updatedStats);
  };

  const addStat = () => {
    const newStat = {
      icon: '',
      title: '',
      description: '',
      color: '#000000'
    };
    handleChange('stats', [...(content.stats || []), newStat]);
  };

  const removeStat = (index: number) => {
    const updatedStats = [...(content.stats || [])].filter((_, i) => i !== index);
    handleChange('stats', updatedStats);
  };

  const handleTimelineChange = (index: number, value: string) => {
    const updatedTimeline = [...(content.timelineItems || [])];
    updatedTimeline[index] = value;
    handleChange('timelineItems', updatedTimeline);
  };

  const addTimelineItem = () => {
    handleChange('timelineItems', [...(content.timelineItems || []), '']);
  };

  const removeTimelineItem = (index: number) => {
    const updatedTimeline = [...(content.timelineItems || [])].filter((_, i) => i !== index);
    handleChange('timelineItems', updatedTimeline);
  };

  console.log('Rendering SustainabilityEditor with block type:', block.type);
  console.log('Current content:', content);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={content.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter section title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={content.description || ''}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="Enter section description"
        />
      </div>

      <div className="space-y-2">
        <Label>Stats</Label>
        <div className="space-y-4">
          {content.stats?.map((stat, index) => (
            <div key={index} className="space-y-2 p-4 border rounded-lg relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => removeStat(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Input
                value={stat.icon || ''}
                onChange={(e) => handleStatChange(index, 'icon', e.target.value)}
                placeholder="Icon name"
                className="mb-2"
              />
              <Input
                value={stat.title || ''}
                onChange={(e) => handleStatChange(index, 'title', e.target.value)}
                placeholder="Title"
                className="mb-2"
              />
              <Input
                value={stat.description || ''}
                onChange={(e) => handleStatChange(index, 'description', e.target.value)}
                placeholder="Description"
                className="mb-2"
              />
              <Input
                type="color"
                value={stat.color || '#000000'}
                onChange={(e) => handleStatChange(index, 'color', e.target.value)}
                className="mb-2"
              />
            </div>
          ))}
          <Button onClick={addStat} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Stat
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Timeline Items</Label>
        <div className="space-y-4">
          {content.timelineItems?.map((item, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={item}
                onChange={(e) => handleTimelineChange(index, e.target.value)}
                placeholder="Timeline item"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeTimelineItem(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
          <Button onClick={addTimelineItem} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Timeline Item
          </Button>
        </div>
      </div>
    </div>
  );
};