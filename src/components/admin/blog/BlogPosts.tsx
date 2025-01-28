import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

export const BlogPosts = () => {
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentPost, setCurrentPost] = useState<any>(null);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      console.log('Fetching blog posts...');
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user?.id) {
        console.error('No user session found');
        return;
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .select('*, blog_categories(name)')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching posts:', error);
        throw error;
      }

      console.log('Posts fetched:', data);
      setPosts(data || []);
    } catch (error) {
      console.error('Error in fetchPosts:', error);
      toast.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      return filePath;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleCreatePost = async () => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user?.id) {
        toast.error("You must be logged in to create posts");
        return;
      }

      let featured_image = null;
      
      if (selectedImage) {
        featured_image = await handleImageUpload(selectedImage);
      }

      const { data, error } = await supabase
        .from('blog_posts')
        .insert([
          { 
            title,
            excerpt,
            featured_image,
            status: 'published', // Changed from 'draft' to 'published'
            content: {},
            author_id: session.session.user.id
          }
        ])
        .select();

      if (error) {
        console.error('Error creating post:', error);
        throw error;
      }

      console.log('Post created:', data);
      toast.success("Post created successfully");
      setOpen(false);
      setTitle("");
      setExcerpt("");
      setSelectedImage(null);
      fetchPosts();
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error("Failed to create post");
    }
  };

  const handleEditPost = async () => {
    try {
      if (!currentPost) return;

      let featured_image = currentPost.featured_image;
      
      if (selectedImage) {
        featured_image = await handleImageUpload(selectedImage);
      }

      const { error } = await supabase
        .from('blog_posts')
        .update({ 
          title,
          excerpt,
          featured_image,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentPost.id);

      if (error) throw error;

      toast.success("Post updated successfully");
      setOpen(false);
      setEditMode(false);
      setCurrentPost(null);
      setTitle("");
      setExcerpt("");
      setSelectedImage(null);
      fetchPosts();
    } catch (error) {
      console.error('Error updating post:', error);
      toast.error("Failed to update post");
    }
  };

  const handleDeletePost = async (postId: string) => {
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      toast.success("Post deleted successfully");
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error("Failed to delete post");
    }
  };

  const openEditDialog = (post: any) => {
    setCurrentPost(post);
    setTitle(post.title);
    setExcerpt(post.excerpt || '');
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
        <h3 className="text-lg font-semibold">Blog Posts</h3>
        <Dialog open={open} onOpenChange={(newOpen) => {
          if (!newOpen) {
            setEditMode(false);
            setCurrentPost(null);
            setTitle("");
            setExcerpt("");
            setSelectedImage(null);
          }
          setOpen(newOpen);
        }}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>{editMode ? 'Edit Post' : 'Create New Post'}</DialogTitle>
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
              <div className="space-y-2">
                <Label htmlFor="image">Featured Image</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
                />
              </div>
              <Button 
                onClick={editMode ? handleEditPost : handleCreatePost} 
                className="w-full"
              >
                {editMode ? 'Update Post' : 'Create Post'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid gap-4">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-500">No posts found. Create your first blog post!</p>
            </CardContent>
          </Card>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex items-start gap-4 p-4">
                  {post.featured_image && (
                    <img
                      src={`${supabase.storage.from('files').getPublicUrl(post.featured_image).data.publicUrl}`}
                      alt={post.title}
                      className="w-24 h-24 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{post.title}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {format(new Date(post.created_at), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => openEditDialog(post)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{post.excerpt}</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                        {post.status}
                      </span>
                    </div>
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