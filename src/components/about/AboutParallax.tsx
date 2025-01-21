import { motion } from "framer-motion";
import { UserRound, Heart, Leaf } from "lucide-react";

const parallaxSections = [
  {
    title: "Comfort First",
    description: "We believe that comfort should never be compromised. Our products are designed with your wellbeing in mind.",
    icon: UserRound,
    bgColor: "from-accent-purple/20 to-accent-peach/20",
    iconColor: "text-primary"
  },
  {
    title: "Quality Care",
    description: "Every product is crafted with premium materials and rigorous testing to ensure the highest standards of quality.",
    icon: Heart,
    bgColor: "from-accent-peach/20 to-accent-purple/20",
    iconColor: "text-secondary"
  },
  {
    title: "Eco-Friendly",
    description: "Our commitment to sustainability means creating products that care for both you and the environment.",
    icon: Leaf,
    bgColor: "from-accent-purple/20 to-accent-green/20",
    iconColor: "text-primary"
  }
];

export const AboutParallax = () => {
  return (
    <div className="w-full">
      {parallaxSections.map((section, index) => (
        <div
          key={section.title}
          className="min-h-[400px] relative flex items-center"
          style={{ backgroundAttachment: 'fixed' }}
        >
          <div className={`absolute inset-0 bg-gradient-to-r ${section.bgColor}`} />
          <div className="relative w-full py-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="container px-4 mx-auto"
            >
              <div className={`flex flex-col ${index % 2 === 0 ? 'items-start' : 'items-end'} max-w-2xl ${index % 2 === 0 ? 'ml-0 mr-auto' : 'mr-0 ml-auto'}`}>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`mb-6 p-4 rounded-full ${section.iconColor} bg-white shadow-lg`}
                >
                  <section.icon size={40} />
                </motion.div>
                <h2 className="text-3xl font-bold mb-4">{section.title}</h2>
                <p className="text-lg text-gray-600">{section.description}</p>
              </div>
            </motion.div>
          </div>
        </div>
      ))}
    </div>
  );
};