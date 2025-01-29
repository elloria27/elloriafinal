import { motion } from "framer-motion";
import { AboutSustainabilityContent } from "@/types/content-blocks";

interface AboutSustainabilityProps {
  content?: AboutSustainabilityContent;
}

export const AboutSustainability = ({ content = {} }: AboutSustainabilityProps) => {
  const {
    title = "Our Commitment to Sustainability",
    description = "Making a positive impact on the environment...",
    stats = [],
    initiatives = []
  } = content;

  return (
    <section className="py-20">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h2 className="text-4xl font-bold">{title}</h2>
          <p className="text-xl text-gray-600">{description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h3 className="text-2xl font-semibold">{stat.value}</h3>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <h3 className="text-2xl font-semibold">Our Initiatives</h3>
            <ul className="list-disc pl-5">
              {initiatives.map((initiative, index) => (
                <li key={index}>{initiative.title}: {initiative.description}</li>
              ))}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
};