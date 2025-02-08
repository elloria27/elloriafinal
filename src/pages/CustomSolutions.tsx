
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Paintbrush, 
  Package, 
  Truck,
  MessageSquare,
  ArrowRight
} from "lucide-react";
import { CustomSolutionsDialog } from "@/components/business/CustomSolutionsDialog";
import { supabase } from "@/integrations/supabase/client";
import { ContentBlock } from "@/types/content-blocks";
import { toast } from "sonner";

const iconMap: Record<string, any> = {
  Paintbrush,
  Package,
  Truck,
  MessageSquare
};

const CustomSolutions = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContentBlocks = async () => {
      try {
        const { data: pageData, error: pageError } = await supabase
          .from('pages')
          .select('id')
          .eq('slug', 'custom-solutions')
          .single();

        if (pageError) throw pageError;

        const { data: blocks, error: blocksError } = await supabase
          .from('content_blocks')
          .select('*')
          .eq('page_id', pageData.id)
          .order('order_index');

        if (blocksError) throw blocksError;

        setBlocks(blocks);
      } catch (error) {
        console.error('Error fetching content blocks:', error);
        toast.error("Failed to load page content");
      } finally {
        setLoading(false);
      }
    };

    fetchContentBlocks();
  }, []);

  const getBlockContent = (type: string) => {
    return blocks.find(block => block.type === type)?.content || null;
  };

  const heroContent = getBlockContent('custom_solutions_hero');
  const servicesContent = getBlockContent('custom_solutions_services');
  const processContent = getBlockContent('custom_solutions_process');
  const ctaContent = getBlockContent('custom_solutions_cta');

  if (loading) {
    return <div className="min-h-screen pt-16 flex items-center justify-center">Loading...</div>;
  }

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen pt-16"
    >
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <h1 className="text-4xl md:text-5xl font-light text-center mb-8">
          {heroContent?.title || "Custom Solutions for Your Business"}
        </h1>
        <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
          {heroContent?.description || "We work closely with businesses to create tailored feminine care solutions."}
        </p>
      </section>

      {/* Services Grid */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {servicesContent?.services?.map((service: any, index: number) => {
              const Icon = iconMap[service.icon] || Package;
              return (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <Icon className="w-12 h-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-3">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-light text-center mb-12">
          {processContent?.title || "Our Custom Solution Process"}
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {processContent?.steps?.map((step: any, index: number) => (
              <div key={index} className="flex items-start gap-4">
                <div className="bg-primary/10 rounded-full p-3">
                  <span className="text-primary font-semibold">{step.number}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-light mb-6">
            {ctaContent?.title || "Ready to Get Started?"}
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            {ctaContent?.description || "Contact us today to discuss your custom solution needs."}
          </p>
          <Button 
            className="bg-primary text-white px-8 py-6 rounded-full hover:bg-primary/90 transition-colors"
            onClick={() => setShowDialog(true)}
          >
            {ctaContent?.buttonText || "Request a Consultation"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <CustomSolutionsDialog 
        open={showDialog}
        onOpenChange={setShowDialog}
      />
    </motion.main>
  );
};

export default CustomSolutions;
