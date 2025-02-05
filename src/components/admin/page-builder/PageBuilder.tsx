import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import { Plus, Save, Trash2, Menu, Settings } from "lucide-react";
import { ComponentPicker } from "./ComponentPicker";
import { PropertyEditor } from "./PropertyEditor";
import { PreviewPane } from "./PreviewPane";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { BlockType, ContentBlock, BlockContent } from "@/types/content-blocks";
import { Database } from "@/integrations/supabase/types";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

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
  const [showSidebar, setShowSidebar] = useState(true);
  const isMobile = useIsMobile();

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

        console.log('Fetched blocks:', dbBlocks);

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
          console.log('Transformed blocks:', transformedBlocks);
          setBlocks(transformedBlocks);
        } else if (initialBlocks && initialBlocks.length > 0) {
          console.log('Using initial blocks:', initialBlocks);
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
        const blocksToInsert: ContentBlockInsert[] = blocks.map(block => ({
          id: block.id,
          page_id: pageId,
          type: block.type as Database['public']['Enums']['content_block_type'],
          content: block.content,
          order_index: block.order_index
        }));

        const { error: insertError } = await supabase
          .from('content_blocks')
          .insert(blocksToInsert);

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

  const BlocksList = () => (
    <div className="space-y-4 p-4">
      <Button 
        onClick={() => setShowComponentPicker(true)}
        className="w-full bg-primary hover:bg-primary/90"
        size="lg"
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
                      className={cn(
                        "p-4 bg-white rounded-lg shadow-sm border cursor-pointer group transition-all",
                        selectedBlock?.id === block.id && "ring-2 ring-primary border-primary",
                        "hover:border-primary/50"
                      )}
                      onClick={() => setSelectedBlock(block)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium capitalize">{block.type.replace(/_/g, ' ')}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteBlock(block.id);
                          }}
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
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        <div className="flex items-center justify-between p-4 border-b bg-white">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Components</SheetTitle>
              </SheetHeader>
              <BlocksList />
            </SheetContent>
          </Sheet>

          <Button
            size="sm"
            onClick={handleSaveLayout}
            disabled={!hasUnsavedChanges || isSaving}
            className="bg-primary hover:bg-primary/90"
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>

          {selectedBlock && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[300px] sm:w-[400px]">
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

        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="max-w-[100vw] mx-auto bg-white">
            <PreviewPane 
              blocks={blocks} 
              onSelectBlock={setSelectedBlock}
              selectedBlockId={selectedBlock?.id}
              onDeleteBlock={handleDeleteBlock}
              isAdmin={true}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className={cn(
        "border-r bg-gray-50/50 transition-all duration-300",
        showSidebar ? "w-80" : "w-0 overflow-hidden"
      )}>
        <BlocksList />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="sticky top-0 z-10 bg-white border-b p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <Menu className="h-4 w-4" />
            </Button>

            <Button
              size="sm"
              onClick={handleSaveLayout}
              disabled={!hasUnsavedChanges || isSaving}
              className="bg-primary hover:bg-primary/90"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-gray-100">
          <div className="max-w-[1200px] mx-auto bg-white shadow-lg my-8">
            <PreviewPane 
              blocks={blocks} 
              onSelectBlock={setSelectedBlock}
              selectedBlockId={selectedBlock?.id}
              onDeleteBlock={handleDeleteBlock}
              isAdmin={true}
            />
          </div>
        </div>
      </div>

      {selectedBlock && (
        <div className="w-96 border-l bg-gray-50/50 overflow-y-auto">
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