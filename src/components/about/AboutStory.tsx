import { motion } from "framer-motion";
import { AboutTimeline } from "./AboutTimeline";

export const AboutStory = () => {
  return (
    <section className="py-24 bg-gray-200">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-6xl mx-auto text-center mb-24"
        >
          <h2 className="text-6xl font-bold mb-8">Our Story</h2>
          <p className="text-gray-600 text-2xl mb-12 max-w-4xl mx-auto">
            Founded with a vision to revolutionize feminine care through sustainable innovation, Elloria began its journey to create products that care for both women and our planet.
          </p>
        </motion.div>
        <AboutTimeline />
      </div>
    </section>
  );
};