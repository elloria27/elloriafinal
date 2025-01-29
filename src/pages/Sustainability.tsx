import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Recycle, TreePine, PackageCheck, Factory, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { ContentBlock } from "@/types/content-blocks";
import { Sustainability } from "@/components/Sustainability";

const SustainabilityPage = () => {
  const [contentBlocks, setContentBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        // First get the page ID for the sustainability page
        const { data: pageData, error: pageError } = await supabase
          .from('pages')
          .select('id')
          .eq('slug', 'sustainability')
          .single();

        if (pageError) {
          console.error('Error fetching page:', pageError);
          return;
        }

        if (!pageData?.id) {
          console.log('Sustainability page not found');
          return;
        }

        // Then fetch the content blocks for this page
        const { data: blocks, error: blocksError } = await supabase
          .from('content_blocks')
          .select('*')
          .eq('page_id', pageData.id)
          .order('order_index');

        if (blocksError) {
          console.error('Error fetching content blocks:', blocksError);
          return;
        }

        console.log('Fetched content blocks:', blocks);
        setContentBlocks(blocks as ContentBlock[]);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPageContent();
  }, []);

  // Find the sustainability block content
  const sustainabilityBlock = contentBlocks.find(block => block.type === 'sustainability');

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen pt-20">
      {sustainabilityBlock ? (
        <Sustainability content={sustainabilityBlock.content} />
      ) : (
        // Fallback to static content if no dynamic content is found
        <Sustainability />
      )}
    </div>
  );
};

export default SustainabilityPage;