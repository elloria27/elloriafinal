
import { ThanksNewsletterContent } from "@/types/content-blocks";
import { motion } from "framer-motion";
import { Mail } from "lucide-react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsSubmitting(true);
    try {
      // Check if email already exists
      const { data: existingSubscription } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("email", email)
        .single();

      if (existingSubscription) {
        toast.error("This email is already subscribed to our newsletter");
        return;
      }

      // Add new subscription
      const { error } = await supabase
        .from("subscriptions")
        .insert([
          {
            email,
            source: "thanks_page"
          }
        ]);

      if (error) throw error;

      toast.success("Thank you for subscribing to our newsletter!");
      setEmail("");
    } catch (error: any) {
      console.error("Error subscribing:", error);
      toast.error("Failed to subscribe. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="max-w-md mx-auto text-center px-4 py-12"
    >
      <h2 className="text-xl md:text-2xl font-bold mb-4">
        {content.title || "Get Early Access to Our Best Offers!"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col md:flex-row gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            disabled={isSubmitting}
          />
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary/90 w-full md:w-auto"
          >
            {isSubmitting ? (
              <Mail className="h-4 w-4 animate-spin" />
            ) : (
              content.buttonText || "Subscribe"
            )}
          </Button>
        </div>
      </form>
    </motion.section>
  );
};
