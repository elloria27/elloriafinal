import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { Loader2 } from "lucide-react";
import { ProductForm } from "./product/ProductForm";
import { ProductList } from "./product/ProductList";
import { parseProduct } from "@/utils/supabase-helpers";

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

      console.log("Products fetched successfully:", data);
      setProducts(data.map(parseProduct));
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

  const handleSave = async (editForm: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    if (!selectedProduct?.id) {
      try {
        const { error } = await supabase
          .from("products")
          .insert([editForm]);

        if (error) throw error;
        
        toast.success("Product created successfully");
        setIsEditDialogOpen(false);
        fetchProducts();
      } catch (error) {
        console.error("Error creating product:", error);
        toast.error("Failed to create product");
      }
      return;
    }

    try {
      console.log("Saving product changes:", editForm);
      const { error } = await supabase
        .from("products")
        .update(editForm)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <Button onClick={() => {
          setSelectedProduct(null);
          setIsEditDialogOpen(true);
        }}>
          Add New Product
        </Button>
      </div>

      <ProductList 
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct?.id ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>

          <ProductForm 
            product={selectedProduct}
            onSave={handleSave}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};