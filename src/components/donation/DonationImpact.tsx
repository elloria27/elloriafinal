import { motion } from "framer-motion";
import { Heart, Users, Globe, Sparkles } from "lucide-react";
import { DonationImpactContent } from "@/types/content-blocks";

interface DonationImpactProps {
  content: DonationImpactContent;
}

export const DonationImpact = ({ content }: DonationImpactProps) => {
  const impacts = [
    {
      icon: Heart,
      title: "Direct Support",
      description: "Every donation directly supports women and girls in need with essential care products."
    },
    {
      icon: Users,
      title: "Community Impact",
      description: "We partner with local organizations to ensure donations reach those who need them most."
    },
    {
      icon: Globe,
      title: "Global Reach",
      description: "Your support helps us expand our impact to more communities worldwide."
    },
    {
      icon: Sparkles,
      title: "Sustainable Change",
      description: "Together, we're creating lasting change in women's health and dignity."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-accent-purple/10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Your Impact Makes a Difference
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            When you donate to Elloria's program, you're not just giving products
            – you're investing in dignity, health, and empowerment.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {impacts.map((impact, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="mb-4 text-primary">
                <impact.icon className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{impact.title}</h3>
              <p className="text-gray-600">{impact.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
