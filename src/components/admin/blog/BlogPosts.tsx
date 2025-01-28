import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash, Eye } from "lucide-react";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Database } from "@/integrations/supabase/types";

type PostStatus = Database["public"]["Enums"]["post_status"];

export const BlogPosts = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [editingPost, setEditingPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [postStatus, setPostStatus] = useState<PostStatus>("draft");
  const navigate = useNavigate();

  const editor = useEditor({
    extensions: [
      StarterKit,
    ],
    content: content,
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  const fetchPosts = async () => {
    try {
      const { data: posts, error } = await supabase
        .from("blog_posts")
        .select("*, profiles(full_name, email)")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPosts(posts || []);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to fetch posts");
    }
  };

  const fetchComments = async () => {
    try {
      const { data: comments, error } = await supabase
        .from("blog_comments")
        .select(`
          *,
          profiles:profiles(full_name)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComments(comments || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error("Failed to fetch comments");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async (file: File) => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `blog/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("files")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      return filePath;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Get current user's profile
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user found");

      let imagePath = editingPost?.featured_image || null;

      if (selectedImage) {
        imagePath = await uploadImage(selectedImage);
      }

      const postData = {
        title,
        content,
        excerpt,
        featured_image: imagePath,
        status: postStatus as PostStatus,
        author_id: user.id, // Set the author_id to the current user's ID
      };

      if (editingPost) {
        const { error } = await supabase
          .from("blog_posts")
          .update(postData)
          .eq("id", editingPost.id);

        if (error) throw error;
        toast.success("Post updated successfully");
      } else {
        const { error } = await supabase
          .from("blog_posts")
          .insert([postData]);

        if (error) throw error;
        toast.success("Post created successfully");
      }

      setTitle("");
      setContent("");
      setExcerpt("");
      setSelectedImage(null);
      setImagePreview("");
      setEditingPost(null);
      setPostStatus("draft");
      setDialogOpen(false);
      fetchPosts();
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error("Failed to save post");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
    setTitle(post.title);
    setContent(post.content || "");
    setExcerpt(post.excerpt || "");
    setPostStatus(post.status as PostStatus);
    if (post.featured_image) {
      setImagePreview(
        `${supabase.storage.from("files").getPublicUrl(post.featured_image).data.publicUrl}`
      );
    }
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const { error } = await supabase.from("blog_posts").delete().eq("id", id);
      if (error) throw error;
      toast.success("Post deleted successfully");
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;

    try {
      const { error } = await supabase
        .from("blog_comments")
        .delete()
        .eq("id", commentId);
      
      if (error) throw error;
      toast.success("Comment deleted successfully");
      fetchComments();
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.error("Failed to delete comment");
    }
  };

  const handleView = (post: any) => {
    navigate(`/blog/${post.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-x-2">
          <Button 
            variant={!showComments ? "default" : "outline"}
            onClick={() => setShowComments(false)}
          >
            Posts
          </Button>
          <Button 
            variant={showComments ? "default" : "outline"}
            onClick={() => {
              setShowComments(true);
              fetchComments();
            }}
          >
            Comments
          </Button>
        </div>
        {!showComments && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingPost ? "Edit Post" : "Create New Post"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Content</label>
                  <div className="min-h-[200px] border rounded-md p-4">
                    <EditorContent editor={editor} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Excerpt</label>
                  <Textarea
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Status</label>
                  <Select
                    value={postStatus}
                    onValueChange={(value: PostStatus) => setPostStatus(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Featured Image
                  </label>
                  <Input type="file" onChange={handleImageChange} accept="image/*" />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="mt-2 max-h-40 object-cover rounded"
                    />
                  )}
                </div>

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? "Saving..." : "Save Post"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="grid gap-4">
        {!showComments ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
            >
              <div>
                <h3 className="font-medium">{post.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {post.status}
                  </span>
                  <span>by {post.profiles?.full_name || post.profiles?.email || 'Anonymous'}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleView(post)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(post)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(post.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
            >
              <div>
                <h3 className="font-medium">{comment.profiles?.full_name || 'Anonymous'}</h3>
                <p className="text-sm text-gray-600">{comment.content}</p>
                <p className="text-xs text-gray-500">
                  {new Date(comment.created_at).toLocaleDateString()}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteComment(comment.id)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};