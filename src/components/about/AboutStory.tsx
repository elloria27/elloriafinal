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
          <h2 className="text-4xl font-bold mb-6">Our Story</h2>
          <p className="text-xl text-gray-600">
            Founded with a vision to revolutionize feminine care through sustainable 
            innovation, Elloria began its journey to create products that care for 
            both women and our planet.
          </p>
        </motion.div>
        <AboutTimeline />
      </div>
    </section>
  );
};