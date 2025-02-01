import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ContentBlock, FeatureItem, FeaturesContent, HeroContent, ContactFormContent } from "@/types/content-blocks";
import { BulkConsultationDialog } from "@/components/business/BulkConsultationDialog";

const BulkOrders = () => {
  const [loading, setLoading] = useState(true);
  const [pageContent, setPageContent] = useState<ContentBlock[]>([]);
  const [showConsultationDialog, setShowConsultationDialog] = useState(false);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        // First, get the page ID for bulk-orders
        const { data: pageData, error: pageError } = await supabase
          .from('pages')
          .select('id')
          .eq('slug', 'bulk-orders')
          .single();

        if (pageError) {
          console.error('Error fetching page:', pageError);
          return;
        }

        if (!pageData?.id) {
          console.error('Page not found');
          return;
        }

        console.log('Found page ID:', pageData.id);

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
    const block = pageContent.find(block => block.type === type);
    return block?.content || null;
  };

  const heroContent = getBlockContent('hero') as HeroContent | null;
  const whyChooseContent = getBlockContent('features') as FeaturesContent | null;
  const howItWorksContent = pageContent
    .filter(block => block.type === 'features')[1]?.content as FeaturesContent | null;
  const ctaContent = getBlockContent('contact_form') as ContactFormContent | null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen pt-16"
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-accent-purple/30 to-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl md:text-5xl font-light mb-6"
            >
              {heroContent?.title || 'Bulk Orders for Your Business'}
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 text-lg mb-8"
            >
              {heroContent?.subtitle || 'Get premium feminine care products at competitive wholesale prices'}
            </motion.p>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90"
                onClick={() => setShowConsultationDialog(true)}
              >
                Request a Quote
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-light text-center mb-12">
            {whyChooseContent?.title || 'Why Choose Bulk Orders?'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(whyChooseContent?.features as FeatureItem[] || []).map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 * index }}
                className="p-6 rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-accent-green/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-light text-center mb-12">
            {howItWorksContent?.title || 'How It Works'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(howItWorksContent?.features as FeatureItem[] || []).map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <span className="text-xl font-semibold">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-light mb-6">
              {ctaContent?.title || 'Ready to Get Started?'}
            </h2>
            <p className="text-gray-600 mb-8">
              {ctaContent?.description || 'Join other organizations that trust Elloria for their feminine care needs.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                {ctaContent?.buttonText || 'Request a Quote'}
              </Button>
              <Button size="lg" variant="outline">
                {ctaContent?.secondaryButtonText || 'Learn More'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <BulkConsultationDialog 
        open={showConsultationDialog} 
        onOpenChange={setShowConsultationDialog}
      />
    </motion.main>
  );
};

export default BulkOrders;
