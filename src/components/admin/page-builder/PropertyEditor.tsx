import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ContentBlock, BlockContent, BlogPreviewContent } from "@/types/content-blocks";
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

  const handleTimelineChange = (index: number, field: string, value: string) => {
    const timeline = Array.isArray(content.timeline) ? [...content.timeline] : [];
    timeline[index] = { ...timeline[index], [field]: value };
    handleChange('timeline', timeline);
  };

  const addTimelineItem = () => {
    const timeline = Array.isArray(content.timeline) ? [...content.timeline] : [];
    timeline.push({
      year: new Date().getFullYear().toString(),
      title: "New Milestone",
      description: "Description of the milestone"
    });
    handleChange('timeline', timeline);
  };

  const removeTimelineItem = (index: number) => {
    const timeline = Array.isArray(content.timeline) ? [...content.timeline] : [];
    timeline.splice(index, 1);
    handleChange('timeline', timeline);
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
      case 'about_story':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Story Section Settings</h3>
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
              <Label>Video URL</Label>
              <Input
                value={String(content.videoUrl || '')}
                onChange={(e) => handleChange('videoUrl', e.target.value)}
                placeholder="Enter video URL (e.g., YouTube embed URL)"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Timeline</Label>
                <Button onClick={addTimelineItem} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Milestone
                </Button>
              </div>
              
              {Array.isArray(content.timeline) && content.timeline.map((item: any, index: number) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <Label>Milestone {index + 1}</Label>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeTimelineItem(index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                  
                  <div>
                    <Label>Year</Label>
                    <Input
                      value={item.year || ''}
                      onChange={(e) => handleTimelineChange(index, 'year', e.target.value)}
                      placeholder="Enter year"
                    />
                  </div>

                  <div>
                    <Label>Title</Label>
                    <Input
                      value={item.title || ''}
                      onChange={(e) => handleTimelineChange(index, 'title', e.target.value)}
                      placeholder="Enter milestone title"
                    />
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={item.description || ''}
                      onChange={(e) => handleTimelineChange(index, 'description', e.target.value)}
                      placeholder="Enter milestone description"
                    />
                  </div>
                </div>
              ))}
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
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Articles</Label>
                <Button onClick={addArticle} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Article
                </Button>
              </div>
              
              {getBlogArticles().map((article, index) => (
                <div key={index} className="space-y-4 p-4 border rounded-lg">
                  <div className="flex justify-between items-center">
                    <Label>Article {index + 1}</Label>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => removeArticle(index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                  
                  <div>
                    <Label>Title</Label>
                    <Input
                      value={article.title}
                      onChange={(e) => handleArticleChange(index, 'title', e.target.value)}
                      placeholder="Enter article title"
                    />
                  </div>

                  <div>
                    <Label>Category</Label>
                    <Input
                      value={article.category}
                      onChange={(e) => handleArticleChange(index, 'category', e.target.value)}
                      placeholder="Enter article category"
                    />
                  </div>

                  <div>
                    <Label>Image URL</Label>
                    <Input
                      value={article.image}
                      onChange={(e) => handleArticleChange(index, 'image', e.target.value)}
                      placeholder="Enter article image URL"
                    />
                  </div>
                </div>
              ))}
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