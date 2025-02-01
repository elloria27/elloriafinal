import { useState } from "react";
import { motion } from "framer-motion";
import { Share2, Copy, Mail, Facebook, Twitter, Instagram, Heart, Gift, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function Thanks() {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [showPromoCode, setShowPromoCode] = useState(false);
  const promoCode = "THANKYOU10";

  const handleCopyPromoCode = async () => {
    try {
      await navigator.clipboard.writeText(promoCode);
      toast.success("Promo code copied!");
    } catch (error) {
      console.error("Error copying promo code:", error);
      toast.error("Failed to copy promo code");
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsSubscribing(true);
    try {
      const { error } = await supabase.functions.invoke('send-subscription-email', {
        body: { email }
      });

      if (error) throw error;

      toast.success("Thank you for subscribing! Check your email for exclusive offers.");
      setEmail("");
    } catch (error) {
      console.error("Error subscribing:", error);
      toast.error("Subscription error. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleSocialShare = (platform: string) => {
    const url = encodeURIComponent(window.location.origin);
    const text = encodeURIComponent("I just discovered amazing products from Elloria! Check them out:");
    
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
    <div className="min-h-screen bg-gradient-to-b from-white via-accent-purple/5 to-white pt-32 pb-12 px-4">
      <div className="max-w-4xl mx-auto space-y-16">
        {/* Welcome Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8"
        >
          <div className="relative inline-block">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              className="absolute -top-6 -right-6 text-primary"
            >
              <Heart className="w-12 h-12 fill-primary/20" />
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
              Thank You for Choosing Elloria!
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We appreciate your trust in our products. As a token of our gratitude, 
            receive an exclusive discount on your next purchase!
          </p>
          {!showPromoCode ? (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                size="lg"
                onClick={() => setShowPromoCode(true)}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-full shadow-lg"
              >
                Get Promo Code <Gift className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center space-y-4"
            >
              <div className="flex items-center gap-3 bg-accent-purple/20 px-6 py-4 rounded-xl">
                <code className="text-2xl font-mono font-bold text-primary">
                  {promoCode}
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

        {/* Referral Program Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-accent-purple/30 via-accent-peach/20 to-accent-green/20 rounded-3xl p-8 md:p-12 space-y-8"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Share and Get More Rewards!</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Share Elloria with friends and receive amazing rewards:
            </p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/80 p-6 rounded-xl shadow-sm"
              >
                <p className="font-semibold text-lg">1 share</p>
                <p className="text-primary">= 15% discount</p>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/80 p-6 rounded-xl shadow-sm"
              >
                <p className="font-semibold text-lg">3 referrals</p>
                <p className="text-primary">= Free package</p>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/80 p-6 rounded-xl shadow-sm"
              >
                <p className="font-semibold text-lg">5+ referrals</p>
                <p className="text-primary">= Buy 1, get 2 free</p>
              </motion.div>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => handleSocialShare('facebook')}
              className="flex items-center gap-2 bg-white hover:bg-gray-50"
            >
              <Facebook className="h-4 w-4" />
              Share on Facebook
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSocialShare('twitter')}
              className="flex items-center gap-2 bg-white hover:bg-gray-50"
            >
              <Twitter className="h-4 w-4" />
              Share on Twitter
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSocialShare('instagram')}
              className="flex items-center gap-2 bg-white hover:bg-gray-50"
            >
              <Instagram className="h-4 w-4" />
              Share on Instagram
            </Button>
          </div>
        </motion.section>

        {/* Special Offers Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative overflow-hidden bg-gradient-to-r from-primary/10 to-secondary/10 rounded-3xl p-12 text-center"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 10, 0]
            }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-0 right-0 text-primary/20"
          >
            <Gift className="w-32 h-32" />
          </motion.div>
          
          <h2 className="text-3xl font-bold mb-4">Special Offer</h2>
          <p className="text-2xl font-semibold text-primary mb-6">
            Buy 1, Get 2 Free!
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white px-8">
            <a href="/shop" className="flex items-center gap-2">
              Shop Now <ArrowRight className="w-5 h-5" />
            </a>
          </Button>
        </motion.section>

        {/* Newsletter Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="max-w-md mx-auto text-center"
        >
          <h2 className="text-2xl font-bold mb-4">
            Get Early Access to Our Best Offers!
          </h2>
          <form onSubmit={handleSubscribe} className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={isSubscribing} className="bg-primary hover:bg-primary/90">
                {isSubscribing ? (
                  <Mail className="h-4 w-4 animate-spin" />
                ) : (
                  "Subscribe"
                )}
              </Button>
            </div>
          </form>
        </motion.section>
      </div>
    </div>
  );
}