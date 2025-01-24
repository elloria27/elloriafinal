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
          <img 
            src="/lovable-uploads/8ed49df6-713a-4e20-84ce-07e61732b507.png"
            alt="Elloria product packaging showing feminine care products"
            className="w-full rounded-3xl shadow-2xl"
          />
        </motion.div>
        <AboutTimeline />
      </div>
    </section>
  );
};