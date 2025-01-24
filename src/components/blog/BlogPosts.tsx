import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const blogPosts = [
  {
    id: 1,
    title: "The Future of Sustainable Feminine Care",
    description: "Discover how Elloria is revolutionizing the industry with eco-friendly innovations.",
    image: "/lovable-uploads/3780f868-91c7-4512-bc4c-6af150baf90d.png",
    category: "Sustainability"
  },
  {
    id: 2,
    title: "Understanding Your Cycle: A Complete Guide",
    description: "Expert insights and tips for managing your menstrual cycle naturally.",
    image: "/lovable-uploads/724f13b7-0a36-4896-b19a-e51981befdd3.png",
    category: "Health"
  },
  {
    id: 3,
    title: "Women Empowerment Through Innovation",
    description: "How Elloria's products are designed to support modern women's lifestyles.",
    image: "/lovable-uploads/bf7261ba-df57-413d-b280-3b4b56528e73.png",
    category: "Innovation"
  }
];

export const BlogPosts = () => {
  const [visiblePosts, setVisiblePosts] = useState(blogPosts);

  useEffect(() => {
    const handleScroll = () => {
      if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 100) {
        // In a real implementation, this would fetch more posts from an API
        console.log("Would load more posts here");
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
          {visiblePosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-xl mb-4 aspect-video">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm">
                  {post.category}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {post.description}
              </p>
              <Button
                variant="ghost"
                className="text-primary hover:text-primary/90 hover:bg-primary/10 p-0 h-auto"
              >
                Read More <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};