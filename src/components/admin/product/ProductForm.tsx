import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Product } from "@/types/product";
import { Trash2, Plus, Image, Video } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type EditFormType = Omit<Product, 'id' | 'created_at' | 'updated_at'>;

interface ProductFormProps {
  product: Product | null;
  onSave: (form: EditFormType) => Promise<void>;
}

const DEFAULT_SPECIFICATIONS = {
  length: "",
  absorption: "",
  quantity: "",
  material: "",
  features: ""
};

const DEFAULT_MEDIA_ITEM = {
  type: "image" as const,
  url: "",
  thumbnail: ""
};

const DEFAULT_WHY_CHOOSE_FEATURE = {
  icon: "",
  title: "",
  description: ""
};

export const ProductForm = ({ product, onSave }: ProductFormProps) => {
  const [editForm, setEditForm] = useState<EditFormType>({
    name: "",
    description: "",
    price: 0,
    image: "",
    features: [],
    specifications: DEFAULT_SPECIFICATIONS,
    media: [],
    why_choose_features: []
  });

  useEffect(() => {
    if (product) {
      setEditForm({
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.image,
        features: product.features,
        specifications: product.specifications || DEFAULT_SPECIFICATIONS,
        media: product.media || [],
        why_choose_features: product.why_choose_features || []
      });
    }
  }, [product]);

  // Features handlers
  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...editForm.features];
    newFeatures[index] = value;
    setEditForm(prev => ({
      ...prev,
      features: newFeatures
    }));
  };

  const handleRemoveFeature = (index: number) => {
    setEditForm(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  const handleAddFeature = () => {
    setEditForm(prev => ({
      ...prev,
      features: [...prev.features, ""]
    }));
  };

  // Media handlers
  const handleMediaChange = (index: number, field: keyof typeof DEFAULT_MEDIA_ITEM, value: string) => {
    const newMedia = [...editForm.media];
    newMedia[index] = { ...newMedia[index], [field]: value };
    setEditForm(prev => ({
      ...prev,
      media: newMedia
    }));
  };

  const handleAddMedia = () => {
    setEditForm(prev => ({
      ...prev,
      media: [...prev.media, { ...DEFAULT_MEDIA_ITEM }]
    }));
  };

  const handleRemoveMedia = (index: number) => {
    setEditForm(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }));
  };

  // Why Choose Features handlers
  const handleWhyChooseFeatureChange = (index: number, field: keyof typeof DEFAULT_WHY_CHOOSE_FEATURE, value: string) => {
    const newFeatures = [...editForm.why_choose_features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    setEditForm(prev => ({
      ...prev,
      why_choose_features: newFeatures
    }));
  };

  const handleAddWhyChooseFeature = () => {
    setEditForm(prev => ({
      ...prev,
      why_choose_features: [...prev.why_choose_features, { ...DEFAULT_WHY_CHOOSE_FEATURE }]
    }));
  };

  const handleRemoveWhyChooseFeature = (index: number) => {
    setEditForm(prev => ({
      ...prev,
      why_choose_features: prev.why_choose_features.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="grid gap-6 py-4">
      {/* Basic Information */}
      <div className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={editForm.name}
            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={editForm.description}
            onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={editForm.price}
            onChange={(e) => setEditForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="image">Main Product Image URL</Label>
          <Input
            id="image"
            value={editForm.image}
            onChange={(e) => setEditForm(prev => ({ ...prev, image: e.target.value }))}
          />
        </div>
      </div>

      {/* Media Gallery */}
      <div className="space-y-4">
        <Label>Media Gallery</Label>
        {editForm.media.map((item, index) => (
          <div key={index} className="grid gap-4 p-4 border rounded-lg">
            <div className="flex gap-4">
              <Select
                value={item.type}
                onValueChange={(value) => handleMediaChange(index, 'type', value as "image" | "video")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="image">
                    <div className="flex items-center gap-2">
                      <Image className="w-4 h-4" />
                      <span>Image</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="video">
                    <div className="flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      <span>Video</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => handleRemoveMedia(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Input
              placeholder="Media URL"
              value={item.url}
              onChange={(e) => handleMediaChange(index, 'url', e.target.value)}
            />
            {item.type === "video" && (
              <Input
                placeholder="Thumbnail URL"
                value={item.thumbnail}
                onChange={(e) => handleMediaChange(index, 'thumbnail', e.target.value)}
              />
            )}
          </div>
        ))}
        <Button variant="outline" onClick={handleAddMedia} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add Media
        </Button>
      </div>

      {/* Features */}
      <div className="space-y-4">
        <Label>Features</Label>
        {editForm.features.map((feature, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={feature}
              onChange={(e) => handleFeatureChange(index, e.target.value)}
            />
            <Button
              variant="destructive"
              size="icon"
              onClick={() => handleRemoveFeature(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button variant="outline" onClick={handleAddFeature}>
          <Plus className="mr-2 h-4 w-4" />
          Add Feature
        </Button>
      </div>

      {/* Why Choose Features */}
      <div className="space-y-4">
        <Label>"Why Choose" Features</Label>
        {editForm.why_choose_features.map((feature, index) => (
          <div key={index} className="grid gap-4 p-4 border rounded-lg">
            <Input
              placeholder="Icon name (e.g., 'droplets', 'shield')"
              value={feature.icon}
              onChange={(e) => handleWhyChooseFeatureChange(index, 'icon', e.target.value)}
            />
            <Input
              placeholder="Title"
              value={feature.title}
              onChange={(e) => handleWhyChooseFeatureChange(index, 'title', e.target.value)}
            />
            <Input
              placeholder="Description"
              value={feature.description}
              onChange={(e) => handleWhyChooseFeatureChange(index, 'description', e.target.value)}
            />
            <Button
              variant="destructive"
              size="icon"
              onClick={() => handleRemoveWhyChooseFeature(index)}
              className="w-fit"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button variant="outline" onClick={handleAddWhyChooseFeature} className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          Add "Why Choose" Feature
        </Button>
      </div>

      {/* Specifications */}
      <div className="space-y-4">
        <Label>Specifications</Label>
        <div className="grid gap-4 p-4 border rounded-lg">
          {Object.entries(editForm.specifications).map(([key, value]) => (
            <div key={key} className="grid gap-2">
              <Label htmlFor={`spec-${key}`} className="capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </Label>
              <Input
                id={`spec-${key}`}
                value={value}
                onChange={(e) => setEditForm(prev => ({
                  ...prev,
                  specifications: {
                    ...prev.specifications,
                    [key]: e.target.value
                  }
                }))}
              />
            </div>
          ))}
        </div>
      </div>

      <Button onClick={() => onSave(editForm)} className="w-full">
        Save Changes
      </Button>
    </div>
  );
};