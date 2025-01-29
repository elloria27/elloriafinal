import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ContentBlock } from "@/types/content-blocks";
import { toast } from "sonner";

const SustainabilityPage = () => {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        const { data: pages, error } = await supabase
          .from('pages')
          .select('content_blocks')
          .eq('slug', 'sustainability')
          .single();

        if (error) throw error;

        if (pages?.content_blocks) {
          const { data: contentBlocks, error: blocksError } = await supabase
            .from('content_blocks')
            .select('*')
            .eq('page_id', pages.id)
            .order('order_index');

          if (blocksError) throw blocksError;

          setBlocks(contentBlocks || []);
        }
      } catch (error) {
        console.error('Error fetching page content:', error);
        toast.error("Error loading page content");
      } finally {
        setLoading(false);
      }
    };

    fetchPageContent();
  }, []);

  const renderBlock = (block: ContentBlock) => {
    switch (block.type) {
      case 'sustainability_hero':
        return (
          <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center bg-gradient-to-b from-accent-green/30 to-white overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img
                src={block.content.backgroundImage || "/lovable-uploads/033d3c83-3a91-4fee-a121-d5e700b8768d.png"}
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
                  {block.content.title || "Caring for Women, Caring for the Planet"}
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-8">
                {block.content.subtitle || "Discover how Elloria is leading the way in sustainable feminine care"}
              </p>
              <Link
                to={block.content.buttonLink || "/shop"}
                className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 rounded-full hover:bg-primary/90 transition-colors"
              >
                {block.content.buttonText || "Shop Now"}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </section>
        );

      case 'sustainability_mission':
        return (
          <section className="py-20 bg-white">
            <div className="container px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-3xl mx-auto text-center"
              >
                <h2 className="text-4xl font-bold mb-6">{block.content.title || "Our Sustainability Mission"}</h2>
                <p className="text-gray-600 mb-12">{block.content.description}</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {(block.content.stats || []).map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <div className="text-primary mb-4">{stat.icon}</div>
                    <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                    <h3 className="text-xl font-semibold mb-3">{stat.label}</h3>
                    <p className="text-gray-600">{stat.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'sustainability_materials':
        return (
          <section className="py-20 bg-accent-green/10">
            <div className="container px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl font-bold mb-6">{block.content.title || "Sustainable Materials"}</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {block.content.description}
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                {(block.content.materials || []).map((material, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.2 }}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <div className="text-primary mb-4">{material.icon}</div>
                    <h3 className="text-lg font-semibold mb-2">{material.title}</h3>
                    <p className="text-gray-600">{material.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'sustainability_faq':
        return (
          <section className="py-20 bg-white">
            <div className="container px-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl font-bold mb-6">{block.content.title || "Frequently Asked Questions"}</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  {block.content.description}
                </p>
              </motion.div>

              <div className="max-w-3xl mx-auto">
                <Accordion type="single" collapsible className="w-full">
                  {(block.content.faqs || []).map((faq, index) => (
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
        );

      default:
        return null;
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
    <div className="min-h-screen pt-20">
      {blocks.map((block) => (
        <div key={block.id}>
          {renderBlock(block)}
        </div>
      ))}
    </div>
  );
};

export default SustainabilityPage;