import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, MessageSquare, Calendar, Clock } from "lucide-react";

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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Post not found</h2>
        <Button onClick={() => navigate('/blog')} variant="outline">
          Return to Blog
        </Button>
      </div>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="py-10 md:py-16"
    >
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header Section */}
        <header className="mb-12 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent"
          >
            {post.title}
          </motion.h1>
          
          {post.meta_description && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 mb-8 text-lg max-w-2xl mx-auto"
            >
              {post.meta_description}
            </motion.p>
          )}

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center justify-center space-x-6 text-sm text-gray-500"
          >
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3 border-2 border-primary/10">
                <AvatarFallback className="bg-primary/5 text-primary">
                  {post.profiles?.full_name?.[0] || '?'}
                </AvatarFallback>
              </Avatar>
              <div className="text-left">
                <span className="block font-medium text-gray-900">{post.profiles?.full_name}</span>
                <span className="text-xs text-gray-500">Author</span>
              </div>
            </div>
            <div className="h-4 w-px bg-gray-200" />
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-primary" />
              <time className="text-gray-600">
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
          </motion.div>
        </header>

        {/* Featured Image */}
        {post.featured_image && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-12 rounded-xl overflow-hidden shadow-xl"
          >
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-[400px] object-cover"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          </motion.div>
        )}

        {/* Content */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="prose prose-lg max-w-none"
        >
          {typeof post.content === 'string' 
            ? post.content 
            : JSON.stringify(post.content)}
        </motion.div>

        {/* Comments Section */}
        {blogSettings.enableComments && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-16 pt-8 border-t border-gray-100"
          >
            <div className="flex items-center space-x-3 mb-8">
              <MessageSquare className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold text-gray-900">Comments</h2>
            </div>

            <div className="space-y-6 mb-8">
              {comments.map((comment) => (
                <motion.div 
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gray-50 rounded-lg p-6 shadow-sm"
                >
                  <div className="flex items-center mb-4">
                    <Avatar className="h-8 w-8 mr-3">
                      <AvatarFallback className="bg-primary/5 text-primary">
                        {comment.profiles?.full_name?.[0] || '?'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">{comment.profiles?.full_name}</p>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="h-3 w-3" />
                        <time>
                          {new Date(comment.created_at).toLocaleDateString()}
                        </time>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                </motion.div>
              ))}
            </div>

            <div className="space-y-4">
              <Textarea
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[120px] resize-none focus:ring-primary"
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
          </motion.div>
        )}
      </div>
    </motion.article>
  );
};

export default BlogPost;