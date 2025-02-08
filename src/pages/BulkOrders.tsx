
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ContentBlock, BulkBenefitsContent, BulkProcessContent, BulkCtaContent } from "@/types/content-blocks";
import { BulkBenefits } from "@/components/bulk/BulkBenefits";
import { BulkProcess } from "@/components/bulk/BulkProcess";
import { BulkCta } from "@/components/bulk/BulkCta";
import { BulkConsultation } from "@/components/bulk/BulkConsultation";
import { toast } from "sonner";

const BulkOrders = () => {
  const [loading, setLoading] = useState(true);
  const [pageContent, setPageContent] = useState<ContentBlock[]>([]);
  const [showConsultationDialog, setShowConsultationDialog] = useState(false);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        console.log('Fetching bulk orders page content...');
        
        // First, get the page ID for bulk-orders
        const { data: pageData, error: pageError } = await supabase
          .from('pages')
          .select('id')
          .eq('slug', 'bulk-orders')
          .single();

        if (pageError) {
          console.error('Error fetching page:', pageError);
          toast.error("Error loading page content");
          return;
        }

        if (!pageData?.id) {
          console.error('Page not found');
          return;
        }

        // Then fetch content blocks for this page
        const { data: blocks, error: blocksError } = await supabase
          .from('content_blocks')
          .select('*')
          .eq('page_id', pageData.id)
          .order('order_index');

        if (blocksError) {
          console.error('Error fetching content blocks:', blocksError);
          toast.error("Error loading page content");
          return;
        }

        console.log('Fetched content blocks:', blocks);
        setPageContent(blocks as ContentBlock[]);
      } catch (error) {
        console.error('Error:', error);
        toast.error("Error loading page content");
      } finally {
        setLoading(false);
      }
    };

    fetchPageContent();
  }, []);

  const getBlockContent = (type: string) => {
    const block = pageContent.find(block => block.type === type);
    return block?.content || null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const benefitsContent = getBlockContent('bulk_benefits') as BulkBenefitsContent;
  const processContent = getBlockContent('bulk_process') as BulkProcessContent;
  const ctaContent = getBlockContent('bulk_cta') as BulkCtaContent;

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen pt-16"
    >
      <BulkBenefits content={benefitsContent} />
      <BulkProcess content={processContent} />
      <BulkCta 
        content={ctaContent} 
        onConsultationClick={() => setShowConsultationDialog(true)} 
      />
      
      <BulkConsultation
        open={showConsultationDialog}
        onOpenChange={setShowConsultationDialog}
      />
    </motion.main>
  );
};

export default BulkOrders;
