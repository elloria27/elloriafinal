import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { Loader2, Pencil, Trash2 } from "lucide-react";

type EditFormType = Omit<Product, 'id' | 'created_at' | 'updated_at'>;

const DEFAULT_SPECIFICATIONS = {
  length: "",
  absorption: "",
  quantity: "",
  material: "",
  features: ""
};

export const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editForm, setEditForm] = useState<EditFormType>({
    name: "",
    description: "",
    price: 0,
    image: "",
    features: [],
    specifications: DEFAULT_SPECIFICATIONS,
  });

  const fetchProducts = async () => {
    try {
      console.log("Fetching products...");
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products");
        return;
      }

      // Transform the data to match our Product type
      const typedProducts: Product[] = data.map(product => ({
        ...product,
        specifications: product.specifications as Product['specifications']
      }));

      console.log("Products fetched successfully:", typedProducts);
      setProducts(typedProducts);
    } catch (error) {
      console.error("Error in fetchProducts:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    console.log("Editing product:", product);
    setSelectedProduct(product);
    setEditForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      features: product.features,
      specifications: product.specifications || DEFAULT_SPECIFICATIONS,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      console.log("Deleting product:", productId);
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

      if (error) {
        console.error("Error deleting product:", error);
        toast.error("Failed to delete product");
        return;
      }

      console.log("Product deleted successfully");
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      console.error("Error in handleDelete:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleSave = async () => {
    if (!selectedProduct) return;

    try {
      console.log("Saving product changes:", editForm);
      const { error } = await supabase
        .from("products")
        .update({
          name: editForm.name,
          description: editForm.description,
          price: editForm.price,
          image: editForm.image,
          features: editForm.features,
          specifications: editForm.specifications,
        })
        .eq("id", selectedProduct.id);

      if (error) {
        console.error("Error updating product:", error);
        toast.error("Failed to update product");
        return;
      }

      console.log("Product updated successfully");
      toast.success("Product updated successfully");
      setIsEditDialogOpen(false);
      fetchProducts();
    } catch (error) {
      console.error("Error in handleSave:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleAddFeature = () => {
    setEditForm(prev => ({
      ...prev,
      features: [...prev.features, ""]
    }));
  };

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

  const handleSpecificationChange = (key: keyof Product['specifications'], value: string) => {
    setEditForm(prev => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [key]: value
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // ... keep existing code (JSX for the component UI)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <Button onClick={() => handleEdit({
          id: "",
          name: "",
          description: "",
          image: "",
          price: 0,
          features: [],
          specifications: DEFAULT_SPECIFICATIONS,
          created_at: null,
          updated_at: null
        })}>Add New Product</Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-16 h-16 object-cover rounded"
                />
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>${product.price.toFixed(2)}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleEdit(product)}
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct?.id ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>

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
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
