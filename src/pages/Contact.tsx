import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactDetails } from "@/components/contact/ContactDetails";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactFAQ } from "@/components/contact/ContactFAQ";
import { BusinessContact } from "@/components/contact/BusinessContact";
import { ContentBlock } from "@/types/content-blocks";

const Contact = () => {
  const [pageContent, setPageContent] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        console.log('Fetching contact page content...');
        
        const { data: pageData, error: pageError } = await supabase
          .from('pages')
          .select('id')
          .eq('slug', 'contact')
          .single();

        if (pageError) {
          console.error('Error fetching page:', pageError);
          return;
        }

        if (!pageData?.id) {
          console.error('Contact page not found');
          return;
        }

        console.log('Found contact page ID:', pageData.id);

        const { data: blocks, error: blocksError } = await supabase
          .from('content_blocks')
          .select('*')
          .eq('page_id', pageData.id)
          .order('order_index');

        if (blocksError) {
          console.error('Error fetching content blocks:', blocksError);
          return;
        }

        if (blocks) {
          console.log('Fetched content blocks:', blocks);
          setPageContent(blocks as ContentBlock[]);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPageContent();
  }, []);

  const getBlockContent = (type: string) => {
    const block = pageContent.find(block => block.type === type);
    if (!block) return {};
    
    // Add default required properties based on content type
    switch (type) {
      case 'contact_hero':
        return {
          title: "Contact Us",
          ...block.content
        };
      case 'contact_details':
        return {
          address: "229 Dowling Ave W, Winnipeg, MB R2C 2K4, Canada",
          phone: "+1 (204) 930-2019",
          email: "support@elloria.ca",
          ...block.content
        };
      case 'contact_faq':
        return {
          faqs: [],
          ...block.content
        };
      case 'contact_business':
        return {
          email: "business@elloria.ca",
          buttonLink: "/for-business",
          ...block.content
        };
      default:
        return block.content;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen pt-20"
    >
      <ContactHero content={getBlockContent('contact_hero')} />
      <ContactDetails content={getBlockContent('contact_details')} />
      <ContactForm content={getBlockContent('contact_form')} />
      <ContactFAQ content={getBlockContent('contact_faq')} />
      <BusinessContact content={getBlockContent('contact_business')} />
    </motion.main>
  );
};

export default Contact;