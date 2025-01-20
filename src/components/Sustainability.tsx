import { motion } from "framer-motion";
import { Leaf, Recycle, Percent, Package, Factory } from "lucide-react";

const stats = [
  {
    icon: <Recycle className="w-10 h-10" />,
    title: "55% Recyclable",
    description: "Materials used in our products",
    color: "bg-accent-green"
  },
  {
    icon: <Package className="w-10 h-10" />,
    title: "85% Reduction",
    description: "In packaging waste through innovative design",
    color: "bg-accent-purple"
  },
  {
    icon: <Factory className="w-10 h-10" />,
    title: "Eco-Production",
    description: "Sustainable sourcing and manufacturing",
    color: "bg-accent-peach"
  }
];

const timelineItems = [
  "Sustainable Material Sourcing",
  "Eco-Friendly Manufacturing",
  "Recyclable Packaging",
  "Low-Impact Delivery"
];

export const Sustainability = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-accent-green/10 to-white">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-green-600">
            Our Commitment to Sustainability
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            We're dedicated to reducing our environmental impact while delivering premium products through innovative, sustainable practices.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              className={`${stat.color}/10 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm`}
            >
              <motion.div 
                className="text-primary mb-6"
                whileHover={{ 
                  scale: 1.1,
                  filter: "brightness(1.2)",
                  transition: { duration: 0.2 }
                }}
              >
                {stat.icon}
              </motion.div>
              <h3 className="text-2xl font-bold mb-3">{stat.title}</h3>
              <p className="text-gray-600">{stat.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {timelineItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <span className="text-gray-700 font-medium">{item}</span>
                {index < timelineItems.length - 1 && (
                  <div className="hidden md:block w-12 h-0.5 bg-primary/20" />
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};