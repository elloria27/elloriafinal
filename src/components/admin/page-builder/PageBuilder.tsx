import { useState } from "react";
import { motion } from "framer-motion";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Plus, Save } from "lucide-react";
import { ComponentPicker } from "./ComponentPicker";
import { PropertyEditor } from "./PropertyEditor";
import { PreviewPane } from "./PreviewPane";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PageBuilderProps {
  pageId: string;
  initialBlocks: ContentBlock[];
}

export interface ContentBlock {
  id: string;
  type: string;
  content: any;
  order_index: number;
}

export const PageBuilder = ({ pageId, initialBlocks }: PageBuilderProps) => {
  const [blocks, setBlocks] = useState<ContentBlock[]>(initialBlocks);
  const [selectedBlock, setSelectedBlock] = useState<ContentBlock | null>(null);
  const [showComponentPicker, setShowComponentPicker] = useState(false);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order_index for each block
    const updatedBlocks = items.map((block, index) => ({
      ...block,
      order_index: index,
    }));

    setBlocks(updatedBlocks);
  };

  const handleAddBlock = async (blockType: string) => {
    const newBlock = {
      id: crypto.randomUUID(),
      type: blockType,
      content: {},
      order_index: blocks.length,
    };

    try {
      const { error } = await supabase
        .from('content_blocks')
        .insert([{
          page_id: pageId,
          type: blockType,
          content: {},
          order_index: blocks.length,
        }]);

      if (error) throw error;

      setBlocks([...blocks, newBlock]);
      setShowComponentPicker(false);
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

  const handleSaveLayout = async () => {
    try {
      // Update order indices in database
      const updates = blocks.map((block, index) => ({
        id: block.id,
        order_index: index,
      }));

      const { error } = await supabase
        .from('content_blocks')
        .upsert(updates);

      if (error) throw error;
      toast.success("Layout saved successfully");
    } catch (error) {
      console.error('Error saving layout:', error);
      toast.error("Failed to save layout");
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="w-64 bg-gray-100 p-4 border-r">
        <Button 
          onClick={() => setShowComponentPicker(true)}
          className="w-full mb-4"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Component
        </Button>
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="blocks">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {blocks.map((block, index) => (
                  <Draggable 
                    key={block.id} 
                    draggableId={block.id} 
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`p-3 bg-white rounded-lg shadow cursor-pointer ${
                          selectedBlock?.id === block.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setSelectedBlock(block)}
                      >
                        {block.type}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <div className="flex-1 overflow-auto">
        <PreviewPane blocks={blocks} />
      </div>

      {selectedBlock && (
        <div className="w-80 bg-gray-100 p-4 border-l">
          <PropertyEditor
            block={selectedBlock}
            onUpdate={handleUpdateBlock}
          />
        </div>
      )}

      <ComponentPicker
        open={showComponentPicker}
        onClose={() => setShowComponentPicker(false)}
        onSelect={handleAddBlock}
      />

      <Button
        className="fixed bottom-4 right-4"
        onClick={handleSaveLayout}
      >
        <Save className="w-4 h-4 mr-2" />
        Save Layout
      </Button>
    </div>
  );
};