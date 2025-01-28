import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, User, Heart, Share2, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Profile {
  full_name: string | null;
  email: string | null;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string | null;
  featured_image: string | null;
  slug: string | null;
  status: 'draft' | 'published';
  created_at: string;
  profiles: Profile;
  content: any;
}

export const BlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log('Fetching blog posts...');
        const { data, error } = await supabase
          .from('blog_posts')
          .select(`
            *,
            profiles (
              full_name,
              email
            )
          `)
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching posts:', error);
          toast.error('Failed to load blog posts');
          return;
        }

        console.log('Fetched posts:', data);
        setPosts(data as BlogPost[]);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load blog posts');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleReadMore = async (postId: string) => {
    try {
      await supabase.rpc('increment_post_view_count', { post_id: postId });
      navigate(`/blog/${postId}`);
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  };

  const getImageUrl = (imagePath: string | null) => {
    if (!imagePath) return '/placeholder.svg';
    return `${supabase.storage.from('files').getPublicUrl(imagePath).data.publicUrl}`;
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <div className="animate-pulse">Loading posts...</div>
      </div>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Latest Articles
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Dive deep into topics about feminine care, sustainability, and women's health
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="relative overflow-hidden rounded-t-xl aspect-[16/9]">
                <img
                  src={getImageUrl(post.featured_image)}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/placeholder.svg';
                  }}
                />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm text-gray-600">
                    {post.profiles?.full_name || post.profiles?.email || 'Anonymous'}
                  </div>
                  <span className="text-gray-400">•</span>
                  <time className="text-sm text-gray-600">
                    {new Date(post.created_at).toLocaleDateString()}
                  </time>
                </div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt || 'Click to read more about this topic...'}
                </p>
                <Button
                  variant="ghost"
                  className="text-primary hover:text-primary/90 hover:bg-primary/10 p-0 h-auto"
                  onClick={() => handleReadMore(post.id)}
                >
                  Read More <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};