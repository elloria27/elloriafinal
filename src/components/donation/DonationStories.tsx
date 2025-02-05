import { motion } from "framer-motion";
import { DonationStoriesProps } from "@/types/content-blocks";

export const DonationStories = ({ content }: DonationStoriesProps) => {
  const stories = content.stories || [
    {
      title: "Community Impact",
      description: "The support from our program has transformed lives in our community. Women now have access to essential products they desperately needed.",
      image: "/placeholder.svg",
      author: "Sarah Johnson",
      date: "Community Leader"
    },
    {
      title: "Educational Opportunity",
      description: "Thanks to these donations, I can focus on my education without worry. It's more than products - it's dignity and opportunity.",
      image: "/placeholder.svg",
      author: "Maria Rodriguez",
      date: "Program Beneficiary"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {content.title || "Stories of Impact"}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {content.description || "Real stories from women whose lives have been touched by your generosity."}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {stories.map((story, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white p-6 rounded-lg shadow-lg"
            >
              <div className="flex flex-col items-center">
                {story.image && (
                  <img
                    src={story.image}
                    alt={story.title}
                    className="w-20 h-20 rounded-full object-cover mb-4"
                  />
                )}
                <h3 className="text-xl font-semibold mb-3">{story.title}</h3>
                <blockquote className="text-gray-600 italic mb-4">
                  {story.description}
                </blockquote>
                {story.author && (
                  <cite className="not-italic font-semibold text-gray-900">
                    {story.author}
                  </cite>
                )}
                {story.date && (
                  <p className="text-sm text-gray-500">{story.date}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};