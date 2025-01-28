import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Plus, Save, Trash2 } from "lucide-react";
import { ComponentPicker } from "./ComponentPicker";
import { PropertyEditor } from "./PropertyEditor";
import { PreviewPane } from "./PreviewPane";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { BlockType, ContentBlock, BlockContent } from "@/types/content-blocks";
import { Database } from "@/integrations/supabase/types";

export interface PageBuilderProps {
  pageId: string;
  initialBlocks: ContentBlock[];
}

type ContentBlockType = Database['public']['Tables']['content_blocks']['Row'];
type ContentBlockInsert = Database['public']['Tables']['content_blocks']['Insert'];

export const PageBuilder = ({ pageId, initialBlocks }: PageBuilderProps) => {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<ContentBlock | null>(null);
  const [showComponentPicker, setShowComponentPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeBlocks = async () => {
      console.log('Initializing blocks for page:', pageId);
      try {
        const { data: dbBlocks, error } = await supabase
          .from('content_blocks')
          .select('*')
          .eq('page_id', pageId)
          .order('order_index');

        if (error) {
          console.error('Error fetching blocks from DB:', error);
          throw error;
        }

        console.log('Blocks from DB:', dbBlocks);

        if (dbBlocks && dbBlocks.length > 0) {
          const transformedBlocks: ContentBlock[] = dbBlocks.map(block => ({
            id: block.id,
            type: block.type as BlockType,
            content: block.content as BlockContent,
            order_index: block.order_index,
            page_id: block.page_id,
            created_at: block.created_at,
            updated_at: block.updated_at
          }));
          console.log('Setting blocks from DB:', transformedBlocks);
          setBlocks(transformedBlocks);
        } else if (initialBlocks && initialBlocks.length > 0) {
          console.log('No blocks in DB, using initial blocks:', initialBlocks);
          const savedBlocks = await Promise.all(
            initialBlocks.map(async (block, index) => {
              const insertData: ContentBlockInsert = {
                id: block.id,
                page_id: pageId,
                type: block.type as Database['public']['Enums']['content_block_type'],
                content: block.content,
                order_index: index
              };

              const { data, error: insertError } = await supabase
                .from('content_blocks')
                .insert(insertData)
                .select()
                .single();

              if (insertError) {
                console.error('Error saving initial block to DB:', insertError);
                throw insertError;
              }

              return block;
            })
          );

          console.log('Saved initial blocks to DB:', savedBlocks);
          setBlocks(initialBlocks);
        }
      } catch (error) {
        console.error('Error initializing blocks:', error);
        toast.error("Failed to initialize page content");
      } finally {
        setIsLoading(false);
      }
    };

    initializeBlocks();
  }, [pageId, initialBlocks]);

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
      const updatePromises = updatedBlocks.map(block => 
        supabase
          .from('content_blocks')
          .update({ order_index: block.order_index })
          .eq('id', block.id)
      );

      await Promise.all(updatePromises);
      setBlocks(updatedBlocks);
      toast.success("Block order updated successfully");
    } catch (error) {
      console.error('Error updating block order:', error);
      toast.error("Failed to update block order");
    }
  };

  const handleDeleteBlock = async (blockId: string) => {
    try {
      console.log('Deleting block:', blockId);
      const { error } = await supabase
        .from('content_blocks')
        .delete()
        .eq('id', blockId);

      if (error) throw error;

      setBlocks(prevBlocks => {
        const updatedBlocks = prevBlocks.filter(block => block.id !== blockId);
        return updatedBlocks.map((block, index) => ({
          ...block,
          order_index: index
        }));
      });

      if (selectedBlock?.id === blockId) {
        setSelectedBlock(null);
      }

      toast.success("Block deleted successfully");
    } catch (error) {
      console.error('Error deleting block:', error);
      toast.error("Failed to delete block");
    }
  };

  const handleAddBlock = async (blockType: BlockType) => {
    const defaultContent: BlockContent = {};
    
    const newBlock: ContentBlock = {
      id: crypto.randomUUID(),
      type: blockType,
      content: defaultContent,
      order_index: blocks.length,
    };

    try {
      console.log('Adding new block:', newBlock);
      const insertData: ContentBlockInsert = {
        id: newBlock.id,
        page_id: pageId,
        type: blockType as Database['public']['Enums']['content_block_type'],
        content: defaultContent,
        order_index: blocks.length
      };

      const { error } = await supabase
        .from('content_blocks')
        .insert(insertData);

      if (error) throw error;

      setBlocks(prevBlocks => [...prevBlocks, newBlock]);
      setShowComponentPicker(false);
      setSelectedBlock(newBlock);
      toast.success("Block added successfully");
    } catch (error) {
      console.error('Error adding block:', error);
      toast.error("Failed to add block");
    }
  };

  const handleUpdateBlock = async (blockId: string, content: BlockContent) => {
    try {
      console.log('Updating block:', blockId, content);
      const { error } = await supabase
        .from('content_blocks')
        .update({ content })
        .eq('id', blockId);

      if (error) throw error;

      setBlocks(prevBlocks => 
        prevBlocks.map(block => 
          block.id === blockId ? { ...block, content } : block
        )
      );
      
      setSelectedBlock(prev => 
        prev?.id === blockId ? { ...prev, content } : prev
      );
      
      toast.success("Block updated successfully");
    } catch (error) {
      console.error('Error updating block:', error);
      toast.error("Failed to update block");
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
                        className={`p-3 bg-white rounded-lg shadow cursor-pointer group ${
                          selectedBlock?.id === block.id ? 'ring-2 ring-primary' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span onClick={() => setSelectedBlock(block)}>
                            {block.type}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleDeleteBlock(block.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
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
            onUpdate={(blockId, content) => handleUpdateBlock(blockId, content)}
          />
        </div>
      )}

      <ComponentPicker
        open={showComponentPicker}
        onClose={() => setShowComponentPicker(false)}
        onSelect={(type: BlockType) => handleAddBlock(type)}
      />

      <Button
        className="fixed bottom-4 right-4"
        onClick={() => toast.success("Layout saved successfully")}
      >
        <Save className="w-4 h-4 mr-2" />
        Save Layout
      </Button>
    </div>
  );
};