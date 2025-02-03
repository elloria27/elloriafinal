import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ComponentPicker } from "./ComponentPicker";
import { PropertyEditor } from "./PropertyEditor";
import { PreviewPane } from "./PreviewPane";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ContentBlock, BlockType, BlockContent } from "@/types/content-blocks";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { GripVertical, Trash2, Edit2 } from "lucide-react";
import { Database } from "@/integrations/supabase/types";

type ContentBlockRow = Database['public']['Tables']['content_blocks']['Row'];
type DbBlockType = ContentBlockRow['type'];

interface PageBuilderProps {
  pageId: string;
  initialBlocks: ContentBlock[];
}

export const PageBuilder = ({ pageId, initialBlocks }: PageBuilderProps) => {
  const [blocks, setBlocks] = useState<ContentBlock[]>(initialBlocks);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showComponentPicker, setShowComponentPicker] = useState(false);

  useEffect(() => {
    console.log('PageBuilder mounted with blocks:', initialBlocks);
  }, [initialBlocks]);

  const handleAddBlock = async (type: BlockType) => {
    try {
      const newBlock: ContentBlockRow = {
        id: crypto.randomUUID(),
        type: type as DbBlockType,
        content: {},
        order_index: blocks.length,
        page_id: pageId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      console.log('Adding new block:', newBlock);

      const { error } = await supabase
        .from('content_blocks')
        .insert([newBlock]);

      if (error) throw error;

      setBlocks([...blocks, newBlock as ContentBlock]);
      setShowComponentPicker(false);
      toast.success("Component added successfully");
    } catch (error) {
      console.error('Error adding block:', error);
      toast.error("Failed to add component");
    }
  };

  const handleUpdateBlock = async (blockId: string, content: BlockContent) => {
    try {
      console.log('Updating block:', blockId, 'with content:', content);

      const { error } = await supabase
        .from('content_blocks')
        .update({ content })
        .eq('id', blockId);

      if (error) throw error;

      setBlocks(blocks.map(block => 
        block.id === blockId ? { ...block, content } : block
      ));

      toast.success("Content updated successfully");
    } catch (error) {
      console.error('Error updating block:', error);
      toast.error("Failed to update content");
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    if (!confirm("Are you sure you want to delete this component?")) {
      return;
    }

    try {
      console.log('Deleting block:', blockId);

      const { error } = await supabase
        .from('content_blocks')
        .delete()
        .eq('id', blockId);

      if (error) throw error;

      setBlocks(blocks.filter(block => block.id !== blockId));
      if (selectedBlockId === blockId) {
        setSelectedBlockId(null);
        setIsEditing(false);
      }
      toast.success("Component deleted successfully");
    } catch (error) {
      console.error('Error deleting block:', error);
      toast.error("Failed to delete component");
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedBlocks = items.map((block, index) => ({
      ...block,
      order_index: index,
    }));

    try {
      console.log('Reordering blocks:', updatedBlocks);

      const updateData: ContentBlockRow[] = updatedBlocks.map(({ id, order_index, type, content, page_id }) => ({
        id,
        order_index,
        type: type as DbBlockType,
        content,
        page_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('content_blocks')
        .upsert(updateData);

      if (error) throw error;

      setBlocks(updatedBlocks);
      toast.success("Order updated successfully");
    } catch (error) {
      console.error('Error updating block order:', error);
      toast.error("Failed to update order");
    }
  };

  const handleEditClick = (blockId: string) => {
    console.log('Editing block:', blockId);
    setSelectedBlockId(blockId);
    setIsEditing(true);
  };

  const handleSelectBlock = (block: ContentBlock) => {
    setSelectedBlockId(block.id);
    setIsEditing(true);
  };

  const selectedBlock = blocks.find(block => block.id === selectedBlockId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Page Components</h3>
          <Button
            variant="outline"
            onClick={() => setShowComponentPicker(true)}
          >
            Add Component
          </Button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="blocks">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
              >
                {blocks
                  .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
                  .map((block, index) => (
                    <Draggable
                      key={block.id}
                      draggableId={block.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`p-4 border rounded-lg bg-white shadow-sm ${
                            selectedBlockId === block.id ? 'ring-2 ring-primary' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div {...provided.dragHandleProps}>
                                <GripVertical className="h-5 w-5 text-gray-400" />
                              </div>
                              <span className="font-medium">{block.type}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditClick(block.id)}
                              >
                                <Edit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteBlock(block.id)}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {showComponentPicker && (
          <ComponentPicker
            open={showComponentPicker}
            onSelect={handleAddBlock}
            onClose={() => setShowComponentPicker(false)}
          />
        )}
      </div>

      <div className="space-y-6">
        {isEditing && selectedBlock ? (
          <PropertyEditor
            block={selectedBlock}
            onUpdate={handleUpdateBlock}
          />
        ) : (
          <PreviewPane 
            blocks={blocks}
            onSelectBlock={handleSelectBlock}
          />
        )}
      </div>
    </div>
  );
};