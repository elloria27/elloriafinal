import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Plus, Save } from "lucide-react";
import { ComponentPicker } from "./ComponentPicker";
import { PropertyEditor } from "./PropertyEditor";
import { PreviewPane } from "./PreviewPane";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { BlockType, ContentBlock, BlockContent } from "@/types/content-blocks";
import { Database } from "@/integrations/supabase/types";

type ContentBlockInsert = Database['public']['Tables']['content_blocks']['Insert'];

export interface PageBuilderProps {
  pageId: string;
  initialBlocks: ContentBlock[];
}

export const PageBuilder = ({ pageId, initialBlocks }: PageBuilderProps) => {
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [selectedBlock, setSelectedBlock] = useState<ContentBlock | null>(null);
  const [showComponentPicker, setShowComponentPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
          setBlocks(initialBlocks);
        }
      } catch (error) {
        console.error('Error initializing blocks:', error);
        toast.error("Failed to load page content");
      } finally {
        setIsLoading(false);
      }
    };

    initializeBlocks();
  }, [pageId, initialBlocks]);

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
    setHasUnsavedChanges(true);
  };

  const handleDeleteBlock = (blockId: string) => {
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

    setHasUnsavedChanges(true);
  };

  const handleAddBlock = (blockType: BlockType) => {
    const defaultContent: BlockContent = {};
    
    const newBlock: ContentBlock = {
      id: crypto.randomUUID(),
      type: blockType,
      content: defaultContent,
      order_index: blocks.length,
      page_id: pageId
    };

    setBlocks(prevBlocks => [...prevBlocks, newBlock]);
    setShowComponentPicker(false);
    setSelectedBlock(newBlock);
    setHasUnsavedChanges(true);
  };

  const handleUpdateBlock = (blockId: string, content: BlockContent) => {
    setBlocks(prevBlocks => 
      prevBlocks.map(block => 
        block.id === blockId ? { ...block, content } : block
      )
    );
    
    setSelectedBlock(prev => 
      prev?.id === blockId ? { ...prev, content } : prev
    );
    
    setHasUnsavedChanges(true);
  };

  const handleSaveLayout = async () => {
    if (!hasUnsavedChanges) return;
    
    setIsSaving(true);
    try {
      console.log('Saving layout with blocks:', blocks);

      // Only delete if there are existing blocks to delete
      if (blocks.length > 0) {
        const existingBlockIds = blocks.map(block => block.id);
        const { error: deleteError } = await supabase
          .from('content_blocks')
          .delete()
          .eq('page_id', pageId)
          .not('id', 'in', existingBlockIds);

        if (deleteError) {
          console.error('Error deleting blocks:', deleteError);
          throw deleteError;
        }
      } else {
        // If no blocks, delete all blocks for this page
        const { error: deleteError } = await supabase
          .from('content_blocks')
          .delete()
          .eq('page_id', pageId);

        if (deleteError) {
          console.error('Error deleting all blocks:', deleteError);
          throw deleteError;
        }
      }

      // Only attempt to save blocks if there are any
      if (blocks.length > 0) {
        const blockUpdates = blocks.map(block => {
          const blockData: ContentBlockInsert = {
            id: block.id,
            page_id: pageId,
            type: block.type as Database['public']['Enums']['content_block_type'],
            content: block.content,
            order_index: block.order_index
          };
          return supabase
            .from('content_blocks')
            .upsert(blockData)
            .select();
        });

        const results = await Promise.all(blockUpdates);
        const errors = results.filter(result => result.error);

        if (errors.length > 0) {
          console.error('Errors saving blocks:', errors);
          throw new Error('Failed to save some blocks');
        }
      }

      setHasUnsavedChanges(false);
      toast.success("Layout saved successfully");
    } catch (error) {
      console.error('Error saving layout:', error);
      toast.error("Failed to save layout");
    } finally {
      setIsSaving(false);
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
                        onClick={() => setSelectedBlock(block)}
                      >
                        <div className="flex items-center justify-between">
                          <span>{block.type}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteBlock(block.id);
                            }}
                          >
                            <div className="h-4 w-4 text-red-500">×</div>
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
          selectedBlockId={selectedBlock?.id}
        />
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
        disabled={!hasUnsavedChanges || isSaving}
      >
        <Save className="w-4 h-4 mr-2" />
        {isSaving ? 'Saving...' : 'Save Layout'}
      </Button>
    </div>
  );
};