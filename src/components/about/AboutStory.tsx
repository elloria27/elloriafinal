import { motion } from "framer-motion";
import { AboutTimeline } from "./AboutTimeline";

export const AboutStory = () => {
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
          <h2 className="text-4xl font-bold mb-4">Our Journey</h2>
          <p className="text-gray-600 mb-12">Milestones that shaped who we are today</p>
          <div className="relative rounded-3xl overflow-hidden shadow-2xl">
            <div className="aspect-video h-[600px]">
              <iframe
                src="https://www.youtube.com/embed/f3EpenCD1wU"
                title="Elloria Story"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
        </motion.div>
        <AboutTimeline />
      </div>
    </section>
  );
};