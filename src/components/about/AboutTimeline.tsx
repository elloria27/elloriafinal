import { motion } from "framer-motion";

const timeline = [
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
];

export const AboutTimeline = () => {
  return (
    <section className="py-20">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Our Journey</h2>
          <p className="text-gray-600">Milestones that shaped who we are today</p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {timeline.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="flex gap-6 mb-12 relative"
            >
              <div className="w-32 flex-shrink-0 pt-1">
                <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {item.year}
                </span>
              </div>
              <div className="flex-grow bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};