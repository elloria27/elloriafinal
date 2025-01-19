import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const articles = [
  {
    title: "The Ultimate Guide to Sustainable Period Care",
    category: "Education",
    image: "/lovable-uploads/blog1.jpg"
  },
  {
    title: "How to Choose the Right Pad Size",
    category: "Product Guide",
    image: "/lovable-uploads/blog2.jpg"
  },
  {
    title: "Our Journey to Eco-Friendly Production",
    category: "Sustainability",
    image: "/lovable-uploads/blog3.jpg"
  }
];

export const BlogPreview = () => {
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
            Latest Articles
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover tips, guides, and insights about feminine hygiene and sustainability
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
                  src={article.image}
                  alt={article.title}
                  className="w-full h-48 object-cover transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm">
                  {article.category}
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {article.title}
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
          <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
            View All Articles
          </Button>
        </motion.div>
      </div>
    </section>
  );
};