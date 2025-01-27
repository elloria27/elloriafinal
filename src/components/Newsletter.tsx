import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Mail } from "lucide-react";
import { NewsletterContent } from "@/types/content-blocks";

interface NewsletterProps {
  content?: NewsletterContent;
}

export const Newsletter = ({ content }: NewsletterProps) => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Success!",
      description: "Thank you for subscribing to our newsletter!",
    });
    setEmail("");
  };

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
            Join the Elloria Movement
          </h2>
          <p className="text-gray-600 text-lg mb-12">
            Be the first to know about exclusive offers, eco-updates, and new product launches.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 h-14 text-lg"
              required
            />
            <Button type="submit" className="bg-primary hover:bg-primary/90 text-white h-14 px-8 text-lg">
              Subscribe
            </Button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};
