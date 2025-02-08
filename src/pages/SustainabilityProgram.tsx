
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ContentBlock, BlockContent } from "@/types/content-blocks";
import { toast } from "sonner";
import { SustainabilityRegistrationDialog } from "@/components/sustainability/SustainabilityRegistrationDialog";

const SustainabilityProgram = () => {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        console.log('Fetching sustainability program content...');
        
        // Get the page ID for the sustainability-program slug
        const { data: pageData, error: pageError } = await supabase
          .from('pages')
          .select('id')
          .eq('slug', 'sustainability-program')
          .maybeSingle();

        if (pageError) {
          console.error('Error fetching page:', pageError);
          toast.error("Error loading page content");
          return;
        }

        if (!pageData) {
          console.log('No page found with slug: sustainability-program');
          setBlocks([]);
          return;
        }

        console.log('Page ID:', pageData.id);

        // Fetch the content blocks for this page
        const { data: blocksData, error: blocksError } = await supabase
          .from('content_blocks')
          .select('*')
          .eq('page_id', pageData.id)
          .order('order_index');

        if (blocksError) {
          console.error('Error fetching content blocks:', blocksError);
          toast.error("Error loading page content");
          return;
        }

        console.log('Content blocks:', blocksData);

        // Transform the blocks data to match ContentBlock type
        const transformedBlocks = blocksData?.map(block => ({
          ...block,
          content: block.content as BlockContent
        })) || [];

        setBlocks(transformedBlocks);
      } catch (error) {
        console.error('Error:', error);
        toast.error("Error loading page content");
      } finally {
        setLoading(false);
      }
    };

    fetchPageContent();

    // Subscribe to real-time updates
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'content_blocks' },
        () => {
          console.log('Content blocks updated, refreshing...');
          fetchPageContent();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const renderBlock = (block: ContentBlock) => {
    switch (block.type) {
      case "sustainability_program_hero":
        return (
          <section className="bg-gradient-to-b from-green-50 to-white py-16 md:py-24">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-3xl mx-auto">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                  {block.content.title}
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  {block.content.description}
                </p>
                <button 
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg inline-flex items-center space-x-2"
                  onClick={() => setIsDialogOpen(true)}
                >
                  {block.content.buttonText}
                </button>
              </div>
            </div>
          </section>
        );
      case "sustainability_program_benefits":
        return (
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">{block.content.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {block.content.benefits?.map((benefit, index) => (
                  <div key={index} className="p-6 border rounded-lg shadow-sm">
                    <div className="h-12 w-12 text-primary mb-4">
                      {/* You can add icon rendering here based on benefit.icon */}
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );
      case "sustainability_program_process":
        return (
          <section className="bg-gray-50 py-16 md:py-24">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">{block.content.title}</h2>
              <div className="max-w-3xl mx-auto space-y-8">
                {block.content.steps?.map((step, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                      {step.number}
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
        );
      case "sustainability_program_cta":
        return (
          <section className="py-16 md:py-24">
            <div className="container mx-auto px-4">
              <div className="bg-primary text-white rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-6">{block.content.title}</h2>
                <p className="text-lg mb-8 opacity-90">{block.content.description}</p>
                <button 
                  className="bg-white text-primary hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold"
                  onClick={() => setIsDialogOpen(true)}
                >
                  {block.content.buttonText}
                </button>
              </div>
            </div>
          </section>
        );
      default:
        console.warn(`Unknown block type: ${block.type}`);
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <SustainabilityRegistrationDialog 
        open={isDialogOpen} 
        onOpenChange={setIsDialogOpen} 
      />
      {blocks.map((block) => (
        <div key={block.id}>
          {renderBlock(block)}
        </div>
      ))}
    </div>
  );
};

export default SustainabilityProgram;
