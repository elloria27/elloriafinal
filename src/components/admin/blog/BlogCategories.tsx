import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

export const BlogCategories = () => {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<any>(null);
  const [name, setName] = useState("");
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories...');
      const { data, error } = await supabase
        .from('blog_categories')
        .select('*')
        .order('name');

      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }

      console.log('Categories fetched:', data);
      setCategories(data || []);
    } catch (error) {
      console.error('Error in fetchCategories:', error);
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCategory = async () => {
    try {
      const slug = name.toLowerCase().replace(/\s+/g, '-');
      
      const { data, error } = await supabase
        .from('blog_categories')
        .insert([
          { 
            name,
            slug
          }
        ]);

      if (error) throw error;

      toast.success("Category created successfully");
      setOpen(false);
      setName("");
      fetchCategories();
    } catch (error) {
      console.error('Error creating category:', error);
      toast.error("Failed to create category");
    }
  };

  const handleEditCategory = async () => {
    try {
      if (!currentCategory) return;

      const slug = name.toLowerCase().replace(/\s+/g, '-');
      
      const { error } = await supabase
        .from('blog_categories')
        .update({ 
          name,
          slug,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentCategory.id);

      if (error) throw error;

      toast.success("Category updated successfully");
      setOpen(false);
      setEditMode(false);
      setCurrentCategory(null);
      setName("");
      fetchCategories();
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error("Failed to update category");
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const { error } = await supabase
        .from('blog_categories')
        .delete()
        .eq('id', categoryId);

      if (error) throw error;

      toast.success("Category deleted successfully");
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error("Failed to delete category");
    }
  };

  const openEditDialog = (category: any) => {
    setCurrentCategory(category);
    setName(category.name);
    setEditMode(true);
    setOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Categories</h3>
        <Dialog open={open} onOpenChange={(newOpen) => {
          if (!newOpen) {
            setEditMode(false);
            setCurrentCategory(null);
            setName("");
          }
          setOpen(newOpen);
        }}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editMode ? 'Edit Category' : 'Create New Category'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter category name"
                />
              </div>
              <Button 
                onClick={editMode ? handleEditCategory : handleCreateCategory}
                className="w-full"
              >
                {editMode ? 'Update Category' : 'Create Category'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid gap-4">
        {categories.length === 0 ? (
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">No categories found. Create your first category!</p>
            </CardContent>
          </Card>
        ) : (
          categories.map((category) => (
            <Card key={category.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-semibold">{category.name}</h4>
                    <p className="text-sm text-gray-500">/{category.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => openEditDialog(category)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};