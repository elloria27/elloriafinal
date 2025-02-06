
import { ThanksNewsletterContent } from "@/types/content-blocks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ThanksNewsletterProps {
  content: ThanksNewsletterContent;
}

export const ThanksNewsletter = ({ content }: ThanksNewsletterProps) => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);
    try {
      const { error } = await supabase.functions.invoke('send-subscription-email', {
        body: { email }
      });

      if (error) throw error;

      toast.success("Thank you for subscribing!");
      setEmail("");
    } catch (error) {
      console.error("Error subscribing:", error);
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <div className="bg-gray-50 py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">{content.title || "Join Our Newsletter"}</h2>
        <p className="text-lg text-gray-600 mb-8">{content.description || "Subscribe to get special offers and updates."}</p>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={isSubscribing}
            className="bg-primary hover:bg-primary/90"
          >
            {content.buttonText || "Subscribe"}
          </Button>
        </form>
      </div>
    </div>
  );
};

