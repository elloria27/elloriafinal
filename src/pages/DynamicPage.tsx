
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ContentBlock, BlockContent } from "@/types/content-blocks";
import { PreviewPane } from "@/components/admin/page-builder/PreviewPane";
import { toast } from "sonner";
import debounce from "lodash/debounce";

export default function DynamicPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageId, setPageId] = useState<string | null>(null);

  // Fetch page and its content blocks
  const fetchPageContent = useCallback(async () => {
    if (!slug) return;

    try {
      console.log('Fetching page with slug:', slug);
      
      // First fetch the page
      const { data: page, error: pageError } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (pageError) {
        console.error('Error fetching page:', pageError);
        toast.error("Error loading page");
        return;
      }

      if (!page) {
        console.log('Page not found');
        navigate('/404');
        return;
      }

      console.log('Found page:', page);
      setPageId(page.id);

      // Then fetch the content blocks for this page
      const { data: contentBlocks, error: blocksError } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('page_id', page.id)
        .order('order_index');

      if (blocksError) {
        console.error('Error fetching content blocks:', blocksError);
        toast.error("Error loading page content");
        return;
      }

      console.log('Found content blocks:', contentBlocks);
      
      if (contentBlocks) {
        // Transform the content to match ContentBlock type
        const typedBlocks: ContentBlock[] = contentBlocks.map(block => ({
          ...block,
          content: block.content as BlockContent
        }));
        setBlocks(typedBlocks);
      }
    } catch (error) {
      console.error('Error in fetchPageContent:', error);
      toast.error("Error loading page");
    } finally {
      setIsLoading(false);
    }
  }, [slug, navigate]);

  // Debounced version of fetchPageContent to prevent multiple rapid refreshes
  const debouncedFetch = useCallback(
    debounce(() => {
      console.log('Executing debounced fetch...');
      fetchPageContent();
    }, 300),
    [fetchPageContent]
  );

  // Handle real-time updates
  const handleRealtimeUpdate = useCallback((payload: any) => {
    console.log('Received real-time update:', payload);
    
    // Only refresh if the update is for the current page
    if (payload.new?.page_id === pageId) {
      console.log('Update is for current page, triggering refresh');
      debouncedFetch();
    } else {
      console.log('Update is for a different page, ignoring');
    }
  }, [pageId, debouncedFetch]);

  // Set up real-time subscription
  useEffect(() => {
    if (!pageId) return;

    console.log('Setting up real-time subscription for page:', pageId);

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'content_blocks',
          filter: `page_id=eq.${pageId}`,
        },
        handleRealtimeUpdate
      )
      .subscribe((status) => {
        console.log('Subscription status:', status);
        
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to content changes');
        }
      });

    // Clean up subscription on unmount or when pageId changes
    return () => {
      console.log('Cleaning up real-time subscription');
      supabase.removeChannel(channel);
    };
  }, [pageId, handleRealtimeUpdate]);

  // Initial fetch when page loads or slug changes
  useEffect(() => {
    if (!slug) return;
    setIsLoading(true);
    fetchPageContent();
  }, [slug, fetchPageContent]);

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
