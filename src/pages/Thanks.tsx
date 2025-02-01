import { useState } from "react";
import { motion } from "framer-motion";
import { Share2, Copy, Mail, Facebook, Twitter, Instagram } from "lucide-react";
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
      toast.success("Promo code copied to clipboard!");
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
      toast.error("Failed to subscribe. Please try again.");
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
        // Instagram sharing is typically done through stories on mobile
        toast.info("Open Instagram app to share in your story!");
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Welcome Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <h1 className="text-4xl md:text-5xl font-bold">
            Thank You for Choosing Elloria!
          </h1>
          <p className="text-xl text-gray-600">
            We appreciate your trust in our products. As a token of our gratitude, 
            enjoy an exclusive discount on your next purchase!
          </p>
          {!showPromoCode ? (
            <Button 
              size="lg"
              onClick={() => setShowPromoCode(true)}
              className="bg-primary hover:bg-primary/90"
            >
              Claim Your Promo Code
            </Button>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              <div className="flex items-center gap-2">
                <code className="px-4 py-2 bg-gray-100 rounded-lg text-lg font-mono">
                  {promoCode}
                </code>
                <Button variant="outline" size="icon" onClick={handleCopyPromoCode}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-500">
                Use this code at checkout for 10% off your next purchase
              </p>
            </div>
          )}
        </motion.section>

        {/* Referral Program Section */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-50 rounded-2xl p-8 space-y-6"
        >
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Share & Earn More Rewards!</h2>
            <p className="text-gray-600">
              Share Elloria with your friends and earn amazing rewards:
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>• 1 share = 15% discount</li>
              <li>• 3 referrals = Free package</li>
              <li>• 5+ referrals = Buy 1, Get 2 Free</li>
            </ul>
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              variant="outline"
              onClick={() => handleSocialShare('facebook')}
              className="flex items-center gap-2"
            >
              <Facebook className="h-4 w-4" />
              Share on Facebook
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSocialShare('twitter')}
              className="flex items-center gap-2"
            >
              <Twitter className="h-4 w-4" />
              Tweet on X
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSocialShare('instagram')}
              className="flex items-center gap-2"
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
          className="bg-primary/5 rounded-2xl p-8 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Special Offer</h2>
          <p className="text-2xl font-semibold text-primary mb-6">
            Buy 1, Get 2 Free!
          </p>
          <Button asChild size="lg">
            <a href="/shop">Shop Now</a>
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
            Get Early Access to Our Best Deals!
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
              <Button type="submit" disabled={isSubscribing}>
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