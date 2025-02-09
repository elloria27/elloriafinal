
import { useEffect, useState } from "react";
import { PreviewPane } from "@/components/admin/page-builder/PreviewPane";
import { supabase } from "@/integrations/supabase/client";
import { ContentBlock } from "@/types/content-blocks";

export default function Certificates() {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPageContent = async () => {
      try {
        // First get the page ID for the certificates page
        const { data: pageData, error: pageError } = await supabase
          .from('pages')
          .select('id')
          .eq('slug', 'certificates')
          .single();

        if (pageError) throw pageError;

        if (pageData?.id) {
          // Then fetch the content blocks for this page
          const { data: contentBlocks, error: blocksError } = await supabase
            .from('content_blocks')
            .select('*')
            .eq('page_id', pageData.id)
            .order('order_index');

          if (blocksError) throw blocksError;
          
          setBlocks(contentBlocks || []);
        }
      } catch (error) {
        console.error('Error fetching page content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageContent();

    // Set up real-time subscription for content updates
    const subscription = supabase
      .channel('content_blocks_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'content_blocks'
        },
        () => {
          fetchPageContent();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PreviewPane 
        blocks={blocks}
        onSelectBlock={() => {}}
        selectedBlockId={null}
      />
    </div>
  );
}
