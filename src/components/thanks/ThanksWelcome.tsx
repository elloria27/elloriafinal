
import { ThanksWelcomeContent } from "@/types/content-blocks";
import { motion } from "framer-motion";
import { Heart, Gift, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface ThanksWelcomeProps {
  content: ThanksWelcomeContent;
}

export const ThanksWelcome = ({ content }: ThanksWelcomeProps) => {
  const [showPromoCode, setShowPromoCode] = useState(false);
  
  const handleCopyPromoCode = async () => {
    if (!content.promoCode) return;
    
    try {
      await navigator.clipboard.writeText(content.promoCode);
      toast.success("Promo code copied!");
    } catch (error) {
      console.error("Error copying promo code:", error);
      toast.error("Failed to copy promo code");
    }
  };

  return (
    <div className="min-h-[50vh] pt-12 pb-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8 md:space-y-16">
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 md:space-y-8"
        >
          <div className="relative inline-block">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              className="absolute -top-4 -right-4 md:-top-6 md:-right-6 text-primary"
            >
              <Heart className="w-8 h-8 md:w-12 md:h-12 fill-primary/20" />
            </motion.div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900">
              {content.title || "Thank You for Choosing Elloria!"}
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            {content.subtitle || "We appreciate your trust in our products. As a token of our gratitude, receive an exclusive discount on your next purchase!"}
          </p>
          
          {content.promoCode && !showPromoCode ? (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4"
            >
              <Button 
                size="lg"
                onClick={() => setShowPromoCode(true)}
                className="bg-primary hover:bg-primary/90 text-white px-6 md:px-8 py-6 text-lg rounded-full shadow-lg w-full md:w-auto"
              >
                {content.promoButtonText || "Get Promo Code"} <Gift className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          ) : content.promoCode && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center space-y-4 px-4"
            >
              <div className="flex items-center gap-3 bg-accent-purple/20 px-4 md:px-6 py-4 rounded-xl w-full md:w-auto">
                <code className="text-xl md:text-2xl font-mono font-bold text-primary">
                  {content.promoCode}
                </code>
                <Button variant="ghost" size="icon" onClick={handleCopyPromoCode}>
                  <Copy className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Use this code at checkout for a 10% discount
              </p>
            </motion.div>
          )}
        </motion.section>
      </div>
    </div>
  );
};
