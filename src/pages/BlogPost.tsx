import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, MessageSquare, Calendar, Clock, User, Heart, Share2, Bookmark } from "lucide-react";

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
  view_count: number;
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
    enableComments: true,
    moderateComments: false,
  });

  useEffect(() => {
    const fetchPost = async () => {
      try {
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
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[70vh] overflow-hidden"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: `url(${post.featured_image || '/placeholder.svg'})`,
            backgroundAttachment: 'fixed'
          }}
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container px-4 text-center text-white">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold mb-6 max-w-4xl mx-auto"
            >
              {post.title}
            </motion.h1>
            {post.meta_description && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto"
              >
                {post.meta_description}
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="container px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Author and Meta Info */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap items-center justify-between mb-8 pb-8 border-b"
          >
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12 border-2 border-primary/10">
                <AvatarFallback className="bg-primary/5">
                  <User className="h-6 w-6 text-primary" />
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold text-gray-900">
                  {post.profiles?.full_name || post.profiles?.email || 'Anonymous'}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-1" />
                  <time>
                    {new Date(post.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <Button variant="ghost" size="sm" className="text-gray-600">
                <Heart className="h-4 w-4 mr-2" />
                <span>Like</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600">
                <Share2 className="h-4 w-4 mr-2" />
                <span>Share</span>
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600">
                <Bookmark className="h-4 w-4 mr-2" />
                <span>Save</span>
              </Button>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Comments Section */}
          {blogSettings.enableComments && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-16 pt-8 border-t"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">
                    Comments ({comments.length})
                  </h2>
                </div>
              </div>

              {/* Comment Form */}
              <div className="mb-8">
                <Textarea
                  placeholder="Share your thoughts..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[120px] resize-none focus:ring-primary mb-4"
                />
                <Button
                  onClick={handleCommentSubmit}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto"
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

              {/* Comments List */}
              <div className="space-y-6">
                {comments.map((comment) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 rounded-xl p-6"
                  >
                    <div className="flex items-center mb-4">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarFallback>
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-900">
                          {comment.profiles?.full_name || comment.profiles?.email || 'Anonymous'}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
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
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogPost;