import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ContentBlock, BlockContent } from "@/types/content-blocks";
import { PreviewPane } from "@/components/admin/page-builder/PreviewPane";
import { toast } from "sonner";

export default function DynamicPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        console.log('Fetching page with slug:', slug);
        
        // First fetch the page
        const { data: page, error: pageError } = await supabase
          .from('pages')
          .select('*')
          .eq('slug', slug)
          .eq('is_published', true)
          .single();

        if (pageError || !page) {
          console.error('Error fetching page:', pageError);
          navigate('/404');
          return;
        }

        console.log('Found page:', page);

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
        console.error('Error in fetchPage:', error);
        toast.error("Error loading page");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPage();
  }, [slug, navigate]);

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