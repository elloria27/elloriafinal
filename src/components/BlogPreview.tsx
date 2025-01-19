import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const articles = [
  {
    title: "Introducing Our Ultra-Thin Maxi Pads Collection",
    category: "Product Launch",
    image: "/lovable-uploads/3780f868-91c7-4512-bc4c-6af150baf90d.png"
  },
  {
    title: "The Perfect Pad for Your Daily Routine",
    category: "Lifestyle",
    image: "/lovable-uploads/724f13b7-0a36-4896-b19a-e51981befdd3.png"
  },
  {
    title: "Understanding Our Advanced Protection Technology",
    category: "Education",
    image: "/lovable-uploads/bf7261ba-df57-413d-b280-3b4b56528e73.png"
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
            Discover tips, guides, and insights about feminine hygiene and comfort
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
                  className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-300"
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