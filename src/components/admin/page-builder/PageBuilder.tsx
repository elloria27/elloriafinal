import { useState, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ComponentPicker } from "./ComponentPicker";
import { PropertyEditor } from "./PropertyEditor";
import { PreviewPane } from "./PreviewPane";
import { ContentBlock } from "@/types/content-blocks";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface PageBuilderProps {
  pageId: string;
  initialBlocks: ContentBlock[];
}

export const PageBuilder = ({ pageId, initialBlocks }: PageBuilderProps) => {
  const [blocks, setBlocks] = useState<ContentBlock[]>(initialBlocks);
  const [selectedBlock, setSelectedBlock] = useState<ContentBlock | null>(null);
  const [isComponentPickerOpen, setIsComponentPickerOpen] = useState(false);

  const handleDragEnd = useCallback(async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order_index for all blocks
    const updatedBlocks = items.map((block, index) => ({
      ...block,
      order_index: index,
    }));

    setBlocks(updatedBlocks);

    try {
      // Update the order in the database
      const { error } = await supabase.from('content_blocks')
        .upsert(
          updatedBlocks.map(block => ({
            id: block.id,
            page_id: pageId,
            type: block.type,
            content: block.content,
            order_index: block.order_index
          }))
        );

      if (error) throw error;
      toast.success("Block order updated");
    } catch (error) {
      console.error('Error updating block order:', error);
      toast.error("Failed to update block order");
    }
  }, [blocks, pageId]);

  const handleAddBlock = async (blockType: string) => {
    try {
      const newBlock = {
        type: blockType,
        content: {},
        order_index: blocks.length,
        page_id: pageId
      };

      const { data, error } = await supabase
        .from('content_blocks')
        .insert([newBlock])
        .select()
        .single();

      if (error) throw error;

      setBlocks([...blocks, data]);
      setSelectedBlock(data);
      setIsComponentPickerOpen(false);
      toast.success("Block added successfully");
    } catch (error) {
      console.error('Error adding block:', error);
      toast.error("Failed to add block");
    }
  };

  const handleUpdateBlock = async (blockId: string, content: any) => {
    try {
      const { error } = await supabase
        .from('content_blocks')
        .update({ content })
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8">
        <div className="space-y-4">
          <Dialog open={isComponentPickerOpen} onOpenChange={setIsComponentPickerOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Component
              </Button>
            </DialogTrigger>
            <ComponentPicker onSelect={handleAddBlock} />
          </Dialog>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="blocks">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-4"
                >
                  <PreviewPane
                    blocks={blocks}
                    onSelectBlock={setSelectedBlock}
                    selectedBlockId={selectedBlock?.id}
                    onDeleteBlock={handleDeleteBlock}
                    isAdmin={true}
                  />
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>

      <div className="lg:col-span-4">
        {selectedBlock && (
          <div className="sticky top-4">
            <PropertyEditor
              block={selectedBlock}
              onUpdate={handleUpdateBlock}
            />
          </div>
        )}
      </div>
    </div>
  );
};