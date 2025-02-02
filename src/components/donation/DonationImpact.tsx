import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface DonationImpactProps {
  onDonateClick: () => void;
}

export const DonationImpact = ({ onDonateClick }: DonationImpactProps) => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Your Impact Makes a Difference
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Every donation helps us reach more women and girls in need. See how your
            contribution creates positive change in our community.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="p-6 bg-accent-purple/10 rounded-lg">
              <h3 className="text-2xl font-bold mb-2">5,000+</h3>
              <p className="text-gray-600">Women Helped Monthly</p>
            </div>
            <div className="p-6 bg-accent-peach/10 rounded-lg">
              <h3 className="text-2xl font-bold mb-2">20+</h3>
              <p className="text-gray-600">Community Partners</p>
            </div>
            <div className="p-6 bg-accent-green/10 rounded-lg">
              <h3 className="text-2xl font-bold mb-2">100%</h3>
              <p className="text-gray-600">Funds to Programs</p>
            </div>
          </div>
          <Button
            onClick={onDonateClick}
            size="lg"
            className="bg-primary hover:bg-primary/90"
          >
            Make a Difference Now
          </Button>
        </motion.div>
      </div>
    </section>
  );
};