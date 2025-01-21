import { motion } from "framer-motion";
import { AboutTimeline } from "./AboutTimeline";

export const AboutStory = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <div className="aspect-w-16 aspect-h-9 mb-12">
            <iframe
              src="https://www.youtube.com/embed/f3EpenCD1wU"
              title="Elloria Story"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-2xl shadow-xl w-full h-full"
            />
          </div>
        </motion.div>
        <AboutTimeline />
      </div>
    </section>
  );
};