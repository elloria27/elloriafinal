import { motion } from "framer-motion";
import { Sparkles, Leaf, Heart } from "lucide-react";

const values = [
  {
    icon: <Sparkles className="w-6 h-6 text-primary" />,
    title: "Comfort First",
    description: "We believe every woman deserves to feel confident and comfortable, every day."
  },
  {
    icon: <Leaf className="w-6 h-6 text-primary" />,
    title: "Sustainable Care",
    description: "Creating products that care for both you and our planet."
  },
  {
    icon: <Heart className="w-6 h-6 text-primary" />,
    title: "Women's Health",
    description: "Committed to improving women's health through innovation and education."
  }
];

export const AboutValues = () => {
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
          <h2 className="text-4xl font-bold mb-4">Our Values</h2>
          <p className="text-gray-600">The principles that guide everything we do</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="w-12 h-12 bg-accent-purple/10 rounded-full flex items-center justify-center mb-6">
                {value.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-primary">
                {value.title}
              </h3>
              <p className="text-gray-600">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};