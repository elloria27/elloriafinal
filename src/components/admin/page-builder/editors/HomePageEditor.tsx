import { ContentBlock, BlockContent } from "@/types/content-blocks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface HomePageEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const HomePageEditor = ({ block, onUpdate }: HomePageEditorProps) => {
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
    case "hero":
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
            <Label>Video URL</Label>
            <Input
              value={content.videoUrl as string || ""}
              onChange={(e) => handleChange("videoUrl", e.target.value)}
            />
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

    default:
      return null;
  }
};