import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const BlogPosts = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const { toast } = useToast();

  const handleCreatePost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert([
          { 
            title,
            excerpt,
            status: 'draft',
            content: {}
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Post created successfully",
      });
      
      setOpen(false);
      setTitle("");
      setExcerpt("");
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Blog Posts</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter post title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Enter post excerpt"
                />
              </div>
              <Button onClick={handleCreatePost} className="w-full">
                Create Post
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="rounded-md border">
        <div className="p-4">
          <p className="text-sm text-gray-500">No posts found. Create your first blog post!</p>
        </div>
      </div>
    </div>
  );
};