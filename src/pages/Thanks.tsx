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
      toast.success("Промокод скопійовано!");
    } catch (error) {
      console.error("Error copying promo code:", error);
      toast.error("Не вдалося скопіювати промокод");
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Будь ласка, введіть email адресу");
      return;
    }

    setIsSubscribing(true);
    try {
      const { error } = await supabase.functions.invoke('send-subscription-email', {
        body: { email }
      });

      if (error) throw error;

      toast.success("Дякуємо за підписку! Перевірте свою пошту для ексклюзивних пропозицій.");
      setEmail("");
    } catch (error) {
      console.error("Error subscribing:", error);
      toast.error("Помилка підписки. Спробуйте ще раз.");
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleSocialShare = (platform: string) => {
    const url = encodeURIComponent(window.location.origin);
    const text = encodeURIComponent("Я щойно відкрив для себе чудові продукти від Elloria! Перевірте їх:");
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'instagram':
        toast.info("Відкрийте додаток Instagram, щоб поділитися в своїй історії!");
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-accent-purple/5 to-white pt-24 pb-12 px-4">
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
              Дякуємо, що обрали Elloria!
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Ми цінуємо вашу довіру до наших продуктів. Як знак нашої вдячності, 
            отримайте ексклюзивну знижку на наступну покупку!
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
                Отримати промокод <Gift className="ml-2 h-5 w-5" />
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
                Використайте цей код при оформленні замовлення для знижки 10%
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
            <h2 className="text-3xl font-bold mb-4">Поділіться та отримайте більше винагород!</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Поділіться Elloria з друзями та отримайте неймовірні винагороди:
            </p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/80 p-6 rounded-xl shadow-sm"
              >
                <p className="font-semibold text-lg">1 поширення</p>
                <p className="text-primary">= 15% знижки</p>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/80 p-6 rounded-xl shadow-sm"
              >
                <p className="font-semibold text-lg">3 реферали</p>
                <p className="text-primary">= Безкоштовний пакет</p>
              </motion.div>
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="bg-white/80 p-6 rounded-xl shadow-sm"
              >
                <p className="font-semibold text-lg">5+ рефералів</p>
                <p className="text-primary">= Купи 1, отримай 2 безкоштовно</p>
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
              Поширити у Facebook
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSocialShare('twitter')}
              className="flex items-center gap-2 bg-white hover:bg-gray-50"
            >
              <Twitter className="h-4 w-4" />
              Поширити у Twitter
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSocialShare('instagram')}
              className="flex items-center gap-2 bg-white hover:bg-gray-50"
            >
              <Instagram className="h-4 w-4" />
              Поширити в Instagram
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
          
          <h2 className="text-3xl font-bold mb-4">Спеціальна пропозиція</h2>
          <p className="text-2xl font-semibold text-primary mb-6">
            Купи 1, отримай 2 безкоштовно!
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white px-8">
            <a href="/shop" className="flex items-center gap-2">
              Купити зараз <ArrowRight className="w-5 h-5" />
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
            Отримайте ранній доступ до наших найкращих пропозицій!
          </h2>
          <form onSubmit={handleSubscribe} className="space-y-4">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Введіть ваш email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={isSubscribing} className="bg-primary hover:bg-primary/90">
                {isSubscribing ? (
                  <Mail className="h-4 w-4 animate-spin" />
                ) : (
                  "Підписатися"
                )}
              </Button>
            </div>
          </form>
        </motion.section>
      </div>
    </div>
  );
}