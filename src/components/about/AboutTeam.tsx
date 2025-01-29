import { motion } from "framer-motion";
import { AboutTeamContent } from "@/types/content-blocks";

interface AboutTeamProps {
  content?: AboutTeamContent;
}

export const AboutTeam = ({ content = {} }: AboutTeamProps) => {
  const team = [
    {
      name: "Sarah Johnson",
      role: "Founder & CEO",
      image: "/lovable-uploads/92b56d83-b4f6-4892-b905-916e19f87e4a.png",
      quote: "Every woman deserves comfort and confidence, every day of the month."
    },
    {
      name: "Dr. Emily Chen",
      role: "Head of Research",
      image: "/lovable-uploads/92b56d83-b4f6-4892-b905-916e19f87e4a.png",
      quote: "Innovation in feminine care starts with understanding women's needs."
    },
    {
      name: "Maria Rodriguez",
      role: "Sustainability Director",
      image: "/lovable-uploads/92b56d83-b4f6-4892-b905-916e19f87e4a.png",
      quote: "Creating products that care for both women and our planet."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-xl text-gray-600">The passionate people behind our mission</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="text-center"
            >
              <div className="mb-6">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-48 h-48 rounded-full mx-auto object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold mb-2">{member.name}</h3>
              <p className="text-primary mb-4">{member.role}</p>
              <p className="text-gray-600 italic">"{member.quote}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};