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
        
        // First, get the page ID for contact page
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

        // Then fetch content blocks for this page
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
          const typedBlocks = blocks.map(block => ({
            id: block.id,
            type: block.type,
            content: block.content,
            order_index: block.order_index,
            page_id: block.page_id,
            created_at: block.created_at,
            updated_at: block.updated_at
          })) as ContentBlock[];
          
          setPageContent(typedBlocks);
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
    return pageContent.find(block => block.type === type)?.content || {};
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