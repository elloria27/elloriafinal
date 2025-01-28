import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const BlogCategories = () => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const { toast } = useToast();

  const handleCreateCategory = async () => {
    try {
      // Create a URL-friendly slug from the category name
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

      toast({
        title: "Success",
        description: "Category created successfully",
      });
      
      setOpen(false);
      setName("");
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        title: "Error",
        description: "Failed to create category",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Categories</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Category</DialogTitle>
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
              <Button onClick={handleCreateCategory} className="w-full">
                Create Category
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="rounded-md border">
        <div className="p-4">
          <p className="text-sm text-gray-500">No categories found. Create your first category!</p>
        </div>
      </div>
    </div>
  );
};