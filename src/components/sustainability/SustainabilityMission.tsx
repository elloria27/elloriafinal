import { motion } from "framer-motion";
import { SustainabilityContent } from "@/types/content-blocks";
import { Leaf, PackageCheck, Globe } from "lucide-react";

interface SustainabilityMissionProps {
  content: SustainabilityContent;
}

export const SustainabilityMission = ({ content }: SustainabilityMissionProps) => {
  return (
    <section className="py-16 bg-white">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {content.title}
          </h2>
          <p className="text-lg text-gray-600">
            {content.description}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {content.stats?.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="p-6 rounded-xl bg-white shadow-lg"
            >
              <div className="text-primary mb-4">
                {stat.icon === 'Leaf' && <Leaf className="w-10 h-10" />}
                {stat.icon === 'PackageCheck' && <PackageCheck className="w-10 h-10" />}
                {stat.icon === 'Globe' && <Globe className="w-10 h-10" />}
              </div>
              <h3 className="text-2xl font-bold mb-2">{stat.value}</h3>
              <p className="text-gray-600">{stat.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};