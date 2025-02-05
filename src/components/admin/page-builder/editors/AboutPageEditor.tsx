import { useState } from "react";
import { ContentBlock, BlockContent } from "@/types/content-blocks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MediaLibraryModal } from "@/components/admin/media/MediaLibraryModal";
import { Plus, Minus, Trash2 } from "lucide-react";

interface AboutPageEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const AboutPageEditor = ({ block, onUpdate }: AboutPageEditorProps) => {
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [currentImageField, setCurrentImageField] = useState<string>("");

  const handleChange = (key: string, value: any) => {
    console.log("Updating content:", key, value);
    const updatedContent = { ...block.content, [key]: value };
    onUpdate(block.id, updatedContent);
  };

  const handleImageSelect = (url: string) => {
    handleChange(currentImageField, url);
    setShowMediaLibrary(false);
  };

  const handleArrayUpdate = (key: string, index: number, field: string, value: any) => {
    const array = [...(Array.isArray(block.content[key]) ? block.content[key] : [])];
    array[index] = { ...array[index], [field]: value };
    handleChange(key, array);
  };

  const addArrayItem = (key: string, defaultItem: any) => {
    const array = [...(Array.isArray(block.content[key]) ? block.content[key] : [])];
    array.push(defaultItem);
    handleChange(key, array);
  };

  const removeArrayItem = (key: string, index: number) => {
    const array = [...(Array.isArray(block.content[key]) ? block.content[key] : [])];
    array.splice(index, 1);
    handleChange(key, array);
  };

  switch (block.type) {
    case "about_hero_section":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={block.content.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter title"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={block.content.subtitle || ""}
              onChange={(e) => handleChange("subtitle", e.target.value)}
              placeholder="Enter subtitle"
            />
          </div>

          <div className="space-y-2">
            <Label>Background Image</Label>
            <div className="flex items-center gap-2">
              <Input
                value={block.content.backgroundImage || ""}
                onChange={(e) => handleChange("backgroundImage", e.target.value)}
                placeholder="Enter image URL"
                readOnly
              />
              <Button 
                type="button"
                variant="outline"
                onClick={() => {
                  setCurrentImageField("backgroundImage");
                  setShowMediaLibrary(true);
                }}
              >
                Browse
              </Button>
            </div>
            {block.content.backgroundImage && (
              <img 
                src={block.content.backgroundImage} 
                alt="Background preview" 
                className="mt-2 max-h-40 rounded-lg"
              />
            )}
          </div>
        </div>
      );

    case "about_story":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={block.content.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter title"
            />
          </div>

          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={block.content.subtitle || ""}
              onChange={(e) => handleChange("subtitle", e.target.value)}
              placeholder="Enter subtitle"
            />
          </div>

          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea
              value={block.content.content || ""}
              onChange={(e) => handleChange("content", e.target.value)}
              placeholder="Enter content"
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Video URL</Label>
            <Input
              value={block.content.videoUrl || ""}
              onChange={(e) => handleChange("videoUrl", e.target.value)}
              placeholder="Enter video URL"
            />
          </div>

          <div className="space-y-2">
            <Label>Video Thumbnail</Label>
            <div className="flex items-center gap-2">
              <Input
                value={block.content.videoThumbnail || ""}
                onChange={(e) => handleChange("videoThumbnail", e.target.value)}
                placeholder="Enter thumbnail URL"
                readOnly
              />
              <Button 
                type="button"
                variant="outline"
                onClick={() => {
                  setCurrentImageField("videoThumbnail");
                  setShowMediaLibrary(true);
                }}
              >
                Browse
              </Button>
            </div>
            {block.content.videoThumbnail && (
              <img 
                src={block.content.videoThumbnail} 
                alt="Thumbnail preview" 
                className="mt-2 max-h-40 rounded-lg"
              />
            )}
          </div>
        </div>
      );

    case "about_mission":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={block.content.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter title"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={block.content.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter description"
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Values</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem("values", {
                  icon: "Leaf",
                  title: "",
                  description: ""
                })}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Value
              </Button>
            </div>

            {(block.content.values || []).map((value: any, index: number) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <Label>Value {index + 1}</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeArrayItem("values", index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Icon</Label>
                  <select
                    value={value.icon}
                    onChange={(e) => handleArrayUpdate("values", index, "icon", e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="Leaf">Leaf</option>
                    <option value="Star">Star</option>
                    <option value="Heart">Heart</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={value.title}
                    onChange={(e) => handleArrayUpdate("values", index, "title", e.target.value)}
                    placeholder="Enter value title"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={value.description}
                    onChange={(e) => handleArrayUpdate("values", index, "description", e.target.value)}
                    placeholder="Enter value description"
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "about_sustainability":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={block.content.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter title"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={block.content.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter description"
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Stats</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem("stats", {
                  icon: "Leaf",
                  value: "",
                  label: "",
                  description: ""
                })}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Stat
              </Button>
            </div>

            {(block.content.stats || []).map((stat: any, index: number) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <Label>Stat {index + 1}</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeArrayItem("stats", index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Icon</Label>
                  <select
                    value={stat.icon}
                    onChange={(e) => handleArrayUpdate("stats", index, "icon", e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="Leaf">Leaf</option>
                    <option value="Recycle">Recycle</option>
                    <option value="TreePine">TreePine</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>Value</Label>
                  <Input
                    value={stat.value}
                    onChange={(e) => handleArrayUpdate("stats", index, "value", e.target.value)}
                    placeholder="Enter stat value"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Label</Label>
                  <Input
                    value={stat.label}
                    onChange={(e) => handleArrayUpdate("stats", index, "label", e.target.value)}
                    placeholder="Enter stat label"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={stat.description}
                    onChange={(e) => handleArrayUpdate("stats", index, "description", e.target.value)}
                    placeholder="Enter stat description"
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "about_team":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={block.content.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter title"
            />
          </div>

          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={block.content.subtitle || ""}
              onChange={(e) => handleChange("subtitle", e.target.value)}
              placeholder="Enter subtitle"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Team Members</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem("members", {
                  name: "",
                  role: "",
                  image: "",
                  quote: "",
                  bio: ""
                })}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Member
              </Button>
            </div>

            {(block.content.members || []).map((member: any, index: number) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <Label>Member {index + 1}</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeArrayItem("members", index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={member.name}
                    onChange={(e) => handleArrayUpdate("members", index, "name", e.target.value)}
                    placeholder="Enter member name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input
                    value={member.role}
                    onChange={(e) => handleArrayUpdate("members", index, "role", e.target.value)}
                    placeholder="Enter member role"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Image</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      value={member.image || ""}
                      onChange={(e) => handleArrayUpdate("members", index, "image", e.target.value)}
                      placeholder="Enter image URL"
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
                      alt={`${member.name} preview`} 
                      className="mt-2 max-h-40 rounded-lg"
                    />
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Quote</Label>
                  <Textarea
                    value={member.quote || ""}
                    onChange={(e) => handleArrayUpdate("members", index, "quote", e.target.value)}
                    placeholder="Enter member quote"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Bio</Label>
                  <Textarea
                    value={member.bio || ""}
                    onChange={(e) => handleArrayUpdate("members", index, "bio", e.target.value)}
                    placeholder="Enter member bio"
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case "about_customer_impact":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={block.content.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter title"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={block.content.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter description"
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Testimonials</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => addArrayItem("testimonials", {
                  quote: "",
                  author: "",
                  role: "",
                  rating: 5
                })}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Testimonial
              </Button>
            </div>

            {(block.content.testimonials || []).map((testimonial: any, index: number) => (
              <div key={index} className="space-y-2 p-4 border rounded-lg">
                <div className="flex justify-between items-center">
                  <Label>Testimonial {index + 1}</Label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeArrayItem("testimonials", index)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label>Quote</Label>
                  <Textarea
                    value={testimonial.quote}
                    onChange={(e) => handleArrayUpdate("testimonials", index, "quote", e.target.value)}
                    placeholder="Enter testimonial quote"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Author</Label>
                  <Input
                    value={testimonial.author}
                    onChange={(e) => handleArrayUpdate("testimonials", index, "author", e.target.value)}
                    placeholder="Enter author name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input
                    value={testimonial.role || ""}
                    onChange={(e) => handleArrayUpdate("testimonials", index, "role", e.target.value)}
                    placeholder="Enter author role"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Rating (1-5)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    value={testimonial.rating}
                    onChange={(e) => handleArrayUpdate("testimonials", index, "rating", parseInt(e.target.value, 10))}
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

  return (
    <div className="space-y-4">
      <MediaLibraryModal
        open={showMediaLibrary}
        onClose={() => setShowMediaLibrary(false)}
        onSelect={handleImageSelect}
        type="image"
      />
    </div>
  );
};
