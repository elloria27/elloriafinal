import { useState, useEffect } from "react";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactDetails } from "@/components/contact/ContactDetails";
import { ContactForm } from "@/components/contact/ContactForm";
import { ContactFAQ } from "@/components/contact/ContactFAQ";
import { BusinessContact } from "@/components/contact/BusinessContact";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { ContentBlock, BaseBlockContent, ContactHeroContent, ContactDetailsContent, ContactFormContent, ContactFAQContent, ContactBusinessContent } from "@/types/content-blocks";

interface PageData {
  id: string;
  content_blocks: Array<ContentBlock<BaseBlockContent>>;
}

const Contact = () => {
  const [pageContent, setPageContent] = useState<{
    hero?: ContentBlock<ContactHeroContent>;
    details?: ContentBlock<ContactDetailsContent>;
    form?: ContentBlock<ContactFormContent>;
    faq?: ContentBlock<ContactFAQContent>;
    business?: ContentBlock<ContactBusinessContent>;
  }>({});

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
          console.error('Error fetching contact page:', error);
          return;
        }

        if (!pages || !pages.content_blocks) {
          console.log('No content blocks found for contact page');
          return;
        }

        const typedPages = pages as unknown as PageData;
        console.log('Contact page content blocks:', typedPages.content_blocks);

        // Organize content blocks by type
        const content: any = {};
        typedPages.content_blocks.forEach((block) => {
          switch (block.type) {
            case 'contact_hero':
              content.hero = block;
              break;
            case 'contact_details':
              content.details = block;
              break;
            case 'contact_form':
              content.form = block;
              break;
            case 'contact_faq':
              content.faq = block;
              break;
            case 'contact_business':
              content.business = block;
              break;
          }
        });

        console.log('Organized content:', content);
        setPageContent(content);
      } catch (error) {
        console.error('Error in fetchPageContent:', error);
      }
    };

    fetchPageContent();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('contact-page-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'content_blocks',
          filter: `page_id=eq.(SELECT id FROM pages WHERE slug='contact')`
        },
        (payload) => {
          console.log('Received content block update:', payload);
          fetchPageContent(); // Refresh content when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen pt-20"
    >
      <ContactHero content={pageContent.hero?.content} />
      <ContactDetails content={pageContent.details?.content} />
      <ContactForm content={pageContent.form?.content} />
      <ContactFAQ content={pageContent.faq?.content} />
      <BusinessContact content={pageContent.business?.content} />
    </motion.main>
  );
};

export default Contact;