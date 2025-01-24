import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Plus, Save } from "lucide-react";
import { ComponentPicker } from "./ComponentPicker";
import { PropertyEditor } from "./PropertyEditor";
import { PreviewPane } from "./PreviewPane";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { BlockType, ContentBlock } from "@/types/content-blocks";
import { Json } from "@/integrations/supabase/types";

interface PageBuilderProps {
  pageId: string;
  initialBlocks: ContentBlock[];
}

interface SupabaseContentBlock {
  id: string;
  page_id: string;
  type: BlockType;
  content: Json;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export const PageBuilder = ({ pageId, initialBlocks }: PageBuilderProps) => {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<ContentBlock | null>(null);
  const [showComponentPicker, setShowComponentPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('PageBuilder mounted with pageId:', pageId);
    console.log('Initial blocks:', initialBlocks);
    if (initialBlocks && initialBlocks.length > 0) {
      console.log('Setting initial blocks');
      setBlocks(initialBlocks);
    } else {
      fetchPageBlocks();
    }
    setIsLoading(false);
  }, [pageId, initialBlocks]);

  const fetchPageBlocks = async () => {
    try {
      console.log('Fetching blocks for page:', pageId);
      const { data: blocksData, error } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('page_id', pageId)
        .order('order_index');

      if (error) {
        console.error('Error fetching blocks:', error);
        throw error;
      }

      console.log('Fetched blocks:', blocksData);
      
      // Transform the Supabase data to match ContentBlock type
      const transformedBlocks: ContentBlock[] = (blocksData as SupabaseContentBlock[])?.map(block => ({
        id: block.id,
        type: block.type,
        content: block.content as ContentBlock['content'],
        order_index: block.order_index
      })) || [];

      setBlocks(transformedBlocks);
    } catch (error) {
      console.error('Error fetching blocks:', error);
      toast.error("Failed to load page content");
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedBlocks = items.map((block, index) => ({
      ...block,
      order_index: index,
    }));

    setBlocks(updatedBlocks);
  };

  const handleAddBlock = async (blockType: BlockType) => {
    const newBlock: ContentBlock = {
      id: crypto.randomUUID(),
      type: blockType,
      content: {},
      order_index: blocks.length,
    };

    try {
      console.log('Adding new block:', newBlock);
      const { error } = await supabase
        .from('content_blocks')
        .insert({
          id: newBlock.id,
          page_id: pageId,
          type: blockType,
          content: newBlock.content,
          order_index: blocks.length,
        });

      if (error) throw error;

      setBlocks([...blocks, newBlock]);
      setShowComponentPicker(false);
      setSelectedBlock(newBlock);
      toast.success("Block added successfully");
    } catch (error) {
      console.error('Error adding block:', error);
      toast.error("Failed to add block");
    }
  };

  const handleUpdateBlock = async (blockId: string, content: ContentBlock['content']) => {
    try {
      console.log('Updating block:', blockId, content);
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
      console.log('Saving layout for page:', pageId);
      console.log('Blocks to save:', blocks);

      // Update order_index for each block in content_blocks table
      const updatePromises = blocks.map((block, index) => 
        supabase
          .from('content_blocks')
          .update({ order_index: index })
          .eq('id', block.id)
      );

      await Promise.all(updatePromises);

      // Convert ContentBlock[] to Json[] for database storage
      const blocksForStorage: Json[] = blocks.map(block => ({
        id: block.id,
        type: block.type,
        content: block.content,
        order_index: block.order_index
      }));

      const { error } = await supabase
        .from('pages')
        .update({
          content_blocks: blocksForStorage,
          updated_at: new Date().toISOString()
        })
        .eq('id', pageId);

      if (error) throw error;
      toast.success("Layout saved successfully");
    } catch (error) {
      console.error('Error saving layout:', error);
      toast.error("Failed to save layout");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

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
        <PreviewPane 
          blocks={blocks} 
          onSelectBlock={setSelectedBlock}
        />
      </div>

      {selectedBlock && (
        <div className="w-80 bg-gray-100 p-4 border-l">
          <PropertyEditor
            block={selectedBlock}
            onUpdate={(content) => handleUpdateBlock(selectedBlock.id, content)}
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
