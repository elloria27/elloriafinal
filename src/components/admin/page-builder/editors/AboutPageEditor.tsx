import { useState } from "react";
import { ContentBlock, BlockContent, AboutStoryContent, AboutMissionContent, AboutSustainabilityContent, AboutTeamContent, AboutCustomerImpactContent } from "@/types/content-blocks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface AboutPageEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const AboutPageEditor = ({ block, onUpdate }: AboutPageEditorProps) => {
  const handleChange = (key: string, value: any) => {
    console.log("Updating content:", key, value);
    const updatedContent = { ...block.content, [key]: value };
    onUpdate(block.id, updatedContent);
  };

  const renderStoryEditor = () => {
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
          <Input
            value={content.videoThumbnail || ""}
            onChange={(e) => handleChange("videoThumbnail", e.target.value)}
            placeholder="Enter video thumbnail URL"
          />
        </div>
      </div>
    );
  };

  const renderMissionEditor = () => {
    const content = block.content as AboutMissionContent;
    const values = Array.isArray(content.values) ? content.values : [];

    const handleValueUpdate = (index: number, field: string, value: string) => {
      const updatedValues = [...values];
      updatedValues[index] = { ...updatedValues[index], [field]: value };
      handleChange("values", updatedValues);
    };

    const addValue = () => {
      handleChange("values", [...values, { icon: "Leaf", title: "", description: "" }]);
    };

    const removeValue = (index: number) => {
      const updatedValues = values.filter((_, i) => i !== index);
      handleChange("values", updatedValues);
    };

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
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Values</Label>
            <Button type="button" variant="outline" size="sm" onClick={addValue}>
              <Plus className="w-4 h-4 mr-2" />
              Add Value
            </Button>
          </div>

          {values.map((value, index) => (
            <div key={index} className="space-y-2 p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <Label>Value {index + 1}</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeValue(index)}
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Icon</Label>
                <select
                  value={value.icon}
                  onChange={(e) => handleValueUpdate(index, "icon", e.target.value)}
                  className="w-full border rounded-md p-2"
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
                  onChange={(e) => handleValueUpdate(index, "title", e.target.value)}
                  placeholder="Enter title"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={value.description}
                  onChange={(e) => handleValueUpdate(index, "description", e.target.value)}
                  placeholder="Enter description"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSustainabilityEditor = () => {
    const content = block.content as AboutSustainabilityContent;
    const stats = Array.isArray(content.stats) ? content.stats : [];

    const handleStatUpdate = (index: number, field: string, value: string) => {
      const updatedStats = [...stats];
      updatedStats[index] = { ...updatedStats[index], [field]: value };
      handleChange("stats", updatedStats);
    };

    const addStat = () => {
      handleChange("stats", [...stats, { icon: "Leaf", value: "", label: "", description: "" }]);
    };

    const removeStat = (index: number) => {
      const updatedStats = stats.filter((_, i) => i !== index);
      handleChange("stats", updatedStats);
    };

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
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Stats</Label>
            <Button type="button" variant="outline" size="sm" onClick={addStat}>
              <Plus className="w-4 h-4 mr-2" />
              Add Stat
            </Button>
          </div>

          {stats.map((stat, index) => (
            <div key={index} className="space-y-2 p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <Label>Stat {index + 1}</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeStat(index)}
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Icon</Label>
                <select
                  value={stat.icon}
                  onChange={(e) => handleStatUpdate(index, "icon", e.target.value)}
                  className="w-full border rounded-md p-2"
                >
                  <option value="Leaf">Leaf</option>
                  <option value="Recycle">Recycle</option>
                  <option value="TreePine">Tree Pine</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Value</Label>
                <Input
                  value={stat.value}
                  onChange={(e) => handleStatUpdate(index, "value", e.target.value)}
                  placeholder="Enter value"
                />
              </div>

              <div className="space-y-2">
                <Label>Label</Label>
                <Input
                  value={stat.label}
                  onChange={(e) => handleStatUpdate(index, "label", e.target.value)}
                  placeholder="Enter label"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Input
                  value={stat.description}
                  onChange={(e) => handleStatUpdate(index, "description", e.target.value)}
                  placeholder="Enter description"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderTeamEditor = () => {
    const content = block.content as AboutTeamContent;
    const members = Array.isArray(content.members) ? content.members : [];

    const handleMemberUpdate = (index: number, field: string, value: string) => {
      const updatedMembers = [...members];
      updatedMembers[index] = { ...updatedMembers[index], [field]: value };
      handleChange("members", updatedMembers);
    };

    const addMember = () => {
      handleChange("members", [...members, { name: "", role: "", image: "", quote: "", bio: "" }]);
    };

    const removeMember = (index: number) => {
      const updatedMembers = members.filter((_, i) => i !== index);
      handleChange("members", updatedMembers);
    };

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
          <div className="flex items-center justify-between">
            <Label>Team Members</Label>
            <Button type="button" variant="outline" size="sm" onClick={addMember}>
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </div>

          {members.map((member, index) => (
            <div key={index} className="space-y-2 p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <Label>Member {index + 1}</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMember(index)}
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={member.name}
                  onChange={(e) => handleMemberUpdate(index, "name", e.target.value)}
                  placeholder="Enter name"
                />
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Input
                  value={member.role}
                  onChange={(e) => handleMemberUpdate(index, "role", e.target.value)}
                  placeholder="Enter role"
                />
              </div>

              <div className="space-y-2">
                <Label>Image URL</Label>
                <Input
                  value={member.image || ""}
                  onChange={(e) => handleMemberUpdate(index, "image", e.target.value)}
                  placeholder="Enter image URL"
                />
              </div>

              <div className="space-y-2">
                <Label>Quote</Label>
                <Input
                  value={member.quote || ""}
                  onChange={(e) => handleMemberUpdate(index, "quote", e.target.value)}
                  placeholder="Enter quote"
                />
              </div>

              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea
                  value={member.bio || ""}
                  onChange={(e) => handleMemberUpdate(index, "bio", e.target.value)}
                  placeholder="Enter bio"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCustomerImpactEditor = () => {
    const content = block.content as AboutCustomerImpactContent;
    const testimonials = Array.isArray(content.testimonials) ? content.testimonials : [];

    const handleTestimonialUpdate = (index: number, field: string, value: any) => {
      const updatedTestimonials = [...testimonials];
      updatedTestimonials[index] = { ...updatedTestimonials[index], [field]: value };
      handleChange("testimonials", updatedTestimonials);
    };

    const addTestimonial = () => {
      handleChange("testimonials", [...testimonials, { quote: "", author: "", role: "", rating: 5 }]);
    };

    const removeTestimonial = (index: number) => {
      const updatedTestimonials = testimonials.filter((_, i) => i !== index);
      handleChange("testimonials", updatedTestimonials);
    };

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
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Testimonials</Label>
            <Button type="button" variant="outline" size="sm" onClick={addTestimonial}>
              <Plus className="w-4 h-4 mr-2" />
              Add Testimonial
            </Button>
          </div>

          {testimonials.map((testimonial, index) => (
            <div key={index} className="space-y-2 p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <Label>Testimonial {index + 1}</Label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTestimonial(index)}
                >
                  <Minus className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Quote</Label>
                <Textarea
                  value={testimonial.quote}
                  onChange={(e) => handleTestimonialUpdate(index, "quote", e.target.value)}
                  placeholder="Enter quote"
                />
              </div>

              <div className="space-y-2">
                <Label>Author</Label>
                <Input
                  value={testimonial.author}
                  onChange={(e) => handleTestimonialUpdate(index, "author", e.target.value)}
                  placeholder="Enter author name"
                />
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <Input
                  value={testimonial.role || ""}
                  onChange={(e) => handleTestimonialUpdate(index, "role", e.target.value)}
                  placeholder="Enter role"
                />
              </div>

              <div className="space-y-2">
                <Label>Rating (1-5)</Label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={testimonial.rating}
                  onChange={(e) => handleTestimonialUpdate(index, "rating", parseInt(e.target.value, 10))}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  switch (block.type) {
    case "about_story":
      return renderStoryEditor();
    case "about_mission":
      return renderMissionEditor();
    case "about_sustainability":
      return renderSustainabilityEditor();
    case "about_team":
      return renderTeamEditor();
    case "about_customer_impact":
      return renderCustomerImpactEditor();
    default:
      return null;
  }
};