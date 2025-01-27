import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ContentBlock, BlockContent } from "@/types/content-blocks";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, MoveUp, MoveDown } from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";

interface PropertyEditorProps {
  block: ContentBlock;
  onUpdate: (id: string, content: BlockContent) => void;
  onDelete?: (id: string) => void;
  onMoveUp?: (id: string) => void;
  onMoveDown?: (id: string) => void;
  isFirst?: boolean;
  isLast?: boolean;
}

export const PropertyEditor = ({ 
  block, 
  onUpdate, 
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast 
}: PropertyEditorProps) => {
  const [content, setContent] = useState<BlockContent>(block.content);

  useEffect(() => {
    setContent(block.content);
  }, [block.content]);

  const handleChange = (key: string, value: any) => {
    const newContent = { ...content, [key]: value };
    setContent(newContent);
    onUpdate(block.id, newContent);
  };

  const handleDelete = () => {
    if (onDelete && window.confirm("Are you sure you want to delete this block?")) {
      onDelete(block.id);
      toast.success("Block deleted successfully");
    }
  };

  const renderFields = () => {
    switch (block.type) {
      case 'hero':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Hero Section Settings</h3>
              <div className="flex gap-2">
                {!isFirst && onMoveUp && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMoveUp(block.id)}
                    title="Move Up"
                  >
                    <MoveUp className="h-4 w-4" />
                  </Button>
                )}
                {!isLast && onMoveDown && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMoveDown(block.id)}
                    title="Move Down"
                  >
                    <MoveDown className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  title="Delete Block"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label>Title</Label>
              <Input
                value={String(content.title || '')}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter hero title"
              />
            </div>

            <div>
              <Label>Subtitle</Label>
              <Input
                value={String(content.subtitle || '')}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                placeholder="Enter hero subtitle"
              />
            </div>

            <div>
              <Label>Video URL</Label>
              <Input
                value={String(content.videoUrl || '')}
                onChange={(e) => handleChange('videoUrl', e.target.value)}
                placeholder="Enter video URL"
              />
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Features Section Settings</h3>
              <div className="flex gap-2">
                {!isFirst && onMoveUp && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMoveUp(block.id)}
                    title="Move Up"
                  >
                    <MoveUp className="h-4 w-4" />
                  </Button>
                )}
                {!isLast && onMoveDown && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMoveDown(block.id)}
                    title="Move Down"
                  >
                    <MoveDown className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  title="Delete Block"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label>Title</Label>
              <Input
                value={String(content.title || '')}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter section title"
              />
            </div>

            <div>
              <Label>Subtitle</Label>
              <Input
                value={String(content.subtitle || '')}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                placeholder="Enter section subtitle"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={String(content.description || '')}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter section description"
              />
            </div>
          </div>
        );

      case 'game_changer':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Game Changer Section Settings</h3>
              <div className="flex gap-2">
                {!isFirst && onMoveUp && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMoveUp(block.id)}
                    title="Move Up"
                  >
                    <MoveUp className="h-4 w-4" />
                  </Button>
                )}
                {!isLast && onMoveDown && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMoveDown(block.id)}
                    title="Move Down"
                  >
                    <MoveDown className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  title="Delete Block"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label>Title</Label>
              <Input
                value={String(content.title || '')}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter section title"
              />
            </div>

            <div>
              <Label>Subtitle</Label>
              <Input
                value={String(content.subtitle || '')}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                placeholder="Enter section subtitle"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={String(content.description || '')}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter section description"
              />
            </div>
          </div>
        );

      case 'store_brands':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Store Brands Section Settings</h3>
              <div className="flex gap-2">
                {!isFirst && onMoveUp && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMoveUp(block.id)}
                    title="Move Up"
                  >
                    <MoveUp className="h-4 w-4" />
                  </Button>
                )}
                {!isLast && onMoveDown && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMoveDown(block.id)}
                    title="Move Down"
                  >
                    <MoveDown className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  title="Delete Block"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label>Title</Label>
              <Input
                value={String(content.title || '')}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter section title"
              />
            </div>

            <div>
              <Label>Subtitle</Label>
              <Input
                value={String(content.subtitle || '')}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                placeholder="Enter section subtitle"
              />
            </div>
          </div>
        );

      case 'sustainability':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Sustainability Section Settings</h3>
              <div className="flex gap-2">
                {!isFirst && onMoveUp && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMoveUp(block.id)}
                    title="Move Up"
                  >
                    <MoveUp className="h-4 w-4" />
                  </Button>
                )}
                {!isLast && onMoveDown && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMoveDown(block.id)}
                    title="Move Down"
                  >
                    <MoveDown className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  title="Delete Block"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label>Title</Label>
              <Input
                value={String(content.title || '')}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter section title"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={String(content.description || '')}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter section description"
              />
            </div>
          </div>
        );

      case 'product_carousel':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Product Carousel Settings</h3>
              <div className="flex gap-2">
                {!isFirst && onMoveUp && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMoveUp(block.id)}
                    title="Move Up"
                  >
                    <MoveUp className="h-4 w-4" />
                  </Button>
                )}
                {!isLast && onMoveDown && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMoveDown(block.id)}
                    title="Move Down"
                  >
                    <MoveDown className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  title="Delete Block"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label>Title</Label>
              <Input
                value={String(content.title || '')}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter section title"
              />
            </div>

            <div>
              <Label>Subtitle</Label>
              <Input
                value={String(content.subtitle || '')}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                placeholder="Enter section subtitle"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={String(content.description || '')}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter section description"
              />
            </div>
          </div>
        );

      case 'testimonials':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Testimonials Section Settings</h3>
              <div className="flex gap-2">
                {!isFirst && onMoveUp && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMoveUp(block.id)}
                    title="Move Up"
                  >
                    <MoveUp className="h-4 w-4" />
                  </Button>
                )}
                {!isLast && onMoveDown && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMoveDown(block.id)}
                    title="Move Down"
                  >
                    <MoveDown className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  title="Delete Block"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label>Title</Label>
              <Input
                value={String(content.title || '')}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter section title"
              />
            </div>
          </div>
        );

      case 'blog_preview':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Blog Preview Settings</h3>
              <div className="flex gap-2">
                {!isFirst && onMoveUp && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMoveUp(block.id)}
                    title="Move Up"
                  >
                    <MoveUp className="h-4 w-4" />
                  </Button>
                )}
                {!isLast && onMoveDown && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMoveDown(block.id)}
                    title="Move Down"
                  >
                    <MoveDown className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  title="Delete Block"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label>Title</Label>
              <Input
                value={String(content.title || '')}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter section title"
              />
            </div>

            <div>
              <Label>Subtitle</Label>
              <Input
                value={String(content.subtitle || '')}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                placeholder="Enter section subtitle"
              />
            </div>
          </div>
        );

      case 'newsletter':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Newsletter Section Settings</h3>
              <div className="flex gap-2">
                {!isFirst && onMoveUp && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMoveUp(block.id)}
                    title="Move Up"
                  >
                    <MoveUp className="h-4 w-4" />
                  </Button>
                )}
                {!isLast && onMoveDown && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMoveDown(block.id)}
                    title="Move Down"
                  >
                    <MoveDown className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  title="Delete Block"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div>
              <Label>Title</Label>
              <Input
                value={String(content.title || '')}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Enter section title"
              />
            </div>

            <div>
              <Label>Subtitle</Label>
              <Input
                value={String(content.subtitle || '')}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                placeholder="Enter section subtitle"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-gray-500 italic">
            No editable properties for this component type.
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {renderFields()}
    </div>
  );
};