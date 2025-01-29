import { motion } from "framer-motion";
import { AboutTeamContent } from "@/types/content-blocks";

interface AboutTeamProps {
  content?: AboutTeamContent;
}

export const AboutTeam = ({ content = {} }: AboutTeamProps) => {
  const {
    title = "Our Team",
    subtitle = "Meet the passionate individuals behind Elloria",
    members = []
  } = content;

  return (
    <section className="py-20">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold mb-4">{title}</h2>
          <p className="text-xl text-gray-600 mb-12">{subtitle}</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-lg p-6 text-center"
            >
              <img
                src={member.image || "/placeholder.svg"}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-gray-500">{member.role}</p>
              <p className="mt-2">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
