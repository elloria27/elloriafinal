import { motion } from "framer-motion";
import { ContactDetailsContent } from "@/types/content-blocks";

interface ContactDetailsProps {
  content?: ContactDetailsContent;
}

export const ContactDetails = ({ content }: ContactDetailsProps) => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <div className="space-y-6">
            {content?.address && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Address</h3>
                <p className="text-gray-600">{content.address}</p>
              </div>
            )}
            
            {content?.phone && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Phone</h3>
                <a href={`tel:${content.phone}`} className="text-primary hover:underline">
                  {content.phone}
                </a>
              </div>
            )}
            
            {content?.email && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Email</h3>
                <a href={`mailto:${content.email}`} className="text-primary hover:underline">
                  {content.email}
                </a>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};