import { motion } from "framer-motion";

const team = [
  {
    name: "Sarah Johnson",
    role: "Founder & CEO",
    quote: "Every woman deserves comfort and confidence, every day of the month.",
    image: "/lovable-uploads/42c0dc8a-d937-4255-9c12-d484082d26e6.png"
  },
  {
    name: "Dr. Emily Chen",
    role: "Head of Research",
    quote: "Innovation in feminine care starts with understanding women's needs.",
    image: "/lovable-uploads/3780f868-91c7-4512-bc4c-6af150baf90d.png"
  },
  {
    name: "Maria Rodriguez",
    role: "Sustainability Director",
    quote: "Creating products that care for both women and our planet.",
    image: "/lovable-uploads/bf47f5ff-e31b-4bdc-8ed0-5c0fc3d5f0d1.png"
  }
];

export const AboutTeam = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-accent-purple/10 to-accent-peach/10">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-gray-600">The passionate people behind our mission</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative mb-6 inline-block"
              >
                <div className="w-48 h-48 mx-auto rounded-full overflow-hidden shadow-xl">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
              <h3 className="text-2xl font-semibold mb-2">{member.name}</h3>
              <p className="text-primary mb-4">{member.role}</p>
              <p className="text-gray-600 italic">&quot;{member.quote}&quot;</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};