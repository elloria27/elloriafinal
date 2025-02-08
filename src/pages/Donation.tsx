
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { PreviewPane } from "@/components/admin/page-builder/PreviewPane";
import { ContentBlock, BlockContent } from "@/types/content-blocks";
import { toast } from "sonner";

const Donation = () => {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const { data: fetchedBlocks, error } = await supabase
          .from('content_blocks')
          .select('*')
          .eq('page_id', '9abd64e4-326a-416e-b0d7-edfdd0ecc7fc')
          .order('order_index');

        if (error) {
          throw error;
        }

        // Convert the fetched data to ContentBlock type
        const typedBlocks: ContentBlock[] = fetchedBlocks.map(block => ({
          ...block,
          content: block.content as BlockContent
        }));

        setBlocks(typedBlocks);
      } catch (error) {
        console.error('Error fetching content blocks:', error);
        toast.error("Error loading page content");
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchBlocks();

    // Subscribe to changes
    const channel = supabase
      .channel('content_blocks_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'content_blocks',
          filter: `page_id=eq.9abd64e4-326a-416e-b0d7-edfdd0ecc7fc`
        },
        () => {
          fetchBlocks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <main>
        <PreviewPane 
          blocks={blocks} 
          isAdmin={false} 
          onSelectBlock={() => {}} // Add empty handler for required prop
        />
      </main>
    </div>
  );
};

export default Donation;
