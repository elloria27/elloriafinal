import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Share2, Bookmark, MessageSquare, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BlogPost {
  id: string;
  title: string;
  content: any;
  excerpt: string | null;
  featured_image: string | null;
  created_at: string;
  author: {
    full_name: string;
    email: string;
  };
}

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!id) return;

        const { data, error } = await supabase
          .from('blog_posts')
          .select(`
            *,
            profiles (
              full_name,
              email
            )
          `)
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching post:', error);
          toast.error('Failed to load post');
          return;
        }

        console.log('Fetched post:', data);
        setPost({
          ...data,
          author: data.profiles
        });
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load post');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Post unliked' : 'Post liked');
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    toast.success(isSaved ? 'Post removed from bookmarks' : 'Post saved to bookmarks');
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      });
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  const handleComment = () => {
    if (!comment.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    // TODO: Implement comment submission
    toast.success('Comment added');
    setComment('');
  };

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return '/placeholder.svg';
    return `${supabase.storage.from('files').getPublicUrl(imagePath).data.publicUrl}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Post not found</p>
      </div>
    );
  }

  return (
    <article className="min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative h-[60vh] bg-cover bg-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${getImageUrl(post.featured_image)})` 
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              {post.title}
            </motion.h1>
            {post.excerpt && (
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-lg md:text-xl max-w-2xl mx-auto"
              >
                {post.excerpt}
              </motion.p>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Author Info */}
          <div className="flex items-center gap-4 mb-8 p-4 bg-gray-50 rounded-lg">
            <Avatar className="h-12 w-12">
              <AvatarFallback>
                <User className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-semibold">
                {post.author?.full_name || post.author?.email || 'Anonymous'}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(post.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* Interaction Buttons */}
          <div className="flex gap-4 mb-8">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLike}
              className={`gap-2 ${isLiked ? 'text-red-500' : ''}`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              Like
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="gap-2"
            >
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSave}
              className={`gap-2 ${isSaved ? 'text-primary' : ''}`}
            >
              <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
              {isSaved ? 'Saved' : 'Save'}
            </Button>
          </div>

          {/* Post Content */}
          <div className="prose prose-lg max-w-none mb-12">
            {typeof post.content === 'object' && post.content.blocks ? (
              post.content.blocks.map((block: any, index: number) => {
                switch (block.type) {
                  case 'header':
                    return <h2 key={index} className="text-2xl font-bold mb-4">{block.data.text}</h2>;
                  case 'paragraph':
                    return <p key={index} className="mb-4">{block.data.text}</p>;
                  case 'list':
                    return block.data.style === 'ordered' ? (
                      <ol key={index} className="list-decimal pl-6 mb-4">
                        {block.data.items.map((item: string, i: number) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ol>
                    ) : (
                      <ul key={index} className="list-disc pl-6 mb-4">
                        {block.data.items.map((item: string, i: number) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    );
                  default:
                    return null;
                }
              })
            ) : (
              <p>{JSON.stringify(post.content)}</p>
            )}
          </div>

          {/* Comments Section */}
          <div className="border-t pt-8">
            <h3 className="text-2xl font-bold mb-6">Comments</h3>
            
            {/* Comment Form */}
            <div className="mb-8">
              <Textarea
                placeholder="Share your thoughts..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mb-4"
              />
              <Button onClick={handleComment}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Add Comment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogPost;