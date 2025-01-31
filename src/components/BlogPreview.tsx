import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { BlogPreviewContent } from "@/types/content-blocks";

interface BlogPreviewProps {
  content?: BlogPreviewContent;
}

interface BlogPost {
  id: string;
  title: string;
  featured_image: string;
  categories?: string[];
}

export const BlogPreview = ({ content }: BlogPreviewProps) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log('Fetching blog posts...');
        const { data, error } = await supabase
          .from('blog_posts')
          .select('id, title, featured_image')
          .eq('status', 'published')
          .order('published_at', { ascending: false })
          .limit(3);

        if (error) throw error;

        if (data) {
          console.log('Raw blog posts data:', data);
          // Transform the data to include the full storage URL for featured images
          const postsWithFullImageUrls = data.map(post => ({
            ...post,
            featured_image: post.featured_image 
              ? `https://euexcsqvsbkxiwdieepu.supabase.co/storage/v1/object/public/files/blog/${post.featured_image}`
              : '/placeholder.svg'
          }));
          console.log('Posts with full image URLs:', postsWithFullImageUrls);
          setPosts(postsWithFullImageUrls);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
        toast.error("Failed to load blog posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'blog_posts' },
        () => {
          console.log('Blog posts updated, refreshing...');
          fetchPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <section className="py-32 bg-gradient-to-b from-white via-accent-purple/5 to-white">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {content?.title || "Latest from Our Blog"}
          </h2>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto">
            {content?.subtitle || "Stay updated with our latest articles and insights"}
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link to={`/blog/${post.id}`} className="group block">
                  <div className="relative mb-6 overflow-hidden rounded-2xl aspect-[4/3]">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-accent-purple/20 to-accent-peach/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <img
                      src={post.featured_image}
                      alt={post.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        console.error('Error loading image:', post.featured_image);
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                    {post.title}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-16"
        >
          <Button asChild size="lg" className="group">
            <Link to="/blog">
              {typeof content?.buttonText === 'string' ? content.buttonText : "View All Articles"}
              <ArrowRight className="ml-2 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};