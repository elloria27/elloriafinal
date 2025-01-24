import { motion } from "framer-motion";
import { Leaf, TreePine, Recycle, World } from "lucide-react";
import { Button } from "@/components/ui/button";

const SustainabilityProgram = () => {
  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen pt-16"
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-accent-green/10 to-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Join Our Sustainability Program
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Partner with us to make a positive impact on the environment while growing your business sustainably.
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90">
              Get Started Today
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Program Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Leaf className="w-8 h-8" />,
                title: "Eco-Friendly Products",
                description: "Access to our sustainable product line"
              },
              {
                icon: <TreePine className="w-8 h-8" />,
                title: "Carbon Offsetting",
                description: "Contribute to global reforestation efforts"
              },
              {
                icon: <Recycle className="w-8 h-8" />,
                title: "Waste Reduction",
                description: "Optimize packaging and reduce waste"
              },
              {
                icon: <World className="w-8 h-8" />,
                title: "Global Impact",
                description: "Be part of worldwide sustainability initiatives"
              }
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-100"
              >
                <div className="text-primary mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="max-w-4xl mx-auto">
            {[
              {
                step: 1,
                title: "Join the Program",
                description: "Sign up and complete our sustainability assessment"
              },
              {
                step: 2,
                title: "Set Goals",
                description: "Work with our experts to set achievable sustainability targets"
              },
              {
                step: 3,
                title: "Implement Changes",
                description: "Access resources and support to make sustainable changes"
              },
              {
                step: 4,
                title: "Track Progress",
                description: "Monitor your impact and celebrate achievements"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="flex items-start gap-4 mb-8"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                  {step.step}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-primary/5 rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
            <p className="text-gray-600 mb-8">
              Join our sustainability program today and be part of the solution for a better tomorrow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Join Now
              </Button>
              <Button size="lg" variant="outline">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </motion.main>
  );
};

export default SustainabilityProgram;