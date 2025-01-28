import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BlogPost {
  id: string;
  title: string;
  content: any;
  featured_image: string;
  meta_description: string;
  created_at: string;
}

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching post:', error);
          toast.error('Failed to load blog post');
          navigate('/blog');
          return;
        }

        setPost(data);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load blog post');
        navigate('/blog');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id, navigate]);

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
      className="py-20"
    >
      <div className="container px-4 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
          <p className="text-gray-600 mb-4">{post.meta_description}</p>
          <time className="text-sm text-gray-500">
            {new Date(post.created_at).toLocaleDateString()}
          </time>
        </div>

        {post.featured_image && (
          <div className="mb-8 rounded-xl overflow-hidden">
            <img
              src={post.featured_image}
              alt={post.title}
              className="w-full h-auto"
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none">
          {typeof post.content === 'string' 
            ? post.content 
            : JSON.stringify(post.content)}
        </div>
      </div>
    </motion.article>
  );
};

export default BlogPost;