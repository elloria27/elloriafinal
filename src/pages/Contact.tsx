import { ContactHero } from "@/components/contact/ContactHero";
import { ContactDetails } from "@/components/contact/ContactDetails";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactFAQ } from "@/components/contact/ContactFAQ";
import { BusinessContact } from "@/components/contact/BusinessContact";
import { motion } from "framer-motion";

const Contact = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen pt-20"
    >
      <ContactHero />
      <ContactDetails />
      <ContactForm />
      <ContactFAQ />
      <BusinessContact />
    </motion.main>
  );
};

export default Contact;