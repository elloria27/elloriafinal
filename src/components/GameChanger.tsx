import { motion } from "framer-motion";
import { Droplets, Leaf, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: <Droplets className="w-12 h-12" />,
    title: "Superior Absorption",
    description: "Up to 600ml absorption capacity for overnight protection",
    detail: "Advanced multi-layer core technology ensures quick absorption and complete leak protection"
  },
  {
    icon: <Leaf className="w-12 h-12" />,
    title: "Eco-Friendly Materials",
    description: "72% recyclable materials for a greener planet",
    detail: "Sustainable sourcing and biodegradable components reduce environmental impact"
  },
  {
    icon: <Heart className="w-12 h-12" />,
    title: "Ultimate Comfort",
    description: "Soft, breathable backsheet for irritation-free comfort",
    detail: "Dermatologically tested materials ensure gentle care for sensitive skin"
  }
];

export const GameChanger = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-white via-accent-purple/10 to-white">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-6">
            Why Elloria Pads Are a{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Game-Changer
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Experience the perfect blend of innovation and comfort with features that set us apart
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full group hover:shadow-lg transition-all duration-300 border-none bg-white/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300"
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-600 mb-4">{feature.description}</p>
                  <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-300">
                    <p className="text-primary/80 text-sm pt-4 border-t">
                      {feature.detail}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};