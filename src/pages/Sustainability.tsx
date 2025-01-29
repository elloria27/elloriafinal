import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sustainability as SustainabilityComponent } from "@/components/Sustainability";
import { supabase } from "@/integrations/supabase/client";
import { ContentBlock, SustainabilityContent } from "@/types/content-blocks";

const SustainabilityPage = () => {
  const [sustainabilityBlock, setSustainabilityBlock] = useState<ContentBlock | null>(null);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        // First, get the page ID for the sustainability page
        const { data: pages, error: pageError } = await supabase
          .from('pages')
          .select('id')
          .eq('slug', 'sustainability')
          .single();

        if (pageError) {
          console.error('Error fetching page:', pageError);
          return;
        }

        if (!pages) {
          console.log('No sustainability page found');
          return;
        }

        // Then fetch the sustainability content block for this page
        const { data: blocks, error: blocksError } = await supabase
          .from('content_blocks')
          .select('*')
          .eq('page_id', pages.id)
          .eq('type', 'sustainability')
          .order('order_index')
          .single();

        if (blocksError) {
          console.error('Error fetching content blocks:', blocksError);
          return;
        }

        // Type assertion to ensure the content is treated as SustainabilityContent
        if (blocks) {
          const typedBlock: ContentBlock = {
            ...blocks,
            content: blocks.content as SustainabilityContent
          };
          console.log('Fetched and typed sustainability block:', typedBlock);
          setSustainabilityBlock(typedBlock);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchPageContent();
  }, []);

  const faqs = [
    {
      question: "Are Elloria pads biodegradable?",
      answer: "Our pads are made with 72% recyclable materials and we're constantly working to increase this percentage. While not fully biodegradable yet, we're committed to developing more eco-friendly solutions."
    },
    {
      question: "How should I dispose of used pads?",
      answer: "We recommend wrapping used pads in their original wrapper or recycled paper before disposing. The packaging can be recycled separately."
    },
    {
      question: "What makes Elloria different from other brands?",
      answer: "Elloria combines premium quality with environmental responsibility. Our products use 72% recyclable materials, minimal packaging, and are produced in facilities that prioritize sustainable practices."
    }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center bg-gradient-to-b from-accent-green/30 to-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/lovable-uploads/033d3c83-3a91-4fee-a121-d5e700b8768d.png"
            alt="Nature background"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container relative z-10 text-center px-4"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-primary to-green-600 bg-clip-text text-transparent">
              Caring for Women, Caring for the Planet
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover how Elloria is leading the way in sustainable feminine care
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full hover:bg-primary/90 transition-colors"
          >
            Shop Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Sustainability Component */}
      <SustainabilityComponent content={sustainabilityBlock?.content as SustainabilityContent} />

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get answers to common questions about our sustainable practices and products.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-b from-accent-green/10 to-white">
        <div className="container px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-6">Join Our Sustainable Journey</h2>
            <p className="text-gray-600 mb-8">
              Subscribe to our newsletter for updates on our latest sustainability initiatives and eco-friendly products.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full hover:bg-primary/90 transition-colors"
            >
              Discover Our Eco-Friendly Products
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default SustainabilityPage;