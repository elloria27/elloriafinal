import { motion } from "framer-motion";
import { AboutTimeline } from "./AboutTimeline";
import { AboutStoryContent } from "@/types/content-blocks";

interface AboutStoryProps {
  content?: AboutStoryContent;
}

export const AboutStory = ({ content = {} }: AboutStoryProps) => {
  console.log("AboutStory content:", content); // Додаємо лог для відстеження даних

  const {
    title = "Our Journey",
    subtitle = "Milestones that shaped who we are today",
    videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ",
    timeline = [
      {
        year: "2019",
        title: "Our Journey Begins",
        description: "Founded with a vision to revolutionize feminine care through innovation and understanding"
      },
      {
        year: "2020",
        title: "Eco Innovation",
        description: "Launched our first line of biodegradable products, setting new industry standards"
      },
      {
        year: "2021",
        title: "Global Impact",
        description: "Expanded to 50+ countries, touching lives of millions of women worldwide"
      },
      {
        year: "2022",
        title: "Sustainability Award",
        description: "Recognized globally for our commitment to environmental responsibility"
      },
      {
        year: "2023",
        title: "Community First",
        description: "Provided essential products to over 1 million women in underserved communities"
      }
    ]
  } = content;

  return (
    <section className="py-24 bg-white">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto text-center mb-24"
        >
          <h2 className="text-4xl font-bold mb-4">{title}</h2>
          <p className="text-gray-600 mb-12">{subtitle}</p>
          <div className="aspect-video w-full">
            <iframe
              className="w-full h-full rounded-3xl shadow-2xl"
              src={videoUrl}
              title="Our Journey Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </motion.div>
        <AboutTimeline timeline={Array.isArray(timeline) ? timeline : []} />
      </div>
    </section>
  );
};