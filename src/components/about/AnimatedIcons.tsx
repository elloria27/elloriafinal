import { motion } from "framer-motion";
import { UserRound, Users, PersonStanding } from "lucide-react";

const icons = [
  {
    Icon: UserRound,
    delay: 0,
    color: "text-primary"
  },
  {
    Icon: Users,
    delay: 0.2,
    color: "text-secondary"
  },
  {
    Icon: PersonStanding,
    delay: 0.4,
    color: "text-primary"
  }
];

export const AnimatedIcons = () => {
  return (
    <div className="py-16 bg-gradient-to-r from-accent-purple/10 to-accent-peach/10">
      <div className="container px-4 mx-auto">
        <div className="flex justify-center gap-12 md:gap-24">
          {icons.map(({ Icon, delay, color }, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.2, rotate: 360 }}
                transition={{ duration: 0.8, type: "spring" }}
                className={`${color} bg-white p-6 rounded-full shadow-lg mb-4 inline-block`}
              >
                <Icon size={40} />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};