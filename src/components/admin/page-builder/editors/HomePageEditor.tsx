import { useState } from "react";
import { ContentBlock, BlockContent } from "@/types/content-blocks";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Image, Video } from "lucide-react";
import { MediaLibraryModal } from "@/components/admin/media/MediaLibraryModal";

interface HomePageEditorProps {
  block: ContentBlock;
  onUpdate: (blockId: string, content: BlockContent) => void;
}

export const HomePageEditor = ({ block, onUpdate }: HomePageEditorProps) => {
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [currentField, setCurrentField] = useState<string>("");

  const handleChange = (key: string, value: any) => {
    const updatedContent = { ...block.content, [key]: value };
    onUpdate(block.id, updatedContent);
  };

  const handleArrayChange = (key: string, index: number, value: any) => {
    const array = [...(block.content[key] as any[] || [])];
    array[index] = { ...array[index], ...value };
    handleChange(key, array);
  };

  const addArrayItem = (key: string, defaultItem: any) => {
    const array = [...(block.content[key] as any[] || [])];
    array.push(defaultItem);
    handleChange(key, array);
  };

  const removeArrayItem = (key: string, index: number) => {
    const array = [...(block.content[key] as any[] || [])];
    array.splice(index, 1);
    handleChange(key, array);
  };

  const openMediaLibrary = (type: "image" | "video", field: string) => {
    setMediaType(type);
    setCurrentField(field);
    setShowMediaLibrary(true);
  };

  const handleMediaSelect = (url: string) => {
    if (currentField.includes(".")) {
      const [arrayName, index, field] = currentField.split(".");
      const array = [...(block.content[arrayName] as any[] || [])];
      array[parseInt(index)][field] = url;
      handleChange(arrayName, array);
    } else {
      handleChange(currentField, url);
    }
    setShowMediaLibrary(false);
  };

  const renderMediaField = (label: string, field: string, type: "image" | "video") => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={
            field.includes(".")
              ? (block.content[field.split(".")[0]] as any[])[parseInt(field.split(".")[1])][
                  field.split(".")[2]
                ]
              : (block.content[field] as string) || ""
          }
          readOnly
          placeholder={`Select ${type}...`}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => openMediaLibrary(type, field)}
        >
          {type === "image" ? <Image className="h-4 w-4" /> : <Video className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );

  switch (block.type) {
    case "hero":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={block.content.title as string || ""}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Textarea
              value={block.content.subtitle as string || ""}
              onChange={(e) => handleChange("subtitle", e.target.value)}
            />
          </div>
          {renderMediaField("Background Image", "backgroundImage", "image")}
          {renderMediaField("Background Video", "backgroundVideo", "video")}
          <MediaLibraryModal
            open={showMediaLibrary}
            onClose={() => setShowMediaLibrary(false)}
            onSelect={handleMediaSelect}
            type={mediaType}
          />
        </div>
      );

    case "game_changer":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={block.content.title as string || ""}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={block.content.description as string || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
          {renderMediaField("Image", "image", "image")}
          <div className="space-y-2">
            <Label>Features</Label>
            <div className="space-y-4">
              {(block.content.features as any[] || []).map((feature, index) => (
                <div key={index} className="p-4 border rounded space-y-2">
                  <Input
                    placeholder="Feature title"
                    value={feature.title || ""}
                    onChange={(e) =>
                      handleArrayChange("features", index, {
                        ...feature,
                        title: e.target.value,
                      })
                    }
                  />
                  <Textarea
                    placeholder="Feature description"
                    value={feature.description || ""}
                    onChange={(e) =>
                      handleArrayChange("features", index, {
                        ...feature,
                        description: e.target.value,
                      })
                    }
                  />
                  {renderMediaField(
                    "Feature Icon",
                    `features.${index}.icon`,
                    "image"
                  )}
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
                    title: "",
                    description: "",
                    icon: "",
                  })
                }
              >
                <Plus className="h-4 w-4 mr-2" /> Add Feature
              </Button>
            </div>
          </div>
          <MediaLibraryModal
            open={showMediaLibrary}
            onClose={() => setShowMediaLibrary(false)}
            onSelect={handleMediaSelect}
            type={mediaType}
          />
        </div>
      );

    case "store_brands":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={block.content.title as string || ""}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={block.content.description as string || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Brands</Label>
            <div className="space-y-4">
              {(block.content.brands as any[] || []).map((brand, index) => (
                <div key={index} className="p-4 border rounded space-y-2">
                  <Input
                    placeholder="Brand name"
                    value={brand.name || ""}
                    onChange={(e) =>
                      handleArrayChange("brands", index, {
                        ...brand,
                        name: e.target.value,
                      })
                    }
                  />
                  {renderMediaField(
                    "Brand Logo",
                    `brands.${index}.logo`,
                    "image"
                  )}
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
                  })
                }
              >
                <Plus className="h-4 w-4 mr-2" /> Add Brand
              </Button>
            </div>
          </div>
          <MediaLibraryModal
            open={showMediaLibrary}
            onClose={() => setShowMediaLibrary(false)}
            onSelect={handleMediaSelect}
            type={mediaType}
          />
        </div>
      );

    case "sustainability":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={block.content.title as string || ""}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={block.content.description as string || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
          {renderMediaField("Background Image", "backgroundImage", "image")}
          <div className="space-y-2">
            <Label>Features</Label>
            <div className="space-y-4">
              {(block.content.features as any[] || []).map((feature, index) => (
                <div key={index} className="p-4 border rounded space-y-2">
                  <Input
                    placeholder="Feature title"
                    value={feature.title || ""}
                    onChange={(e) =>
                      handleArrayChange("features", index, {
                        ...feature,
                        title: e.target.value,
                      })
                    }
                  />
                  <Textarea
                    placeholder="Feature description"
                    value={feature.description || ""}
                    onChange={(e) =>
                      handleArrayChange("features", index, {
                        ...feature,
                        description: e.target.value,
                      })
                    }
                  />
                  {renderMediaField(
                    "Feature Icon",
                    `features.${index}.icon`,
                    "image"
                  )}
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
                    title: "",
                    description: "",
                    icon: "",
                  })
                }
              >
                <Plus className="h-4 w-4 mr-2" /> Add Feature
              </Button>
            </div>
          </div>
          <MediaLibraryModal
            open={showMediaLibrary}
            onClose={() => setShowMediaLibrary(false)}
            onSelect={handleMediaSelect}
            type={mediaType}
          />
        </div>
      );

    case "product_carousel":
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={block.content.title as string || ""}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={block.content.description as string || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Products</Label>
            <div className="space-y-4">
              {(block.content.products as any[] || []).map((product, index) => (
                <div key={index} className="p-4 border rounded space-y-2">
                  <Input
                    placeholder="Product name"
                    value={product.name || ""}
                    onChange={(e) =>
                      handleArrayChange("products", index, {
                        ...product,
                        name: e.target.value,
                      })
                    }
                  />
                  <Textarea
                    placeholder="Product description"
                    value={product.description || ""}
                    onChange={(e) =>
                      handleArrayChange("products", index, {
                        ...product,
                        description: e.target.value,
                      })
                    }
                  />
                  {renderMediaField(
                    "Product Image",
                    `products.${index}.image`,
                    "image"
                  )}
                  <Input
                    placeholder="Product price"
                    type="number"
                    value={product.price || ""}
                    onChange={(e) =>
                      handleArrayChange("products", index, {
                        ...product,
                        price: parseFloat(e.target.value),
                      })
                    }
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeArrayItem("products", index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() =>
                  addArrayItem("products", {
                    name: "",
                    description: "",
                    image: "",
                    price: 0,
                  })
                }
              >
                <Plus className="h-4 w-4 mr-2" /> Add Product
              </Button>
            </div>
          </div>
          <MediaLibraryModal
            open={showMediaLibrary}
            onClose={() => setShowMediaLibrary(false)}
            onSelect={handleMediaSelect}
            type={mediaType}
          />
        </div>
      );

    default:
      return null;
  }
};