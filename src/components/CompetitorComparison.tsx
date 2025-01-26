import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Shield, Leaf, Heart, Sparkles } from "lucide-react";

const metrics = [
  {
    category: "Absorption Capacity",
    elloria: 95,
    competitors: 82,
    icon: <Shield className="w-5 h-5" />,
    description: "Superior protection for complete confidence"
  },
  {
    category: "Eco-friendliness",
    elloria: 90,
    competitors: 63,
    icon: <Leaf className="w-5 h-5" />,
    description: "Sustainable materials and production"
  },
  {
    category: "Comfort and Fit",
    elloria: 98,
    competitors: 77,
    icon: <Heart className="w-5 h-5" />,
    description: "Designed for ultimate comfort"
  },
  {
    category: "Value for Money",
    elloria: 92,
    competitors: 71,
    icon: <Sparkles className="w-5 h-5" />,
    description: "Premium quality at fair prices"
  }
];

export const CompetitorComparison = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-white via-accent-purple/10 to-white">
      <div className="container px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-primary">
            Why Choose Elloria?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Experience the difference in every detail
          </p>
        </motion.div>

        <div className="grid gap-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.category}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative overflow-hidden bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-start gap-6">
                <div className="bg-primary/10 p-3 rounded-xl">
                  {metric.icon}
                </div>
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                      {metric.category}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {metric.description}
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-sm font-medium text-primary">Elloria</span>
                        <motion.span
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                          className="text-sm font-bold text-primary"
                        >
                          {metric.elloria}%
                        </motion.span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${metric.elloria}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1.5">
                        <span className="text-sm font-medium text-gray-600">Industry Average</span>
                        <motion.span
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.6 }}
                          className="text-sm font-bold text-gray-600"
                        >
                          {metric.competitors}%
                        </motion.span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${metric.competitors}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.3 }}
                          className="h-full rounded-full bg-gray-300"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-12"
        >
          <Button 
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Experience the Elloria Difference
          </Button>
        </motion.div>
      </div>
    </section>
  );
};