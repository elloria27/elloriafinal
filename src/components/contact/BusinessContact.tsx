import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const BusinessContact = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl font-bold mb-4">For Business Inquiries</h2>
          <p className="text-gray-600 mb-6">
            Interested in partnering with Elloria? We'd love to explore opportunities together.
          </p>
          
          <div className="space-y-4">
            <p className="text-gray-800">
              Email us at:{" "}
              <a
                href="mailto:business@elloria.ca"
                className="text-primary hover:underline"
              >
                business@elloria.ca
              </a>
            </p>
            
            <Button asChild>
              <Link to="/for-business">
                Learn More About Business Opportunities
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};