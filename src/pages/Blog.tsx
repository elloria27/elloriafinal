
import { BlogHero } from "@/components/blog/BlogHero";
import { InstagramFeed } from "@/components/blog/InstagramFeed";
import { BlogPosts } from "@/components/blog/BlogPosts";
import { motion } from "framer-motion";

const Blog = () => {
  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen"
    >
      <BlogHero />
      <InstagramFeed />
      <BlogPosts />
    </motion.main>
  );
};

export default Blog;
