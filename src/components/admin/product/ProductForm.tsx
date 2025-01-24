import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Product } from "@/types/product";
import { Trash2 } from "lucide-react";

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

  const handleSpecificationChange = (key: keyof Product['specifications'], value: string) => {
    setEditForm(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value
      }
    }));
  };

  return (
    <div className="grid gap-4 py-4">
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
        <Label htmlFor="image">Image URL</Label>
        <Input
          id="image"
          value={editForm.image}
          onChange={(e) => setEditForm(prev => ({ ...prev, image: e.target.value }))}
        />
      </div>

      <div className="grid gap-2">
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
          Add Feature
        </Button>
      </div>

      <div className="grid gap-2">
        <Label>Specifications</Label>
        {Object.entries(editForm.specifications).map(([key, value]) => (
          <div key={key} className="grid gap-2">
            <Label htmlFor={`spec-${key}`}>{key}</Label>
            <Input
              id={`spec-${key}`}
              value={value}
              onChange={(e) => handleSpecificationChange(key as keyof Product['specifications'], e.target.value)}
            />
          </div>
        ))}
      </div>

      <Button onClick={() => onSave(editForm)}>
        Save Changes
      </Button>
    </div>
  );
};