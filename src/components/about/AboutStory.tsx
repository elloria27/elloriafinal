import { motion } from "framer-motion";
import { AboutStoryContent } from "@/types/content-blocks";

interface AboutStoryProps {
  content?: AboutStoryContent;
}

export const AboutStory = ({ content = {} }: AboutStoryProps) => {
  const {
    title = "Our Story",
    subtitle = "A Journey of Innovation",
    content: storyContent = "Founded with a vision to revolutionize feminine care through sustainable innovation...",
    image = "/placeholder.svg"
  } = content;

  return (
    <section className="py-20">
      <div className="container px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-bold leading-tight">{title}</h2>
            <p className="text-xl text-gray-600">{subtitle}</p>
            <p className="text-lg text-gray-500">{storyContent}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gray-100"
          >
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
