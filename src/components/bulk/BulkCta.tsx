
import { motion } from "framer-motion";
import { BulkCtaContent } from "@/types/content-blocks";
import { Button } from "@/components/ui/button";

interface BulkCtaProps {
  content?: BulkCtaContent;
  onConsultationClick?: () => void;
}

export const BulkCta = ({ content, onConsultationClick }: BulkCtaProps) => {
  if (!content) return null;

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-light mb-6"
          >
            {content.title || "Ready to Get Started?"}
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 mb-8"
          >
            {content.description || "Join other organizations that trust us for their feminine care needs."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <Button 
              size="lg"
              onClick={onConsultationClick}
              className="bg-primary hover:bg-primary/90"
            >
              {content.buttonText || "Request a Quote"}
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
