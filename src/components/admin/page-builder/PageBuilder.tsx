import { useState, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Plus, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ComponentPicker } from "./ComponentPicker";
import { PropertyEditor } from "./PropertyEditor";
import { PreviewPane } from "./PreviewPane";
import { ContentBlock, BlockType, BlockContent } from "@/types/content-blocks";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type ContentBlockRow = Database["public"]["Tables"]["content_blocks"]["Row"];

interface PageBuilderProps {
  pageId: string;
  initialBlocks: ContentBlock[];
}

export const PageBuilder = ({ pageId, initialBlocks }: PageBuilderProps) => {
  const [blocks, setBlocks] = useState<ContentBlock[]>(initialBlocks);
  const [unsavedBlocks, setUnsavedBlocks] = useState<ContentBlock[]>(initialBlocks);
  const [selectedBlock, setSelectedBlock] = useState<ContentBlock | null>(null);
  const [isComponentPickerOpen, setIsComponentPickerOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const isMobile = useIsMobile();

  console.log("PageBuilder rendered with blocks:", blocks);

  const handleDragEnd = useCallback((result: any) => {
    if (!result.destination) return;

    const items = Array.from(unsavedBlocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order_index for all blocks
    const updatedBlocks = items.map((block, index) => ({
      ...block,
      order_index: index,
    }));

    setUnsavedBlocks(updatedBlocks);
    setHasUnsavedChanges(true);
  }, [unsavedBlocks]);

  const handleAddBlock = async (blockType: BlockType) => {
    console.log("Adding new block of type:", blockType);
    const newBlock: ContentBlock = {
      id: crypto.randomUUID(),
      type: blockType,
      content: {} as BlockContent,
      order_index: unsavedBlocks.length,
      page_id: pageId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    setUnsavedBlocks([...unsavedBlocks, newBlock]);
    setSelectedBlock(newBlock);
    setIsComponentPickerOpen(false);
    setHasUnsavedChanges(true);
  };

  const handleUpdateBlock = (blockId: string, content: BlockContent) => {
    console.log("Updating block content:", { blockId, content });
    
    setUnsavedBlocks(blocks => blocks.map(block => 
      block.id === blockId ? { ...block, content } : block
    ));
    
    if (selectedBlock?.id === blockId) {
      setSelectedBlock(prev => prev ? { ...prev, content } : null);
    }
    
    setHasUnsavedChanges(true);
  };

  const handleDeleteBlock = (blockId: string) => {
    console.log("Deleting block:", blockId);
    setUnsavedBlocks(blocks => blocks.filter(block => block.id !== blockId));
    if (selectedBlock?.id === blockId) {
      setSelectedBlock(null);
    }
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    try {
      console.log("Saving blocks to database:", unsavedBlocks);
      
      // First, delete all existing blocks for this page
      const { error: deleteError } = await supabase
        .from('content_blocks')
        .delete()
        .eq('page_id', pageId);

      if (deleteError) throw deleteError;

      // Then insert the current blocks
      if (unsavedBlocks.length > 0) {
        const { error } = await supabase.from('content_blocks')
          .upsert(
            unsavedBlocks.map(block => ({
              id: block.id,
              page_id: pageId,
              type: block.type as ContentBlockRow["type"],
              content: block.content as ContentBlockRow["content"],
              order_index: block.order_index
            }))
          );

        if (error) throw error;
      }
      
      setBlocks(unsavedBlocks);
      setHasUnsavedChanges(false);
      toast.success("Changes saved successfully");
    } catch (error) {
      console.error('Error saving blocks:', error);
      toast.error("Failed to save changes");
    }
  };

  return (
    <div className={cn(
      "grid gap-6",
      isMobile ? "grid-cols-1" : "grid-cols-12"
    )}>
      <div className={isMobile ? "w-full" : "col-span-8"}>
        <div className="space-y-4">
          <div className={cn(
            "flex gap-2",
            isMobile ? "grid grid-cols-2" : "justify-between items-center"
          )}>
            <Dialog open={isComponentPickerOpen} onOpenChange={setIsComponentPickerOpen}>
              <DialogTrigger asChild>
                <Button className={cn("w-full", !isMobile && "w-auto")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Component
                </Button>
              </DialogTrigger>
              <ComponentPicker 
                onSelect={handleAddBlock} 
                open={isComponentPickerOpen} 
                onClose={() => setIsComponentPickerOpen(false)}
              />
            </Dialog>

            <Button 
              variant="default" 
              onClick={handleSave}
              disabled={!hasUnsavedChanges}
              className={cn("w-full", !isMobile && "w-auto")}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
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
                  {unsavedBlocks.map((block, index) => (
                    <Draggable key={block.id} draggableId={block.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <PreviewPane
                            blocks={[block]}
                            onSelectBlock={setSelectedBlock}
                            selectedBlockId={selectedBlock?.id}
                            onDeleteBlock={handleDeleteBlock}
                            isAdmin={true}
                          />
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
      </div>

      <div className={isMobile ? "w-full" : "col-span-4"}>
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