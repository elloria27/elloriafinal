import { useState } from "react";
import { ContentBlock, BlockContent, AboutStoryContent, AboutMissionContent, AboutSustainabilityContent, AboutTeamContent, AboutCustomerImpactContent } from "@/types/content-blocks";
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
    const updatedContent = { ...block.content, [key]: value };
    onUpdate(block.id, updatedContent);
  };

  const handleImageSelect = (url: string) => {
    handleChange(currentImageField, url);
    setShowMediaLibrary(false);
  };

  const openMediaLibrary = (fieldName: string) => {
    setCurrentImageField(fieldName);
    setShowMediaLibrary(true);
  };

  switch (block.type) {
    case "about_story": {
      const content = block.content as AboutStoryContent;
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={content.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter title"
            />
          </div>
          
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={content.subtitle || ""}
              onChange={(e) => handleChange("subtitle", e.target.value)}
              placeholder="Enter subtitle"
            />
          </div>

          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea
              value={content.content || ""}
              onChange={(e) => handleChange("content", e.target.value)}
              placeholder="Enter content"
              rows={5}
            />
          </div>

          <div className="space-y-2">
            <Label>Video URL</Label>
            <Input
              value={content.videoUrl || ""}
              onChange={(e) => handleChange("videoUrl", e.target.value)}
              placeholder="Enter video URL"
            />
          </div>

          <div className="space-y-2">
            <Label>Video Thumbnail</Label>
            <div className="flex items-center gap-2">
              <Input
                value={content.videoThumbnail || ""}
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
            {content.videoThumbnail && (
              <img 
                src={content.videoThumbnail} 
                alt="Thumbnail preview" 
                className="mt-2 max-h-40 rounded-lg"
              />
            )}
          </div>
        </div>
      );
    }

    case "about_mission": {
      const content = block.content as AboutMissionContent;
      const values = Array.isArray(content.values) ? content.values : [];
      
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={content.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter title"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={content.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter description"
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <Label>Values</Label>
            {values.map((value, index) => (
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
                  value={value.icon}
                  onChange={(e) => {
                    const newValues = [...values];
                    newValues[index] = { ...value, icon: e.target.value as 'Leaf' | 'Star' | 'Heart' };
                    handleChange("values", newValues);
                  }}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Leaf">Leaf</option>
                  <option value="Star">Star</option>
                  <option value="Heart">Heart</option>
                </select>
                <Input
                  value={value.title}
                  onChange={(e) => {
                    const newValues = [...values];
                    newValues[index] = { ...value, title: e.target.value };
                    handleChange("values", newValues);
                  }}
                  placeholder="Value title"
                />
                <Input
                  value={value.description}
                  onChange={(e) => {
                    const newValues = [...values];
                    newValues[index] = { ...value, description: e.target.value };
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
    }

    case "about_sustainability": {
      const content = block.content as AboutSustainabilityContent;
      const stats = Array.isArray(content.stats) ? content.stats : [];
      
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={content.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter title"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={content.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter description"
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <Label>Stats</Label>
            {stats.map((stat, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Stat {index + 1}</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newStats = stats.filter((_, i) => i !== index);
                      handleChange("stats", newStats);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <select
                  value={stat.icon}
                  onChange={(e) => {
                    const newStats = [...stats];
                    newStats[index] = { ...stat, icon: e.target.value as 'Leaf' | 'Recycle' | 'TreePine' };
                    handleChange("stats", newStats);
                  }}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Leaf">Leaf</option>
                  <option value="Recycle">Recycle</option>
                  <option value="TreePine">TreePine</option>
                </select>
                <Input
                  value={stat.value}
                  onChange={(e) => {
                    const newStats = [...stats];
                    newStats[index] = { ...stat, value: e.target.value };
                    handleChange("stats", newStats);
                  }}
                  placeholder="Stat value"
                />
                <Input
                  value={stat.label}
                  onChange={(e) => {
                    const newStats = [...stats];
                    newStats[index] = { ...stat, label: e.target.value };
                    handleChange("stats", newStats);
                  }}
                  placeholder="Stat label"
                />
                <Input
                  value={stat.description}
                  onChange={(e) => {
                    const newStats = [...stats];
                    newStats[index] = { ...stat, description: e.target.value };
                    handleChange("stats", newStats);
                  }}
                  placeholder="Stat description"
                />
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const newStats = [...stats, { icon: 'Leaf', value: '', label: '', description: '' }];
                handleChange("stats", newStats);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Stat
            </Button>
          </div>
        </div>
      );
    }

    case "about_team": {
      const content = block.content as AboutTeamContent;
      const members = Array.isArray(content.members) ? content.members : [];
      
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={content.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter title"
            />
          </div>

          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={content.subtitle || ""}
              onChange={(e) => handleChange("subtitle", e.target.value)}
              placeholder="Enter subtitle"
            />
          </div>

          <div className="space-y-4">
            <Label>Team Members</Label>
            {members.map((member, index) => (
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
                  value={member.name}
                  onChange={(e) => {
                    const newMembers = [...members];
                    newMembers[index] = { ...member, name: e.target.value };
                    handleChange("members", newMembers);
                  }}
                  placeholder="Member name"
                />
                <Input
                  value={member.role}
                  onChange={(e) => {
                    const newMembers = [...members];
                    newMembers[index] = { ...member, role: e.target.value };
                    handleChange("members", newMembers);
                  }}
                  placeholder="Member role"
                />
                <div className="flex items-center gap-2">
                  <Input
                    value={member.image || ""}
                    onChange={(e) => {
                      const newMembers = [...members];
                      newMembers[index] = { ...member, image: e.target.value };
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
                  value={member.quote || ""}
                  onChange={(e) => {
                    const newMembers = [...members];
                    newMembers[index] = { ...member, quote: e.target.value };
                    handleChange("members", newMembers);
                  }}
                  placeholder="Member quote (optional)"
                />
                <Textarea
                  value={member.bio || ""}
                  onChange={(e) => {
                    const newMembers = [...members];
                    newMembers[index] = { ...member, bio: e.target.value };
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
                const newMembers = [...members, { name: '', role: '' }];
                handleChange("members", newMembers);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Team Member
            </Button>
          </div>
        </div>
      );
    }

    case "about_customer_impact": {
      const content = block.content as AboutCustomerImpactContent;
      const testimonials = Array.isArray(content.testimonials) ? content.testimonials : [];
      
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={content.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter title"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={content.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Enter description"
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <Label>Testimonials</Label>
            {testimonials.map((testimonial, index) => (
              <div key={index} className="p-4 border rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <Label>Testimonial {index + 1}</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      const newTestimonials = testimonials.filter((_, i) => i !== index);
                      handleChange("testimonials", newTestimonials);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Textarea
                  value={testimonial.quote}
                  onChange={(e) => {
                    const newTestimonials = [...testimonials];
                    newTestimonials[index] = { ...testimonial, quote: e.target.value };
                    handleChange("testimonials", newTestimonials);
                  }}
                  placeholder="Testimonial quote"
                  rows={3}
                />
                <Input
                  value={testimonial.author}
                  onChange={(e) => {
                    const newTestimonials = [...testimonials];
                    newTestimonials[index] = { ...testimonial, author: e.target.value };
                    handleChange("testimonials", newTestimonials);
                  }}
                  placeholder="Author name"
                />
                <Input
                  value={testimonial.role || ""}
                  onChange={(e) => {
                    const newTestimonials = [...testimonials];
                    newTestimonials[index] = { ...testimonial, role: e.target.value };
                    handleChange("testimonials", newTestimonials);
                  }}
                  placeholder="Author role (optional)"
                />
                <div className="space-y-2">
                  <Label>Rating (1-5)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    value={testimonial.rating}
                    onChange={(e) => {
                      const newTestimonials = [...testimonials];
                      newTestimonials[index] = { ...testimonial, rating: Number(e.target.value) };
                      handleChange("testimonials", newTestimonials);
                    }}
                  />
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const newTestimonials = [...testimonials, { quote: '', author: '', rating: 5 }];
                handleChange("testimonials", newTestimonials);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Testimonial
            </Button>
          </div>
        </div>
      );
    }
      
    default:
      return null;
  }
};