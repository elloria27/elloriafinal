import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, MessageSquare, User } from "lucide-react";

interface BlogSettings {
  enableComments: boolean;
  moderateComments: boolean;
}

interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
}

interface BlogPost {
  id: string;
  title: string;
  content: string;
  featured_image: string | null;
  meta_description: string | null;
  created_at: string;
  profiles: Profile;
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  profiles: Profile;
}

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [blogSettings, setBlogSettings] = useState<BlogSettings>({
    enableComments: false,
    moderateComments: false,
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
        console.log('Fetching blog post and settings...');
        const { data: settings } = await supabase
          .from('site_settings')
          .select('custom_scripts')
          .single();

        if (settings?.custom_scripts) {
          const customScripts = settings.custom_scripts as Record<string, any>;
          if (customScripts.blog) {
            setBlogSettings({
              enableComments: Boolean(customScripts.blog.enableComments),
              moderateComments: Boolean(customScripts.blog.moderateComments),
            });
          }
        }

        const { data: postData, error: postError } = await supabase
          .from('blog_posts')
          .select(`
            *,
            profiles (
              id,
              full_name,
              email
            )
          `)
          .eq('id', id)
          .single();

        if (postError) throw postError;

        const { data: commentsData, error: commentsError } = await supabase
          .from('blog_comments')
          .select(`
            *,
            profiles (
              id,
              full_name,
              email
            )
          `)
          .eq('post_id', id)
          .order('created_at', { ascending: false });

        if (commentsError) throw commentsError;

        console.log('Fetched post:', postData);
        console.log('Fetched comments:', commentsData);

        if (postData) {
          setPost(postData as BlogPost);
        }

        if (commentsData) {
          setComments(commentsData as Comment[]);
        }

      } catch (error) {
        console.error('Error:', error);
        toast.error("Failed to load blog post");
        navigate('/blog');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id, navigate]);

  const handleCommentSubmit = async () => {
    const session = await supabase.auth.getSession();
    if (!session.data.session) {
      toast.error("Please sign in to comment");
      return;
    }

    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('blog_comments')
        .insert({
          post_id: id,
          content: newComment,
          user_id: session.data.session.user.id
        });

      if (error) throw error;

      toast.success("Comment added successfully");
      setNewComment("");

      // Refresh comments
      const { data: freshComments, error: commentsError } = await supabase
        .from('blog_comments')
        .select(`
          *,
          profiles (
            id,
            full_name,
            email
          )
        `)
        .eq('post_id', id)
        .order('created_at', { ascending: false });

      if (commentsError) throw commentsError;

      if (freshComments) {
        setComments(freshComments as Comment[]);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-semibold mb-4">Post not found</h2>
        <Button onClick={() => navigate('/blog')}>Return to Blog</Button>
      </div>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="py-10 md:py-20"
    >
      <div className="container px-4 max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            {post.title}
          </h1>
          <p className="text-gray-600 mb-4 text-lg">{post.meta_description}</p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={post.profiles?.avatar_url} />
                <AvatarFallback>{post.profiles?.full_name?.[0]}</AvatarFallback>
              </Avatar>
              <span>{post.profiles?.full_name}</span>
            </div>
            <span>•</span>
            <time>{new Date(post.created_at).toLocaleDateString()}</time>
          </div>
        </div>

        {post.featured_image && (
          <div className="mb-12 rounded-xl overflow-hidden shadow-2xl">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-auto object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none">
          {typeof post.content === 'string' 
            ? post.content 
            : JSON.stringify(post.content)}
        </div>

        {blogSettings.enableComments && (
          <div className="mt-16">
            <div className="flex items-center space-x-2 mb-8">
              <MessageSquare className="h-6 w-6" />
              <h2 className="text-2xl font-semibold">Comments</h2>
            </div>

            <div className="space-y-6 mb-8">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage src={comment.profiles?.avatar_url} />
                      <AvatarFallback>{comment.profiles?.full_name?.[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{comment.profiles?.full_name}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <Textarea
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[100px]"
              />
              <Button 
                onClick={handleCommentSubmit}
                disabled={isSubmitting}
                className="w-full md:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Posting...
                  </>
                ) : (
                  'Post Comment'
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </motion.article>
  );
};

export default BlogPost;
