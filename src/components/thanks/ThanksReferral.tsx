
import { ThanksReferralContent } from "@/types/content-blocks";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ThanksReferralProps {
  content: ThanksReferralContent;
}

export const ThanksReferral = ({ content }: ThanksReferralProps) => {
  const handleSocialShare = (platform: string) => {
    const url = encodeURIComponent(window.location.origin);
    const text = encodeURIComponent(content.description || "I just discovered amazing products from Elloria! Check them out:");
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'instagram':
        toast.info("Open Instagram app to share to your story!");
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gradient-to-br from-accent-purple/30 via-accent-peach/20 to-accent-green/20 rounded-2xl md:rounded-3xl p-6 md:p-12 space-y-8 max-w-4xl mx-auto my-8"
    >
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">{content.title || "Share and Get More Rewards!"}</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {content.description || "Share Elloria with friends and receive amazing rewards:"}
        </p>
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/80 p-4 md:p-6 rounded-xl shadow-sm"
          >
            <p className="font-semibold text-lg">1 share</p>
            <p className="text-primary">= 15% discount</p>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/80 p-4 md:p-6 rounded-xl shadow-sm"
          >
            <p className="font-semibold text-lg">3 referrals</p>
            <p className="text-primary">= Free package</p>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white/80 p-4 md:p-6 rounded-xl shadow-sm sm:col-span-2 md:col-span-1"
          >
            <p className="font-semibold text-lg">5+ referrals</p>
            <p className="text-primary">= Buy 1, get 2 free</p>
          </motion.div>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-3 md:gap-4">
        <Button
          variant="outline"
          onClick={() => handleSocialShare('facebook')}
          className="flex-1 md:flex-none items-center gap-2 bg-white hover:bg-gray-50 min-w-[120px]"
        >
          <Facebook className="h-4 w-4" />
          <span className="hidden md:inline">Share on</span> Facebook
        </Button>
        <Button
          variant="outline"
          onClick={() => handleSocialShare('twitter')}
          className="flex-1 md:flex-none items-center gap-2 bg-white hover:bg-gray-50 min-w-[120px]"
        >
          <Twitter className="h-4 w-4" />
          <span className="hidden md:inline">Share on</span> Twitter
        </Button>
        <Button
          variant="outline"
          onClick={() => handleSocialShare('instagram')}
          className="flex-1 md:flex-none items-center gap-2 bg-white hover:bg-gray-50 min-w-[120px]"
        >
          <Instagram className="h-4 w-4" />
          <span className="hidden md:inline">Share on</span> Instagram
        </Button>
      </div>
    </motion.section>
  );
};
