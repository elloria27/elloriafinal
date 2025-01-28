import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, Calendar, User, Share2 } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

interface BlogPost {
  id: string;
  title: string;
  content: any;
  featured_image: string | null;
  meta_description: string | null;
  created_at: string;
  author: {
    full_name: string | null;
    avatar_url?: string;
  };
}

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user: {
    full_name: string | null;
    avatar_url?: string;
  };
}

interface BlogSettings {
  enableComments: boolean;
  moderateComments: boolean;
}

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [settings, setSettings] = useState<BlogSettings>({ 
    enableComments: false,
    moderateComments: false
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const { data } = await supabase
        .from('site_settings')
        .select('custom_scripts')
        .single();
      
      if (data?.custom_scripts && 
          typeof data.custom_scripts === 'object' && 
          'blog' in data.custom_scripts && 
          typeof data.custom_scripts.blog === 'object' && 
          'enableComments' in data.custom_scripts.blog && 
          'moderateComments' in data.custom_scripts.blog) {
        setSettings({
          enableComments: Boolean(data.custom_scripts.blog.enableComments),
          moderateComments: Boolean(data.custom_scripts.blog.moderateComments)
        });
      }
    };

    const fetchPost = async () => {
      try {
        const { data: postData, error: postError } = await supabase
          .from('blog_posts')
          .select(`
            *,
            author:profiles(
              full_name,
              avatar_url
            )
          `)
          .eq('id', id)
          .single();

        if (postError) {
          console.error('Error fetching post:', postError);
          toast.error('Failed to load blog post');
          navigate('/blog');
          return;
        }

        const formattedPost: BlogPost = {
          ...postData,
          author: Array.isArray(postData.author) ? postData.author[0] : postData.author
        };

        setPost(formattedPost);

        // Increment view count
        await supabase.rpc('increment_post_view_count', { post_id: id });

        // Fetch comments if enabled
        if (settings.enableComments) {
          const { data: commentsData, error: commentsError } = await supabase
            .from('blog_comments')
            .select(`
              *,
              user:profiles(
                full_name,
                avatar_url
              )
            `)
            .eq('post_id', id)
            .order('created_at', { ascending: false });

          if (!commentsError && commentsData) {
            const formattedComments: Comment[] = commentsData.map(comment => ({
              ...comment,
              user: Array.isArray(comment.user) ? comment.user[0] : comment.user
            }));
            setComments(formattedComments);
          }
        }
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load blog post');
        navigate('/blog');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
    if (id) {
      fetchPost();
    }
  }, [id, navigate, settings.enableComments]);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: post?.title || "",
        text: post?.meta_description || "",
        url: window.location.href,
      });
    } catch (error) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      toast.error("Please login to comment");
      return;
    }

    const { error } = await supabase
      .from('blog_comments')
      .insert([
        {
          post_id: id,
          content: newComment,
          user_id: userData.user.id
        }
      ]);

    if (error) {
      toast.error("Failed to post comment");
      return;
    }

    setNewComment("");
    toast.success("Comment posted successfully");

    // Refresh comments
    const { data: commentsData } = await supabase
      .from('blog_comments')
      .select(`
        *,
        user:profiles(
          full_name,
          avatar_url
        )
      `)
      .eq('post_id', id)
      .order('created_at', { ascending: false });

    if (commentsData) {
      const formattedComments: Comment[] = commentsData.map(comment => ({
        ...comment,
        user: Array.isArray(comment.user) ? comment.user[0] : comment.user
      }));
      setComments(formattedComments);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-pulse">Loading post...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="py-20 text-center">
        <p>Post not found</p>
      </div>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="py-12 px-4"
    >
      <div className="container max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
            {post?.title}
          </h1>
          
          <div className="flex items-center justify-center space-x-6 text-gray-600 mb-8">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              <time>{new Date(post?.created_at || "").toLocaleDateString()}</time>
            </div>
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              <span>{post?.author?.full_name || 'Anonymous'}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            {post?.meta_description}
          </p>
        </div>

        {post?.featured_image && (
          <div className="mb-12 rounded-xl overflow-hidden shadow-2xl">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-[400px] object-cover"
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none">
          {typeof post?.content === 'string' 
            ? post.content 
            : JSON.stringify(post?.content)}
        </div>

        {settings.enableComments && (
          <div className="mt-16">
            <Separator className="my-8" />
            
            <div className="space-y-8">
              <h2 className="text-2xl font-bold flex items-center">
                <MessageSquare className="w-5 h-5 mr-2" />
                Comments
              </h2>

              <div className="space-y-4">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="min-h-[100px]"
                />
                <Button onClick={handleCommentSubmit}>Post Comment</Button>
              </div>

              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-4 bg-gray-50 p-4 rounded-lg">
                    <Avatar>
                      <AvatarImage src={comment.user?.avatar_url} />
                      <AvatarFallback>
                        {comment.user?.full_name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{comment.user?.full_name}</h4>
                        <time className="text-sm text-gray-500">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </time>
                      </div>
                      <p className="text-gray-600">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.article>
  );
};

export default BlogPost;