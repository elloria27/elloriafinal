import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ContentBlock, BlockContent, BlockType } from "@/types/content-blocks";
import { PreviewPane } from "./PreviewPane";
import { ComponentPicker } from "./ComponentPicker";
import { PropertyEditor } from "./PropertyEditor";

interface PageBuilderProps {
  pageId: string;
  initialBlocks: ContentBlock[];
}

export const PageBuilder = ({ pageId, initialBlocks }: PageBuilderProps) => {
  const [blocks, setBlocks] = useState<ContentBlock[]>(initialBlocks);
  const [selectedBlock, setSelectedBlock] = useState<ContentBlock | null>(null);
  const [isComponentPickerOpen, setIsComponentPickerOpen] = useState(false);

  useEffect(() => {
    console.log('PageBuilder mounted with blocks:', initialBlocks);
  }, [initialBlocks]);

  const handleBlockSelect = (block: ContentBlock) => {
    console.log('Selected block:', block);
    setSelectedBlock(block);
  };

  const handleBlockUpdate = async (blockId: string, content: BlockContent) => {
    try {
      console.log('Updating block:', blockId, content);
      
      const { error } = await supabase
        .from('content_blocks')
        .update({
          content,
          updated_at: new Date().toISOString()
        })
        .eq('id', blockId);

      if (error) throw error;

      setBlocks(blocks.map(block => 
        block.id === blockId ? { ...block, content } : block
      ));
      
      toast.success("Block updated successfully");
    } catch (error) {
      console.error('Error updating block:', error);
      toast.error("Failed to update block");
    }
  };

  const handleMoveBlock = async (blockId: string, direction: 'up' | 'down') => {
    try {
      const currentIndex = blocks.findIndex(block => block.id === blockId);
      if (currentIndex === -1) return;

      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= blocks.length) return;

      const newBlocks = [...blocks];
      const [movedBlock] = newBlocks.splice(currentIndex, 1);
      newBlocks.splice(newIndex, 0, movedBlock);

      // Update order_index for affected blocks
      const updatedBlocks = newBlocks.map((block, index) => ({
        ...block,
        order_index: index
      }));

      // Prepare the data for Supabase update
      const updateData = updatedBlocks.map(block => ({
        id: block.id,
        type: block.type,
        content: block.content,
        order_index: block.order_index,
        updated_at: new Date().toISOString()
      }));

      // Update database
      const { error } = await supabase
        .from('content_blocks')
        .upsert(updateData);

      if (error) throw error;

      setBlocks(updatedBlocks);
      toast.success(`Block moved ${direction}`);
    } catch (error) {
      console.error('Error moving block:', error);
      toast.error("Failed to move block");
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    try {
      const { error } = await supabase
        .from('content_blocks')
        .delete()
        .eq('id', blockId);

      if (error) throw error;

      setBlocks(blocks.filter(block => block.id !== blockId));
      if (selectedBlock?.id === blockId) {
        setSelectedBlock(null);
      }
      
      toast.success("Block deleted successfully");
    } catch (error) {
      console.error('Error deleting block:', error);
      toast.error("Failed to delete block");
    }
  };

  const handleAddBlock = async (type: BlockType) => {
    try {
      const newBlock = {
        page_id: pageId,
        type,
        content: {},
        order_index: blocks.length
      };

      const { data, error } = await supabase
        .from('content_blocks')
        .insert([newBlock])
        .select()
        .single();

      if (error) throw error;

      setBlocks([...blocks, data as ContentBlock]);
      setIsComponentPickerOpen(false);
      toast.success("Block added successfully");
    } catch (error) {
      console.error('Error adding block:', error);
      toast.error("Failed to add block");
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Button onClick={() => setIsComponentPickerOpen(true)}>
          Add Component
        </Button>

        <PreviewPane
          blocks={blocks}
          onSelectBlock={handleBlockSelect}
          onMoveBlock={handleMoveBlock}
          onDeleteBlock={handleDeleteBlock}
        />

        <ComponentPicker
          open={isComponentPickerOpen}
          onClose={() => setIsComponentPickerOpen(false)}
          onSelect={handleAddBlock}
        />
      </div>

      <div className="lg:col-span-1">
        {selectedBlock && (
          <PropertyEditor
            block={selectedBlock}
            onUpdate={handleBlockUpdate}
          />
        )}
      </div>
    </div>
  );
};