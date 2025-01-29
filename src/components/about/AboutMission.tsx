import { motion } from "framer-motion";
import { AboutMissionContent } from "@/types/content-blocks";

interface AboutMissionProps {
  content?: AboutMissionContent;
}

export const AboutMission = ({ content = {} }: AboutMissionProps) => {
  const {
    title = "Our Mission",
    description = "We're on a mission to transform feminine care...",
    values = []
  } = content;

  return (
    <section className="py-20 bg-gradient-to-b from-white to-accent-purple/10">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">{title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{description}</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="p-8 rounded-2xl hover:shadow-xl transition-all duration-300 bg-white"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="text-primary mb-6"
              >
                {value.icon}
              </motion.div>
              <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};