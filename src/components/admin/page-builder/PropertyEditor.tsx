import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { ContentBlock, BlockContent } from "@/types/content-blocks";

interface PropertyEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const PropertyEditor = ({ block, onUpdate }: PropertyEditorProps) => {
  const [content, setContent] = useState<BlockContent>(block.content);
  console.log("Rendering PropertyEditor for block type:", block.type);
  console.log("Current content:", content);

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

  const renderFields = () => {
    switch (block.type) {
      case "heading":
        return (
          <div className="space-y-4">
            <div>
              <Label>Text</Label>
              <Input
                value={content.text as string || ""}
                onChange={(e) => handleChange("text", e.target.value)}
              />
            </div>
            <div>
              <Label>Size</Label>
              <select
                className="w-full border rounded p-2"
                value={content.size as string || "h2"}
                onChange={(e) => handleChange("size", e.target.value)}
              >
                <option value="h1">H1</option>
                <option value="h2">H2</option>
                <option value="h3">H3</option>
                <option value="h4">H4</option>
              </select>
            </div>
          </div>
        );

      case "text":
        return (
          <div>
            <Label>Text</Label>
            <Textarea
              value={content.text as string || ""}
              onChange={(e) => handleChange("text", e.target.value)}
              className="min-h-[100px]"
            />
          </div>
        );

      case "image":
        return (
          <div className="space-y-4">
            <div>
              <Label>Image URL</Label>
              <Input
                value={content.url as string || ""}
                onChange={(e) => handleChange("url", e.target.value)}
              />
            </div>
            <div>
              <Label>Alt Text</Label>
              <Input
                value={content.alt as string || ""}
                onChange={(e) => handleChange("alt", e.target.value)}
              />
            </div>
          </div>
        );

      case "video":
        return (
          <div className="space-y-4">
            <div>
              <Label>Video URL</Label>
              <Input
                value={content.url as string || ""}
                onChange={(e) => handleChange("url", e.target.value)}
              />
            </div>
            <div>
              <Label>Title</Label>
              <Input
                value={content.title as string || ""}
                onChange={(e) => handleChange("title", e.target.value)}
              />
            </div>
          </div>
        );

      case "button":
        return (
          <div className="space-y-4">
            <div>
              <Label>Text</Label>
              <Input
                value={content.text as string || ""}
                onChange={(e) => handleChange("text", e.target.value)}
              />
            </div>
            <div>
              <Label>URL</Label>
              <Input
                value={content.url as string || ""}
                onChange={(e) => handleChange("url", e.target.value)}
              />
            </div>
            <div>
              <Label>Variant</Label>
              <select
                className="w-full border rounded p-2"
                value={content.variant as string || "default"}
                onChange={(e) => handleChange("variant", e.target.value)}
              >
                <option value="default">Default</option>
                <option value="outline">Outline</option>
                <option value="ghost">Ghost</option>
              </select>
            </div>
          </div>
        );

      case "hero":
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

      case "features":
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
              <Label>Features</Label>
              <div className="space-y-4">
                {(content.features as any[] || []).map((feature, index) => (
                  <div key={index} className="p-4 border rounded space-y-2">
                    <Input
                      placeholder="Icon"
                      value={feature.icon || ""}
                      onChange={(e) =>
                        handleArrayChange("features", index, {
                          ...feature,
                          icon: e.target.value,
                        })
                      }
                    />
                    <Input
                      placeholder="Title"
                      value={feature.title || ""}
                      onChange={(e) =>
                        handleArrayChange("features", index, {
                          ...feature,
                          title: e.target.value,
                        })
                      }
                    />
                    <Textarea
                      placeholder="Description"
                      value={feature.description || ""}
                      onChange={(e) =>
                        handleArrayChange("features", index, {
                          ...feature,
                          description: e.target.value,
                        })
                      }
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeArrayItem("features", index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() =>
                    addArrayItem("features", {
                      icon: "",
                      title: "",
                      description: "",
                    })
                  }
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Feature
                </Button>
              </div>
            </div>
          </div>
        );

      case "game_changer":
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
              <Label>Description</Label>
              <Textarea
                value={content.description as string || ""}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>
            <div>
              <Label>Features</Label>
              <div className="space-y-4">
                {(content.features as any[] || []).map((feature, index) => (
                  <div key={index} className="p-4 border rounded space-y-2">
                    <select
                      className="w-full border rounded p-2"
                      value={feature.icon || ""}
                      onChange={(e) =>
                        handleArrayChange("features", index, {
                          ...feature,
                          icon: e.target.value,
                        })
                      }
                    >
                      <option value="Droplets">Droplets</option>
                      <option value="Leaf">Leaf</option>
                      <option value="Heart">Heart</option>
                    </select>
                    <Input
                      placeholder="Title"
                      value={feature.title || ""}
                      onChange={(e) =>
                        handleArrayChange("features", index, {
                          ...feature,
                          title: e.target.value,
                        })
                      }
                    />
                    <Textarea
                      placeholder="Description"
                      value={feature.description || ""}
                      onChange={(e) =>
                        handleArrayChange("features", index, {
                          ...feature,
                          description: e.target.value,
                        })
                      }
                    />
                    <Input
                      placeholder="Detail"
                      value={feature.detail || ""}
                      onChange={(e) =>
                        handleArrayChange("features", index, {
                          ...feature,
                          detail: e.target.value,
                        })
                      }
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeArrayItem("features", index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() =>
                    addArrayItem("features", {
                      icon: "Droplets",
                      title: "",
                      description: "",
                      detail: "",
                    })
                  }
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Feature
                </Button>
              </div>
            </div>
          </div>
        );

      case "store_brands":
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
              <Label>Brands</Label>
              <div className="space-y-4">
                {(content.brands as any[] || []).map((brand, index) => (
                  <div key={index} className="p-4 border rounded space-y-2">
                    <Input
                      placeholder="Brand Name"
                      value={brand.name || ""}
                      onChange={(e) =>
                        handleArrayChange("brands", index, {
                          ...brand,
                          name: e.target.value,
                        })
                      }
                    />
                    <Input
                      placeholder="Logo URL"
                      value={brand.logo || ""}
                      onChange={(e) =>
                        handleArrayChange("brands", index, {
                          ...brand,
                          logo: e.target.value,
                        })
                      }
                    />
                    <Input
                      placeholder="Link"
                      value={brand.link || ""}
                      onChange={(e) =>
                        handleArrayChange("brands", index, {
                          ...brand,
                          link: e.target.value,
                        })
                      }
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeArrayItem("brands", index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() =>
                    addArrayItem("brands", {
                      name: "",
                      logo: "",
                      link: "",
                    })
                  }
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Brand
                </Button>
              </div>
            </div>
          </div>
        );

      case "sustainability":
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
                      <option value="Recycle">Recycle</option>
                      <option value="Package">Package</option>
                      <option value="Factory">Factory</option>
                    </select>
                    <Input
                      placeholder="Title"
                      value={stat.title || ""}
                      onChange={(e) =>
                        handleArrayChange("stats", index, {
                          ...stat,
                          title: e.target.value,
                        })
                      }
                    />
                    <Input
                      placeholder="Description"
                      value={stat.description || ""}
                      onChange={(e) =>
                        handleArrayChange("stats", index, {
                          ...stat,
                          description: e.target.value,
                        })
                      }
                    />
                    <Input
                      placeholder="Color (e.g., bg-accent-green)"
                      value={stat.color || ""}
                      onChange={(e) =>
                        handleArrayChange("stats", index, {
                          ...stat,
                          color: e.target.value,
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
                      icon: "Recycle",
                      title: "",
                      description: "",
                      color: "bg-accent-green",
                    })
                  }
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Stat
                </Button>
              </div>
            </div>
          </div>
        );

      case "product_carousel":
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
              <Label>Description</Label>
              <Textarea
                value={content.description as string || ""}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>
          </div>
        );

      case "testimonials":
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
              <Label>Testimonials</Label>
              <div className="space-y-4">
                {(content.testimonials as any[] || []).map((testimonial, index) => (
                  <div key={index} className="p-4 border rounded space-y-2">
                    <Input
                      placeholder="Name"
                      value={testimonial.name || ""}
                      onChange={(e) =>
                        handleArrayChange("testimonials", index, {
                          ...testimonial,
                          name: e.target.value,
                        })
                      }
                    />
                    <Input
                      type="number"
                      placeholder="Rating"
                      value={testimonial.rating || ""}
                      onChange={(e) =>
                        handleArrayChange("testimonials", index, {
                          ...testimonial,
                          rating: parseInt(e.target.value),
                        })
                      }
                    />
                    <Textarea
                      placeholder="Text"
                      value={testimonial.text || ""}
                      onChange={(e) =>
                        handleArrayChange("testimonials", index, {
                          ...testimonial,
                          text: e.target.value,
                        })
                      }
                    />
                    <Input
                      placeholder="Source"
                      value={testimonial.source || ""}
                      onChange={(e) =>
                        handleArrayChange("testimonials", index, {
                          ...testimonial,
                          source: e.target.value,
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
                      name: "",
                      rating: 5,
                      text: "",
                      source: "",
                    })
                  }
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Testimonial
                </Button>
              </div>
            </div>
          </div>
        );

      case "blog_preview":
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
              <Label>Articles</Label>
              <div className="space-y-4">
                {(content.articles as any[] || []).map((article, index) => (
                  <div key={index} className="p-4 border rounded space-y-2">
                    <Input
                      placeholder="Title"
                      value={article.title || ""}
                      onChange={(e) =>
                        handleArrayChange("articles", index, {
                          ...article,
                          title: e.target.value,
                        })
                      }
                    />
                    <Input
                      placeholder="Category"
                      value={article.category || ""}
                      onChange={(e) =>
                        handleArrayChange("articles", index, {
                          ...article,
                          category: e.target.value,
                        })
                      }
                    />
                    <Input
                      placeholder="Image URL"
                      value={article.image || ""}
                      onChange={(e) =>
                        handleArrayChange("articles", index, {
                          ...article,
                          image: e.target.value,
                        })
                      }
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeArrayItem("articles", index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() =>
                    addArrayItem("articles", {
                      title: "",
                      category: "",
                      image: "",
                    })
                  }
                >
                  <Plus className="h-4 w-4 mr-2" /> Add Article
                </Button>
              </div>
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

      case "contact_hero":
      case "contact_form":
      case "contact_details":
      case "contact_faq":
      case "contact_business":
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
            {block.type === "contact_details" && (
              <>
                <div>
                  <Label>Address</Label>
                  <Input
                    value={content.address as string || ""}
                    onChange={(e) => handleChange("address", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input
                    value={content.phone as string || ""}
                    onChange={(e) => handleChange("phone", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={content.email as string || ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
              </>
            )}
            {block.type === "contact_faq" && (
              <div>
                <Label>FAQs</Label>
                <div className="space-y-4">
                  {(content.faqs as any[] || []).map((faq, index) => (
                    <div key={index} className="p-4 border rounded space-y-2">
                      <Input
                        placeholder="Question"
                        value={faq.question || ""}
                        onChange={(e) =>
                          handleArrayChange("faqs", index, {
                            ...faq,
                            question: e.target.value,
                          })
                        }
                      />
                      <Textarea
                        placeholder="Answer"
                        value={faq.answer || ""}
                        onChange={(e) =>
                          handleArrayChange("faqs", index, {
                            ...faq,
                            answer: e.target.value,
                          })
                        }
                      />
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeArrayItem("faqs", index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() =>
                      addArrayItem("faqs", {
                        question: "",
                        answer: "",
                      })
                    }
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add FAQ
                  </Button>
                </div>
              </div>
            )}
            {block.type === "contact_business" && (
              <>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={content.email as string || ""}
                    onChange={(e) => handleChange("email", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Button Text</Label>
                  <Input
                    value={content.buttonText as string || ""}
                    onChange={(e) => handleChange("buttonText", e.target.value)}
                  />
                </div>
                <div>
                  <Label>Button Link</Label>
                  <Input
                    value={content.buttonLink as string || ""}
                    onChange={(e) => handleChange("buttonLink", e.target.value)}
                  />
                </div>
              </>
            )}
          </div>
        );

      default:
        console.warn(`No editor available for block type: ${block.type}`);
        return (
          <div className="p-4 text-center text-gray-500">
            No properties available for this component type
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="font-semibold text-lg">Edit {block.type}</div>
      {renderFields()}
    </div>
  );
};
