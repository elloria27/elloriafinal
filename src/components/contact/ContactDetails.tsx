import { MapPin, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { ContactDetailsContent } from "@/types/content-blocks";

interface ContactDetailsProps {
  content: ContactDetailsContent;
}

export const ContactDetails = ({ content }: ContactDetailsProps) => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="flex items-start space-x-4">
              <MapPin className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Address</h3>
                <p className="text-gray-600">
                  {content.address || "229 Dowling Ave W, Winnipeg, MB R2C 2K4, Canada"}
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <Phone className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Phone</h3>
                <p className="text-gray-600">{content.phone || "+1 (204) 930-2019"}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <Mail className="w-6 h-6 text-primary mt-1" />
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
                <p className="text-gray-600">{content.email || "support@elloria.ca"}</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="h-[400px] rounded-lg overflow-hidden shadow-lg"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2569.8892831135287!2d-97.0270088!3d49.8952893!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x52ea7a88c7f2e5f5%3A0x8b4a6b8f8b4a6b8f!2s229%20Dowling%20Ave%20W%2C%20Winnipeg%2C%20MB%20R2C%202K4!5e0!3m2!1sen!2sca!4v1625123456789!5m2!1sen!2sca"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Elloria Office Location"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};