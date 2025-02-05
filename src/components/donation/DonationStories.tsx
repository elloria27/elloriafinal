import { ContentBlock } from "@/types/content-blocks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface DonationStoriesProps {
  content: {
    title?: string;
    description?: string;
    stories?: Array<{
      name: string;
      role: string;
      quote: string;
      image?: string;
    }>;
  };
}

export const DonationStories = ({ content }: DonationStoriesProps) => {
  const handleArrayUpdate = (index: number, updates: Partial<DonationStoriesProps['content']['stories'][number]>) => {
    const updatedStories = [...(content.stories || [])];
    updatedStories[index] = { ...updatedStories[index], ...updates };
    // Call a function to update the parent state with the new stories array
  };

  const handleAddStory = () => {
    const newStory = { name: "", role: "", quote: "", image: "" };
    // Call a function to update the parent state with the new story added to the stories array
  };

  const handleRemoveStory = (index: number) => {
    const updatedStories = [...(content.stories || [])];
    updatedStories.splice(index, 1);
    // Call a function to update the parent state with the updated stories array
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>Title</Label>
        <Input
          value={content.title || ""}
          onChange={(e) => {
            // Call a function to update the parent state with the new title
          }}
        />
      </div>
      <div>
        <Label>Description</Label>
        <Textarea
          value={content.description || ""}
          onChange={(e) => {
            // Call a function to update the parent state with the new description
          }}
        />
      </div>
      <div>
        <Label>Stories</Label>
        {(content.stories || []).map((story, index) => (
          <div key={index} className="space-y-2 mt-2 p-4 border rounded-lg">
            <Input
              placeholder="Name"
              value={story.name}
              onChange={(e) => handleArrayUpdate(index, { name: e.target.value })}
            />
            <Input
              placeholder="Role"
              value={story.role}
              onChange={(e) => handleArrayUpdate(index, { role: e.target.value })}
            />
            <Textarea
              placeholder="Quote"
              value={story.quote}
              onChange={(e) => handleArrayUpdate(index, { quote: e.target.value })}
            />
            <Input
              placeholder="Image URL"
              value={story.image}
              onChange={(e) => handleArrayUpdate(index, { image: e.target.value })}
            />
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleRemoveStory(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddStory}
          className="mt-2"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Story
        </Button>
      </div>
    </div>
  );
};
