import { useEffect, useState } from "react";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactDetails } from "@/components/contact/ContactDetails";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactFAQ } from "@/components/contact/ContactFAQ";
import { BusinessContact } from "@/components/contact/BusinessContact";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { ContentBlock } from "@/types/content-blocks";

const Contact = () => {
  const [pageContent, setPageContent] = useState<ContentBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        console.log('Fetching contact page content');
        const { data: pages, error } = await supabase
          .from('pages')
          .select('id, content_blocks')
          .eq('slug', 'contact')
          .single();

        if (error) {
          console.error('Error fetching page:', error);
          return;
        }

        if (pages?.content_blocks) {
          console.log('Found content blocks:', pages.content_blocks);
          setPageContent(pages.content_blocks as ContentBlock[]);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageContent();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const getBlockContent = (type: string) => {
    const block = pageContent.find(block => block.type === type);
    return block?.content || {};
  };

  const heroContent = getBlockContent('contact_hero');
  const detailsContent = getBlockContent('contact_details');
  const formContent = getBlockContent('contact_form');
  const faqContent = getBlockContent('contact_faq');
  const businessContent = getBlockContent('contact_business');

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen pt-20"
    >
      <ContactHero content={heroContent} />
      <ContactDetails content={detailsContent} />
      <ContactForm content={formContent} />
      <ContactFAQ content={faqContent} />
      <BusinessContact content={businessContent} />
    </motion.main>
  );
};

export default Contact;