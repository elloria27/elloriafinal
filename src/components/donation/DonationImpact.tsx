
import { motion } from "framer-motion";
import { Heart, Users, Globe, Sparkles, LucideIcon } from "lucide-react";
import { DonationImpactContent } from "@/types/content-blocks";

interface DonationImpactProps {
  content: DonationImpactContent;
}

const iconMap: { [key: string]: LucideIcon } = {
  Heart,
  Users,
  Globe,
  Sparkles,
};

export const DonationImpact = ({ content }: DonationImpactProps) => {
  const impacts = content.impacts || [];

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
            {content.title || "Your Impact Makes a Difference"}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {content.subtitle || "When you donate to Elloria's program, you're not just giving products – you're investing in dignity, health, and empowerment."}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {impacts.map((impact, index) => {
            const Icon = iconMap[impact.icon] || Heart;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="mb-4 text-primary">
                  <Icon className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{impact.title}</h3>
                <p className="text-gray-600">{impact.description}</p>
              </motion.div>
            )}
          )}
        </div>
      </div>
    </section>
  );
};
