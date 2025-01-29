import { ContentBlock, BlockContent } from "@/types/content-blocks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

interface CommonEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const CommonEditor = ({ block, onUpdate }: CommonEditorProps) => {
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

    default:
      return null;
  }
};