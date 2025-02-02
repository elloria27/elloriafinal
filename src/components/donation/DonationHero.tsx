import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface DonationHeroProps {
  onDonateClick: () => void;
}

export const DonationHero = ({ onDonateClick }: DonationHeroProps) => {
  return (
    <section className="relative bg-gradient-to-b from-primary/10 to-background pt-24 pb-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Support Our Mission to Empower Women
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your donation helps us provide essential feminine care products to those in need.
            Together, we can make a difference in women's lives.
          </p>
          <Button
            onClick={onDonateClick}
            size="lg"
            className="bg-primary hover:bg-primary/90"
          >
            Donate Now
          </Button>
        </motion.div>
      </div>
    </section>
  );
};