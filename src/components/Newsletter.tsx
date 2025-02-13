
import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { NewsletterContent } from "@/types/content-blocks";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface NewsletterProps {
  content?: NewsletterContent;
}

export const Newsletter = ({ content }: NewsletterProps) => {
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
      // Check if email already exists using maybeSingle() instead of single()
      const { data: existingSubscription } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("email", email)
        .maybeSingle();

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
            source: "website"
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

  const buttonText = typeof content?.buttonText === 'string' ? content.buttonText : "Subscribe";

  return (
    <section className="w-full py-24 bg-gradient-to-b from-secondary/10 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <Mail className="w-12 h-12 mx-auto mb-6 text-primary" />
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            {typeof content?.title === 'string' ? content.title : "Join the Elloria Movement"}
          </h2>
          <p className="text-gray-600 text-lg mb-12">
            {typeof content?.description === 'string' ? content.description : "Be the first to know about exclusive offers, eco-updates, and new product launches."}
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-14 text-lg"
              required
              disabled={isSubmitting}
            />
            <Button 
              type="submit" 
              className="bg-primary hover:bg-primary/90 text-white h-14 px-8 text-lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4 animate-spin" />
                  Subscribing...
                </span>
              ) : buttonText}
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};
