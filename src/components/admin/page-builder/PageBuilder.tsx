import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Plus, Save, Trash2, Menu, ChevronLeft, PanelLeft } from "lucide-react";
import { ComponentPicker } from "./ComponentPicker";
import { PropertyEditor } from "./PropertyEditor";
import { PreviewPane } from "./PreviewPane";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { BlockType, ContentBlock, BlockContent } from "@/types/content-blocks";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

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
  const [showSidebar, setShowSidebar] = useState(true);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeBlocks = async () => {
      console.log('Initializing blocks for page:', pageId);
      try {
        const { data: dbBlocks, error } = await supabase
          .from('content_blocks')
          .select('*')
          .eq('page_id', pageId)
          .order('order_index');

        if (error) throw error;

        if (dbBlocks?.length > 0) {
          // Convert database content to frontend ContentBlock type
          const convertedBlocks: ContentBlock[] = dbBlocks.map(block => ({
            ...block,
            content: block.content as BlockContent
          }));
          setBlocks(convertedBlocks);
        } else if (initialBlocks?.length > 0) {
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
      const updatedBlocks = prevBlocks.filter(block => block.id !== blockId)
        .map((block, index) => ({
          ...block,
          order_index: index
        }));
      return updatedBlocks;
    });

    if (selectedBlock?.id === blockId) {
      setSelectedBlock(null);
    }

    setHasUnsavedChanges(true);
    toast.success("Block deleted");
  };

  const handleAddBlock = (blockType: BlockType) => {
    const newBlock: ContentBlock = {
      id: crypto.randomUUID(),
      type: blockType,
      content: {},
      order_index: blocks.length,
      page_id: pageId
    };

    setBlocks(prevBlocks => [...prevBlocks, newBlock]);
    setShowComponentPicker(false);
    setSelectedBlock(newBlock);
    setHasUnsavedChanges(true);
    toast.success(`Added ${blockType} block`);
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
      const { error: deleteError } = await supabase
        .from('content_blocks')
        .delete()
        .eq('page_id', pageId);

      if (deleteError) throw deleteError;

      if (blocks.length > 0) {
        // Convert blocks to database format
        const dbBlocks = blocks.map(block => ({
          id: block.id,
          type: block.type,
          content: block.content,
          order_index: block.order_index,
          page_id: pageId
        }));

        const { error: insertError } = await supabase
          .from('content_blocks')
          .insert(dbBlocks);

        if (insertError) throw insertError;
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
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const MainContent = () => (
    <div className="flex-1 h-full overflow-auto bg-gray-50/50">
      <div className="sticky top-0 z-10 bg-background border-b p-4">
        <div className="flex items-center justify-between max-w-[1200px] mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <PanelLeft className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => setShowComponentPicker(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Component
            </Button>
          </div>

          <Button
            onClick={handleSaveLayout}
            disabled={!hasUnsavedChanges || isSaving}
            className="bg-primary hover:bg-primary/90"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto p-4">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="blocks">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-4"
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
                        className={cn(
                          "bg-background rounded-lg shadow-sm border transition-all",
                          selectedBlock?.id === block.id && "ring-2 ring-primary"
                        )}
                        onClick={() => setSelectedBlock(block)}
                      >
                        <div className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium capitalize text-sm text-muted-foreground">
                              {block.type.replace(/_/g, ' ')}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteBlock(block.id);
                              }}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                          <PreviewPane 
                            blocks={[block]} 
                            onSelectBlock={setSelectedBlock}
                            selectedBlockId={selectedBlock?.id}
                            onDeleteBlock={handleDeleteBlock}
                            isAdmin={true}
                          />
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
    </div>
  );

  if (isMobile) {
    return (
      <div className="flex flex-col h-screen bg-background">
        <div className="flex items-center justify-between p-4 border-b">
          <Button variant="ghost" onClick={() => navigate("/admin/pages")}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleSaveLayout}
            disabled={!hasUnsavedChanges || isSaving}
            className="bg-primary hover:bg-primary/90"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>

        <div className="flex-1 overflow-auto">
          <MainContent />
        </div>

        <div className="border-t p-4">
          <Button 
            onClick={() => setShowComponentPicker(true)}
            className="w-full bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Component
          </Button>
        </div>

        {selectedBlock && (
          <Sheet>
            <SheetContent side="right" className="w-full sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Edit Component</SheetTitle>
              </SheetHeader>
              <PropertyEditor
                block={selectedBlock}
                onUpdate={handleUpdateBlock}
              />
            </SheetContent>
          </Sheet>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <div className={cn(
        "w-80 border-r bg-background transition-all duration-300",
        !showSidebar && "w-0 overflow-hidden"
      )}>
        <div className="p-4 border-b">
          <Button
            onClick={() => setShowComponentPicker(true)}
            className="w-full bg-primary hover:bg-primary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Component
          </Button>
        </div>
        <div className="p-4">
          <h3 className="font-semibold mb-4">Components</h3>
          <div className="space-y-2">
            {blocks.map((block) => (
              <div
                key={block.id}
                className={cn(
                  "p-3 rounded-lg cursor-pointer hover:bg-accent",
                  selectedBlock?.id === block.id && "bg-accent"
                )}
                onClick={() => setSelectedBlock(block)}
              >
                <span className="text-sm font-medium capitalize">
                  {block.type.replace(/_/g, ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <MainContent />

      {selectedBlock && !isMobile && (
        <div className="w-96 border-l bg-background overflow-y-auto">
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Edit Component</h3>
            <PropertyEditor
              block={selectedBlock}
              onUpdate={handleUpdateBlock}
            />
          </div>
        </div>
      )}

      <ComponentPicker
        open={showComponentPicker}
        onClose={() => setShowComponentPicker(false)}
        onSelect={handleAddBlock}
      />
    </div>
  );
};