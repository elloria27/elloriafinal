
import { ThanksSpecialOfferContent } from "@/types/content-blocks";
import { motion } from "framer-motion";
import { Gift, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ThanksSpecialOfferProps {
  content: ThanksSpecialOfferContent;
}

export const ThanksSpecialOffer = ({ content }: ThanksSpecialOfferProps) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="relative overflow-hidden bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl md:rounded-3xl p-8 md:p-12 text-center max-w-4xl mx-auto my-8"
    >
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 10, 0]
        }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute top-0 right-0 text-primary/20"
      >
        <Gift className="w-24 md:w-32 h-24 md:h-32" />
      </motion.div>
      
      <h2 className="text-2xl md:text-3xl font-bold mb-4">{content.title || "Special Offer"}</h2>
      <p className="text-xl md:text-2xl font-semibold text-primary mb-6">
        {content.description || "Buy 1, Get 2 Free!"}
      </p>
      {content.buttonText && content.buttonLink && (
        <Button 
          asChild 
          size="lg" 
          className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white px-6 md:px-8"
        >
          <a href={content.buttonLink} className="flex items-center justify-center gap-2">
            {content.buttonText} <ArrowRight className="w-5 h-5" />
          </a>
        </Button>
      )}
    </motion.section>
  );
};
