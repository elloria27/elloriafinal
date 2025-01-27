import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ContentBlock, BlockContent, BlogPreviewContent } from "@/types/content-blocks";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, MoveUp, MoveDown } from "lucide-react";
import { toast } from "sonner";

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

  const getBlogArticles = () => {
    if (!content || !('articles' in content)) {
      return [];
    }

    const articles = content.articles;
    if (!Array.isArray(articles)) {
      return [];
    }

    return articles.map(article => {
      if (typeof article === 'object' && article !== null) {
        return {
          title: String(article.title || ''),
          category: String(article.category || ''),
          image: String(article.image || '')
        };
      }
      return {
        title: '',
        category: '',
        image: ''
      };
    });
  };

  const handleArticleChange = (index: number, field: keyof BlogPreviewContent['articles'][0], value: string) => {
    const articles = getBlogArticles();
    const newArticles = [...articles];
    newArticles[index] = { ...newArticles[index], [field]: value };
    handleChange('articles', newArticles);
  };

  const handleChange = (key: string, value: any) => {
    const newContent = { ...content, [key]: value };
    setContent(newContent);
    onUpdate(block.id, newContent);
  };

  const addArticle = () => {
    const newArticle = {
      title: "New Article",
      category: "Category",
      image: "/placeholder.svg"
    };
    
    const articles = getBlogArticles();
    handleChange('articles', [...articles, newArticle]);
  };

  const removeArticle = (index: number) => {
    const articles = getBlogArticles();
    const newArticles = articles.filter((_, i) => i !== index);
    handleChange('articles', newArticles);
  };

  const handleDelete = () => {
    if (onDelete && window.confirm("Are you sure you want to delete this block?")) {
      onDelete(block.id);
      toast.success("Block deleted successfully");
    }
  };

  const renderFields = () => {
    console.log('Rendering fields for block type:', block.type);
    console.log('Current content:', content);

    switch (block.type) {
      case 'about_hero_section':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">About Hero Section Settings</h3>
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
              <Input
                value={String(content.description || '')}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter description"
              />
            </div>
            <div>
              <Label>Image URL</Label>
              <Input
                value={String(content.image || '')}
                onChange={(e) => handleChange('image', e.target.value)}
                placeholder="Enter image URL"
              />
            </div>
            <div>
              <Label>Button Text</Label>
              <Input
                value={String(content.buttonText || '')}
                onChange={(e) => handleChange('buttonText', e.target.value)}
                placeholder="Enter button text"
              />
            </div>
            <div>
              <Label>Button URL</Label>
              <Input
                value={String(content.buttonUrl || '')}
                onChange={(e) => handleChange('buttonUrl', e.target.value)}
                placeholder="Enter button URL"
              />
            </div>
          </div>
        );

      case 'about_story':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">About Story Settings</h3>
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
              <Input
                value={String(content.description || '')}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter description"
              />
            </div>
            <div>
              <Label>Image URL</Label>
              <Input
                value={String(content.image || '')}
                onChange={(e) => handleChange('image', e.target.value)}
                placeholder="Enter image URL"
              />
            </div>
            <div>
              <Label>Timeline</Label>
              <Input
                value={String(content.timeline || '')}
                onChange={(e) => handleChange('timeline', e.target.value)}
                placeholder="Enter timeline items (comma separated)"
              />
            </div>
          </div>
        );

      case 'about_mission':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">About Mission Settings</h3>
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
              <Input
                value={String(content.description || '')}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter description"
              />
            </div>
            <div>
              <Label>Values</Label>
              <Input
                value={String(content.values || '')}
                onChange={(e) => handleChange('values', e.target.value)}
                placeholder="Enter values (comma separated)"
              />
            </div>
          </div>
        );

      case 'about_sustainability':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">About Sustainability Settings</h3>
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
              <Input
                value={String(content.description || '')}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter description"
              />
            </div>
            <div>
              <Label>Stats</Label>
              <Input
                value={String(content.stats || '')}
                onChange={(e) => handleChange('stats', e.target.value)}
                placeholder="Enter stats (comma separated)"
              />
            </div>
            <div>
              <Label>Initiatives</Label>
              <Input
                value={String(content.initiatives || '')}
                onChange={(e) => handleChange('initiatives', e.target.value)}
                placeholder="Enter initiatives (comma separated)"
              />
            </div>
          </div>
        );

      case 'about_team':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">About Team Settings</h3>
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
              <Input
                value={String(content.description || '')}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter description"
              />
            </div>
            <div>
              <Label>Members</Label>
              <Input
                value={String(content.members || '')}
                onChange={(e) => handleChange('members', e.target.value)}
                placeholder="Enter team members (comma separated)"
              />
            </div>
          </div>
        );

      case 'about_customer_impact':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">About Customer Impact Settings</h3>
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
              <Input
                value={String(content.description || '')}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter description"
              />
            </div>
            <div>
              <Label>Testimonials</Label>
              <Input
                value={String(content.testimonials || '')}
                onChange={(e) => handleChange('testimonials', e.target.value)}
                placeholder="Enter testimonials (comma separated)"
              />
            </div>
            <div>
              <Label>Stats</Label>
              <Input
                value={String(content.stats || '')}
                onChange={(e) => handleChange('stats', e.target.value)}
                placeholder="Enter stats (comma separated)"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-gray-500 italic">
            No editable properties for this component type.
          </div>
    }
  };

  return (
    <div className="space-y-6">
      {renderFields()}
    </div>
  );
};
