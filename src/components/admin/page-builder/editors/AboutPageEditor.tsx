import { ContentBlock, BlockContent } from "@/types/content-blocks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface AboutPageEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const AboutPageEditor = ({ block, onUpdate }: AboutPageEditorProps) => {
  const [content, setContent] = useState<BlockContent>(block.content);

  const handleChange = (key: string, value: any) => {
    const updatedContent = { ...content, [key]: value };
    setContent(updatedContent);
    onUpdate(block.id, updatedContent);
  };

  const handleArrayChange = (key: string, index: number, value: any) => {
    const array = [...(content[key] as any[] || [])];
    array[index] = { ...array[index], ...value };
    handleChange(key, array);
  };

  const addArrayItem = (key: string, defaultItem: any) => {
    const array = [...(content[key] as any[] || [])];
    array.push(defaultItem);
    handleChange(key, array);
  };

  const removeArrayItem = (key: string, index: number) => {
    const array = [...(content[key] as any[] || [])];
    array.splice(index, 1);
    handleChange(key, array);
  };

  switch (block.type) {
    case "about_hero_section":
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={content.title as string || ""}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Textarea
              value={content.subtitle as string || ""}
              onChange={(e) => handleChange("subtitle", e.target.value)}
            />
          </div>
          <div>
            <Label>Background Image URL</Label>
            <Input
              value={content.backgroundImage as string || ""}
              onChange={(e) => handleChange("backgroundImage", e.target.value)}
            />
          </div>
        </div>
      );

    case "about_story":
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={content.title as string || ""}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              value={content.subtitle as string || ""}
              onChange={(e) => handleChange("subtitle", e.target.value)}
            />
          </div>
          <div>
            <Label>Content</Label>
            <Textarea
              value={content.content as string || ""}
              onChange={(e) => handleChange("content", e.target.value)}
            />
          </div>
          <div>
            <Label>Video URL</Label>
            <Input
              value={content.videoUrl as string || ""}
              onChange={(e) => handleChange("videoUrl", e.target.value)}
            />
          </div>
          <div>
            <Label>Video Thumbnail</Label>
            <Input
              value={content.videoThumbnail as string || ""}
              onChange={(e) => handleChange("videoThumbnail", e.target.value)}
            />
          </div>
        </div>
      );

    case "about_mission":
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={content.title as string || ""}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={content.description as string || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
          <div>
            <Label>Values</Label>
            <div className="space-y-4">
              {(content.values as any[] || []).map((value, index) => (
                <div key={index} className="p-4 border rounded space-y-2">
                  <select
                    className="w-full border rounded p-2"
                    value={value.icon || ""}
                    onChange={(e) =>
                      handleArrayChange("values", index, {
                        ...value,
                        icon: e.target.value,
                      })
                    }
                  >
                    <option value="Leaf">Leaf</option>
                    <option value="Star">Star</option>
                    <option value="Heart">Heart</option>
                  </select>
                  <Input
                    placeholder="Title"
                    value={value.title || ""}
                    onChange={(e) =>
                      handleArrayChange("values", index, {
                        ...value,
                        title: e.target.value,
                      })
                    }
                  />
                  <Textarea
                    placeholder="Description"
                    value={value.description || ""}
                    onChange={(e) =>
                      handleArrayChange("values", index, {
                        ...value,
                        description: e.target.value,
                      })
                    }
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeArrayItem("values", index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() =>
                  addArrayItem("values", {
                    icon: "Leaf",
                    title: "",
                    description: "",
                  })
                }
              >
                <Plus className="h-4 w-4 mr-2" /> Add Value
              </Button>
            </div>
          </div>
        </div>
      );

    case "about_sustainability":
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={content.title as string || ""}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={content.description as string || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
          <div>
            <Label>Stats</Label>
            <div className="space-y-4">
              {(content.stats as any[] || []).map((stat, index) => (
                <div key={index} className="p-4 border rounded space-y-2">
                  <select
                    className="w-full border rounded p-2"
                    value={stat.icon || ""}
                    onChange={(e) =>
                      handleArrayChange("stats", index, {
                        ...stat,
                        icon: e.target.value,
                      })
                    }
                  >
                    <option value="Leaf">Leaf</option>
                    <option value="Recycle">Recycle</option>
                    <option value="TreePine">Tree Pine</option>
                  </select>
                  <Input
                    placeholder="Value"
                    value={stat.value || ""}
                    onChange={(e) =>
                      handleArrayChange("stats", index, {
                        ...stat,
                        value: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Label"
                    value={stat.label || ""}
                    onChange={(e) =>
                      handleArrayChange("stats", index, {
                        ...stat,
                        label: e.target.value,
                      })
                    }
                  />
                  <Textarea
                    placeholder="Description"
                    value={stat.description || ""}
                    onChange={(e) =>
                      handleArrayChange("stats", index, {
                        ...stat,
                        description: e.target.value,
                      })
                    }
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeArrayItem("stats", index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() =>
                  addArrayItem("stats", {
                    icon: "Leaf",
                    value: "",
                    label: "",
                    description: "",
                  })
                }
              >
                <Plus className="h-4 w-4 mr-2" /> Add Stat
              </Button>
            </div>
          </div>
        </div>
      );

    case "about_team":
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={content.title as string || ""}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          <div>
            <Label>Subtitle</Label>
            <Input
              value={content.subtitle as string || ""}
              onChange={(e) => handleChange("subtitle", e.target.value)}
            />
          </div>
          <div>
            <Label>Team Members</Label>
            <div className="space-y-4">
              {(content.members as any[] || []).map((member, index) => (
                <div key={index} className="p-4 border rounded space-y-2">
                  <Input
                    placeholder="Name"
                    value={member.name || ""}
                    onChange={(e) =>
                      handleArrayChange("members", index, {
                        ...member,
                        name: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Role"
                    value={member.role || ""}
                    onChange={(e) =>
                      handleArrayChange("members", index, {
                        ...member,
                        role: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Image URL"
                    value={member.image || ""}
                    onChange={(e) =>
                      handleArrayChange("members", index, {
                        ...member,
                        image: e.target.value,
                      })
                    }
                  />
                  <Textarea
                    placeholder="Quote"
                    value={member.quote || ""}
                    onChange={(e) =>
                      handleArrayChange("members", index, {
                        ...member,
                        quote: e.target.value,
                      })
                    }
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeArrayItem("members", index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() =>
                  addArrayItem("members", {
                    name: "",
                    role: "",
                    image: "",
                    quote: "",
                  })
                }
              >
                <Plus className="h-4 w-4 mr-2" /> Add Team Member
              </Button>
            </div>
          </div>
        </div>
      );

    case "about_customer_impact":
      return (
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={content.title as string || ""}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={content.description as string || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
          <div>
            <Label>Stats</Label>
            <div className="space-y-4">
              {(content.stats as any[] || []).map((stat, index) => (
                <div key={index} className="p-4 border rounded space-y-2">
                  <Input
                    placeholder="Value"
                    value={stat.value || ""}
                    onChange={(e) =>
                      handleArrayChange("stats", index, {
                        ...stat,
                        value: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Label"
                    value={stat.label || ""}
                    onChange={(e) =>
                      handleArrayChange("stats", index, {
                        ...stat,
                        label: e.target.value,
                      })
                    }
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeArrayItem("stats", index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() =>
                  addArrayItem("stats", {
                    value: "",
                    label: "",
                  })
                }
              >
                <Plus className="h-4 w-4 mr-2" /> Add Stat
              </Button>
            </div>
          </div>
          <div>
            <Label>Testimonials</Label>
            <div className="space-y-4">
              {(content.testimonials as any[] || []).map((testimonial, index) => (
                <div key={index} className="p-4 border rounded space-y-2">
                  <Textarea
                    placeholder="Quote"
                    value={testimonial.quote || ""}
                    onChange={(e) =>
                      handleArrayChange("testimonials", index, {
                        ...testimonial,
                        quote: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Author"
                    value={testimonial.author || ""}
                    onChange={(e) =>
                      handleArrayChange("testimonials", index, {
                        ...testimonial,
                        author: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Role"
                    value={testimonial.role || ""}
                    onChange={(e) =>
                      handleArrayChange("testimonials", index, {
                        ...testimonial,
                        role: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Rating"
                    value={testimonial.rating || 5}
                    onChange={(e) =>
                      handleArrayChange("testimonials", index, {
                        ...testimonial,
                        rating: parseInt(e.target.value),
                      })
                    }
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeArrayItem("testimonials", index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() =>
                  addArrayItem("testimonials", {
                    quote: "",
                    author: "",
                    role: "",
                    rating: 5,
                  })
                }
              >
                <Plus className="h-4 w-4 mr-2" /> Add Testimonial
              </Button>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};