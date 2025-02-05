import { useState } from "react";
import { ContentBlock, BlockContent } from "@/types/content-blocks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MediaLibraryModal } from "@/components/admin/media/MediaLibraryModal";
import { Plus, Trash2 } from "lucide-react";

interface AboutPageEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const AboutPageEditor = ({ block, onUpdate }: AboutPageEditorProps) => {
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [currentImageField, setCurrentImageField] = useState<string>("");

  const handleChange = (key: string, value: any) => {
    console.log("Updating content:", key, value);
    const updatedContent = { 
      ...block.content as Record<string, any>,
      [key]: value 
    };
    onUpdate(block.id, updatedContent);
  };

  const handleImageSelect = (url: string) => {
    if (currentImageField.includes('.')) {
      const [arrayName, index, field] = currentImageField.split('.');
      const array = [...(block.content[arrayName] as any[] || [])];
      if (array[Number(index)]) {
        array[Number(index)] = { 
          ...array[Number(index)] as Record<string, any>,
          [field]: url 
        };
        handleChange(arrayName, array);
      }
    } else {
      handleChange(currentImageField, url);
    }
    setShowMediaLibrary(false);
  };

  const openMediaLibrary = (fieldName: string) => {
    setCurrentImageField(fieldName);
    setShowMediaLibrary(true);
  };

  switch (block.type) {
    case "about_story":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={(block.content.title as string) || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter title"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={(block.content.subtitle as string) || ""}
              onChange={(e) => handleChange("subtitle", e.target.value)}
              placeholder="Enter subtitle"
            />
          </div>

          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea
              value={(block.content.content as string) || ""}
              onChange={(e) => handleChange("content", e.target.value)}
              placeholder="Enter content"
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <Label>Video URL</Label>
            <Input
              value={(block.content.videoUrl as string) || ""}
              onChange={(e) => handleChange("videoUrl", e.target.value)}
              placeholder="Enter video URL"
            />
          </div>

          <div className="space-y-2">
            <Label>Video Thumbnail</Label>
            <div className="flex items-center gap-2">
              <Input
                value={(block.content.videoThumbnail as string) || ""}
                onChange={(e) => handleChange("videoThumbnail", e.target.value)}
                placeholder="Select thumbnail"
                readOnly
              />
              <Button 
                type="button"
                variant="outline"
                onClick={() => openMediaLibrary("videoThumbnail")}
              >
                Browse
              </Button>
            </div>
            {block.content.videoThumbnail && (
              <img 
                src={block.content.videoThumbnail as string} 
                alt="Thumbnail preview" 
                className="mt-2 max-h-40 rounded-lg"
              />
            )}
          </div>
        </div>
      );

    case "about_mission":
      const values = Array.isArray(block.content.values) ? block.content.values : [];
      
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={(block.content.title as string) || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter title"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={(block.content.description as string) || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter description"
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <Label>Values</Label>
            {values.map((value: any, index: number) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Value {index + 1}</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newValues = values.filter((_, i) => i !== index);
                      handleChange("values", newValues);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <select
                  value={value.icon || 'Leaf'}
                  onChange={(e) => {
                    const newValues = [...values];
                    newValues[index] = { 
                      ...newValues[index] as Record<string, any>,
                      icon: e.target.value 
                    };
                    handleChange("values", newValues);
                  }}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Leaf">Leaf</option>
                  <option value="Star">Star</option>
                  <option value="Heart">Heart</option>
                </select>
                <Input
                  value={value.title || ''}
                  onChange={(e) => {
                    const newValues = [...values];
                    newValues[index] = { 
                      ...newValues[index] as Record<string, any>,
                      title: e.target.value 
                    };
                    handleChange("values", newValues);
                  }}
                  placeholder="Value title"
                />
                <Input
                  value={value.description || ''}
                  onChange={(e) => {
                    const newValues = [...values];
                    newValues[index] = { 
                      ...newValues[index] as Record<string, any>,
                      description: e.target.value 
                    };
                    handleChange("values", newValues);
                  }}
                  placeholder="Value description"
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const newValues = [...values, { icon: 'Leaf', title: '', description: '' }];
                handleChange("values", newValues);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Value
            </Button>
          </div>
        </div>
      );

    case "about_team":
      const members = Array.isArray(block.content.members) ? block.content.members : [];
      
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={(block.content.title as string) || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter title"
            />
          </div>

          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={(block.content.subtitle as string) || ""}
              onChange={(e) => handleChange("subtitle", e.target.value)}
              placeholder="Enter subtitle"
            />
          </div>

          <div className="space-y-4">
            <Label>Team Members</Label>
            {members.map((member: any, index: number) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Member {index + 1}</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newMembers = members.filter((_, i) => i !== index);
                      handleChange("members", newMembers);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Input
                  value={member.name || ''}
                  onChange={(e) => {
                    const newMembers = [...members];
                    newMembers[index] = { 
                      ...newMembers[index] as Record<string, any>,
                      name: e.target.value 
                    };
                    handleChange("members", newMembers);
                  }}
                  placeholder="Member name"
                />
                <Input
                  value={member.role || ''}
                  onChange={(e) => {
                    const newMembers = [...members];
                    newMembers[index] = { 
                      ...newMembers[index] as Record<string, any>,
                      role: e.target.value 
                    };
                    handleChange("members", newMembers);
                  }}
                  placeholder="Member role"
                />
                <div className="flex items-center gap-2">
                  <Input
                    value={member.image || ''}
                    onChange={(e) => {
                      const newMembers = [...members];
                      newMembers[index] = { 
                        ...newMembers[index] as Record<string, any>,
                        image: e.target.value 
                      };
                      handleChange("members", newMembers);
                    }}
                    placeholder="Member image"
                    readOnly
                  />
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setCurrentImageField(`members.${index}.image`);
                      setShowMediaLibrary(true);
                    }}
                  >
                    Browse
                  </Button>
                </div>
                {member.image && (
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="mt-2 w-20 h-20 rounded-full object-cover"
                  />
                )}
                <Input
                  value={member.quote || ''}
                  onChange={(e) => {
                    const newMembers = [...members];
                    newMembers[index] = { 
                      ...newMembers[index] as Record<string, any>,
                      quote: e.target.value 
                    };
                    handleChange("members", newMembers);
                  }}
                  placeholder="Member quote (optional)"
                />
                <Textarea
                  value={member.bio || ''}
                  onChange={(e) => {
                    const newMembers = [...members];
                    newMembers[index] = { 
                      ...newMembers[index] as Record<string, any>,
                      bio: e.target.value 
                    };
                    handleChange("members", newMembers);
                  }}
                  placeholder="Member bio (optional)"
                  rows={3}
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const newMembers = [...members, { name: '', role: '', image: '' }];
                handleChange("members", newMembers);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </div>
        </div>
      );

    default:
      return null;
  }
};