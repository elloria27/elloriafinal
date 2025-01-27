import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ContentBlock } from "@/types/content-blocks";
import { ComponentPicker } from "./ComponentPicker";
import { PropertyEditor } from "./PropertyEditor";
import { PreviewPane } from "./PreviewPane";
import { v4 as uuidv4 } from "uuid";

interface PageBuilderProps {
  initialBlocks?: ContentBlock[];
  onSave?: (blocks: ContentBlock[]) => void;
}

export const PageBuilder = ({ initialBlocks = [], onSave }: PageBuilderProps) => {
  const [blocks, setBlocks] = useState<ContentBlock[]>(initialBlocks);
  const [selectedBlock, setSelectedBlock] = useState<ContentBlock | null>(null);

  const handleAddBlock = (type: string) => {
    const newBlock: ContentBlock = {
      id: uuidv4(),
      type: type as ContentBlock["type"],
      content: {},
      order_index: blocks.length
    };
    setBlocks([...blocks, newBlock]);
    setSelectedBlock(newBlock);
  };

  const handleUpdateBlock = (updatedBlock: ContentBlock) => {
    setBlocks(blocks.map(block => 
      block.id === updatedBlock.id ? updatedBlock : block
    ));
    setSelectedBlock(updatedBlock);
  };

  const handleMoveBlock = (blockId: string, direction: 'up' | 'down') => {
    const currentIndex = blocks.findIndex(block => block.id === blockId);
    if (currentIndex === -1) return;

    const newBlocks = [...blocks];
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;

    if (newIndex < 0 || newIndex >= blocks.length) return;

    [newBlocks[currentIndex], newBlocks[newIndex]] = 
    [newBlocks[newIndex], newBlocks[currentIndex]];

    // Update order_index for affected blocks
    newBlocks[currentIndex].order_index = currentIndex;
    newBlocks[newIndex].order_index = newIndex;

    setBlocks(newBlocks);
  };

  const handleDeleteBlock = (blockId: string) => {
    setBlocks(blocks.filter(block => block.id !== blockId));
    if (selectedBlock?.id === blockId) {
      setSelectedBlock(null);
    }
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update order_index for all blocks
    const updatedItems = items.map((item, index) => ({
      ...item,
      order_index: index
    }));

    setBlocks(updatedItems);
  };

  useEffect(() => {
    if (onSave) {
      onSave(blocks);
    }
  }, [blocks, onSave]);

  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-3">
        <ComponentPicker onSelect={handleAddBlock} />
      </div>
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="col-span-6">
          <PreviewPane 
            blocks={blocks}
            onSelectBlock={setSelectedBlock}
            onMoveBlock={handleMoveBlock}
            onDeleteBlock={handleDeleteBlock}
          />
        </div>
      </DragDropContext>

      <div className="col-span-3">
        {selectedBlock && (
          <PropertyEditor
            block={selectedBlock}
            onUpdate={handleUpdateBlock}
          />
        )}
      </div>
    </div>
  );
};