import { BlogHero } from "@/components/blog/BlogHero";
import { InstagramFeed } from "@/components/blog/InstagramFeed";
import { BlogPosts } from "@/components/blog/BlogPosts";
import { motion } from "framer-motion";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const Blog = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex-grow"
      >
        <BlogHero />
        <InstagramFeed />
        <BlogPosts />
      </motion.main>
      <Footer />
    </div>
  );
};

export default Blog;