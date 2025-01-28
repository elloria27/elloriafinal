import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ContactBusinessContent } from "@/types/content-blocks";

interface BusinessContactProps {
  content?: ContactBusinessContent;
}

export const BusinessContact = ({ content }: BusinessContactProps) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold mb-4">{content?.title || "For Business Inquiries"}</h2>
          <p className="text-gray-600 mb-6">
            {content?.description || "Interested in partnering with Elloria? We'd love to explore opportunities together."}
          </p>
          
          <div className="space-y-4">
            <p className="text-gray-800">
              Email us at:{" "}
              <a
                href={`mailto:${content?.email || "business@elloria.ca"}`}
                className="text-primary hover:underline"
              >
                {content?.email || "business@elloria.ca"}
              </a>
            </p>
            
            <Button asChild>
              <Link to={content?.buttonLink || "/for-business"}>
                {content?.buttonText || "Learn More About Business Opportunities"}
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};