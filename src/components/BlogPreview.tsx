import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BlogPreviewContent } from "@/types/content-blocks";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

interface BlogPreviewProps {
  content?: BlogPreviewContent;
}

interface BlogPost {
  id: string;
  title: string;
  category: string;
  featured_image: string;
}

export const BlogPreview = ({ content }: BlogPreviewProps) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        console.log("Fetching latest blog posts...");
        const { data, error } = await supabase
          .from("blog_posts")
          .select("id, title, featured_image")
          .eq("status", "published")
          .order("created_at", { ascending: false })
          .limit(3);

        if (error) {
          console.error("Error fetching posts:", error);
          return;
        }

        console.log("Fetched posts:", data);
        setPosts(data || []);
      } catch (error) {
        console.error("Error in fetchLatestPosts:", error);
      }
    };

    fetchLatestPosts();

    // Subscribe to changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'blog_posts' },
        () => {
          console.log('Blog posts updated, refreshing...');
          fetchLatestPosts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleViewAllClick = () => {
    navigate("/blog");
  };

  return (
    <section className="py-20 bg-white">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {content?.title || "Latest Articles"}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {content?.subtitle || "Discover tips, guides, and insights about feminine hygiene and comfort"}
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group cursor-pointer"
              onClick={() => navigate(`/blog/${post.id}`)}
            >
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img
                  src={post.featured_image}
                  alt={post.title}
                  className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button 
            size="lg" 
            variant="outline" 
            className="border-primary text-primary hover:bg-primary/10"
            onClick={handleViewAllClick}
          >
            {content?.viewAllButtonText || "View All Articles"}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};