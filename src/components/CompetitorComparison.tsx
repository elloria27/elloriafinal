import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const metrics = [
  {
    category: "Absorption Capacity",
    elloria: 95,
    always: 85,
    kotex: 80,
    color: "#9b87f5",
    icon: "💧"
  },
  {
    category: "Eco-friendliness",
    elloria: 90,
    always: 60,
    kotex: 65,
    color: "#F2FCE2",
    icon: "🌱"
  },
  {
    category: "Comfort and Fit",
    elloria: 98,
    always: 75,
    kotex: 78,
    color: "#D3E4FD",
    icon: "✨"
  },
  {
    category: "Price Value",
    elloria: 85,
    always: 70,
    kotex: 72,
    color: "#D6BCFA",
    icon: "💎"
  }
];

export const CompetitorComparison = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-white via-accent-purple/10 to-white overflow-hidden">
      <div className="container px-4 max-w-6xl mx-auto">
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
            See how we compare to other leading brands in key areas that matter most to you
          </p>
        </motion.div>

        <div className="grid gap-8">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.category}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20"
            >
              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl">{metric.icon}</span>
                <h3 className="text-2xl font-semibold text-gray-800">{metric.category}</h3>
              </div>

              <div className="space-y-6">
                {/* Elloria */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-primary">Elloria</span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.5 }}
                      className="font-bold text-primary"
                    >
                      {metric.elloria}%
                    </motion.span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${metric.elloria}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                    />
                  </div>
                </div>

                {/* Always */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-700">Always</span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.6 }}
                      className="font-bold text-gray-700"
                    >
                      {metric.always}%
                    </motion.span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${metric.always}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="h-full rounded-full bg-gray-400"
                    />
                  </div>
                </div>

                {/* Kotex */}
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-700">Kotex</span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.7 }}
                      className="font-bold text-gray-700"
                    >
                      {metric.kotex}%
                    </motion.span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${metric.kotex}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: 0.4 }}
                      className="h-full rounded-full bg-gray-500"
                    />
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
          className="text-center mt-16"
        >
          <Button 
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white px-8 py-6 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Learn Why Women Choose Elloria
          </Button>
        </motion.div>
      </div>
    </section>
  );
};