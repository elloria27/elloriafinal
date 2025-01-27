import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { BlogPreviewContent } from "@/types/content-blocks";

interface BlogPreviewProps {
  content?: BlogPreviewContent;
}

export const BlogPreview = ({ content }: BlogPreviewProps) => {
  const articles = content?.articles || [];

  const handleButtonClick = () => {
    if (content?.buttonUrl) {
      window.location.href = String(content.buttonUrl);
    }
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
            {String(content?.title || "Latest Articles")}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {String(content?.subtitle || "Discover tips, guides, and insights about feminine hygiene and comfort")}
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden rounded-lg mb-4">
                <img
                  src={String(article.image)}
                  alt={String(article.title)}
                  className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm">
                  {String(article.category)}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {String(article.title)}
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
            onClick={handleButtonClick}
          >
            {String(content?.buttonText || "View All Articles")}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};